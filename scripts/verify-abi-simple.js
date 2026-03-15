import { createPublicClient, http, defineChain, getAddress, keccak256 } from "viem";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";

const EIP1967_SLOT = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";

// ==================================================
// ABI LOADING
// ==================================================

async function loadTsExport(filePath, exportName) {
  const content = await readFile(filePath, 'utf-8');

  let exportRegex = new RegExp(`export\\s+const\\s+${exportName}\\s*=\\s*(\\[[\\s\\S]*?\\])\\s+as\\s+const`, 'm');
  let match = content.match(exportRegex);

  if (!match) {
    exportRegex = new RegExp(`export\\s+const\\s+${exportName}\\s*=\\s*(\\[[\\s\\S]*?\\]);?\\s*$`, 'm');
    match = content.match(exportRegex);
  }

  if (!match) {
    throw new Error(`Could not find export ${exportName} in ${filePath}`);
  }

  let jsonString = match[1]
    .replace(/,(\s*[}\]])/g, '$1')
    .replace(/([{,]\s*)(\w+):/g, '$1"$2":')
    .replace(/'/g, '"');

  return JSON.parse(jsonString);
}

// ==================================================
// CONFIG PARSING (from build_deploy.yml)
// ==================================================

async function loadBuildDeployConfig(env) {
  const buildDeployPath = resolve(".github/workflows/build_deploy.yml");
  const content = await readFile(buildDeployPath, 'utf-8');

  if (env === 'stage') {
    // Extract STAGE_SSV_NETWORKS JSON
    const stageNetworksMatch = content.match(/STAGE_SSV_NETWORKS:\s*>\s*([\s\S]*?)(?=\n\s{6}[A-Z_]+:|$)/);

    if (!stageNetworksMatch) {
      throw new Error('Could not find STAGE_SSV_NETWORKS in build_deploy.yml');
    }

    // Clean up the JSON string
    let jsonStr = stageNetworksMatch[1]
      .replace(/\\/g, '')  // Remove escape slashes
      .replace(/\n\s*/g, '')  // Remove newlines and spaces
      .replace(/"?\$\{\{[^}]+\}\}"?/g, '""')  // Replace GitHub secrets with empty strings
      .trim();

    const networks = JSON.parse(jsonStr);
    const network = networks[0];

    return {
      networkId: network.networkId,
      setterContractAddress: network.setterContractAddress,
      getterContractAddress: network.getterContractAddress,
      environment: 'stage'
    };
  } else if (env === 'production') {
    // For production, we need to use GitHub secrets (can't read from file)
    // Instead, use environment variables if available
    const setter = process.env.PROD_HOODI_NETWORK_SETTER_CONTRACT_ADDRESS_V4;
    const getter = process.env.PROD_HOODI_NETWORK_GETTER_CONTRACT_ADDRESS_V4;

    if (setter && getter) {
      return {
        networkId: 560048,
        setterContractAddress: setter,
        getterContractAddress: getter,
        environment: 'production'
      };
    } else {
      // Fallback: try to extract from .env.production
      const envFile = resolve('.env.production');
      const envContent = await readFile(envFile, 'utf-8');
      const match = envContent.match(/VITE_SSV_NETWORKS='(.+)'/);
      if (!match) {
        throw new Error('Could not find production contract addresses. Set env vars: PROD_HOODI_NETWORK_SETTER_CONTRACT_ADDRESS_V4, PROD_HOODI_NETWORK_GETTER_CONTRACT_ADDRESS_V4');
      }
      const networks = JSON.parse(match[1]);
      return {
        networkId: networks[0].networkId,
        setterContractAddress: networks[0].setterContractAddress,
        getterContractAddress: networks[0].getterContractAddress,
        environment: 'production (from .env)'
      };
    }
  } else {
    throw new Error(`Unknown environment: ${env}. Use 'stage' or 'production'`);
  }
}

// ==================================================
// ON-CHAIN ABI FETCHING
// ==================================================

async function fetchAbiFromEtherscan(address, chainId, apiKey) {
  const url = `https://api.etherscan.io/v2/api?apikey=${apiKey}&chainid=${chainId}&module=contract&action=getabi&address=${address}`;

  const response = await fetch(url);
  const json = await response.json();

  if (json.status !== "1") {
    throw new Error(`Etherscan error: ${json.message} — ${json.result}`);
  }

  return JSON.parse(json.result);
}

async function getImplementationAddress(proxyAddress, client) {
  const slot = await client.getStorageAt({
    address: proxyAddress,
    slot: EIP1967_SLOT
  });

  if (slot && slot !== "0x" + "0".repeat(64)) {
    return getAddress("0x" + slot.slice(-40));
  }

  return null;
}

// ==================================================
// ABI NORMALIZATION
// ==================================================

function normalizeAbi(abi) {
  const typeOrder = {
    fallback: 1,
    receive: 2,
    function: 3,
    event: 4,
    error: 5
  };

  return abi
    // Filter out constructors (Etherscan doesn't include them)
    .filter(item => item.type !== 'constructor')
    .map(item => {
      // Normalize field order within each item
      const normalized = {};
      if (item.type) normalized.type = item.type;
      if (item.name) normalized.name = item.name;
      if (item.inputs) normalized.inputs = item.inputs;
      if (item.outputs) normalized.outputs = item.outputs;
      if (item.stateMutability) normalized.stateMutability = item.stateMutability;
      if (item.anonymous !== undefined) normalized.anonymous = item.anonymous;
      return normalized;
    })
    .sort((a, b) => {
      // Sort by type → name → inputs length
      const typeA = typeOrder[a.type] ?? 99;
      const typeB = typeOrder[b.type] ?? 99;
      if (typeA !== typeB) return typeA - typeB;

      const nameA = a.name ?? '';
      const nameB = b.name ?? '';
      if (nameA !== nameB) return nameA.localeCompare(nameB);

      const inputsA = a.inputs?.length ?? 0;
      const inputsB = b.inputs?.length ?? 0;
      return inputsA - inputsB;
    });
}

function hashAbi(abi) {
  const normalized = normalizeAbi(abi);
  const jsonString = JSON.stringify(normalized);
  return keccak256(new TextEncoder().encode(jsonString));
}

// ==================================================
// MAIN
// ==================================================

async function main() {
  // Parse arguments
  const [, , ...args] = process.argv;
  let env = "stage"; // default
  let apiKey = "7D5ZWV94V4N8G13GXI2PWGM8PU8G7NY366";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--env' && i + 1 < args.length) {
      env = args[++i];
    } else if (args[i] === '--etherscan-api-key' && i + 1 < args.length) {
      apiKey = args[++i];
    }
  }

  console.log(`\n🔍 Verifying ABI for ssv-web-app-aligned (env: ${env})\n`);

  // Load config from build_deploy.yml
  console.log(`📄 Reading config from: .github/workflows/build_deploy.yml`);
  const networkConfig = await loadBuildDeployConfig(env);

  console.log(`\n📡 Network: ${networkConfig.networkId} (Hoodi)`);
  console.log(`📍 Setter: ${networkConfig.setterContractAddress}`);
  console.log(`📍 Getter: ${networkConfig.getterContractAddress}`);

  // Setup viem client
  const chain = defineChain({
    id: networkConfig.networkId,
    name: "Hoodi",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: {
        http: ["https://ethereum-hoodi-rpc.publicnode.com/d8a2cc6e7483872e917d7899f9403d738b001c80e37d66834f4e40e9efb54a27"]
      }
    }
  });

  const client = createPublicClient({
    chain,
    transport: http(chain.rpcUrls.default.http[0])
  });

  // Check Setter contract
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🔧 Verifying SETTER contract`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  // Load local setter ABI (use testnet for stage, mainnet for production)
  const abiFolder = env === 'stage' ? 'testnet' : 'mainnet';
  const abiExportPrefix = env === 'stage' ? 'Testnet' : 'Mainnet';
  const setterAbiPath = resolve(`src/lib/abi/${abiFolder}/v4/setter.ts`);
  console.log(`\n📁 Local ABI: ${setterAbiPath}`);
  const localSetterAbi = await loadTsExport(setterAbiPath, `${abiExportPrefix}V4SetterABI`);
  console.log(`   Items: ${localSetterAbi.length}`);

  // Get implementation address
  const setterImplAddress = await getImplementationAddress(networkConfig.setterContractAddress, client);
  console.log(`\n🔗 Proxy: ${networkConfig.setterContractAddress}`);
  if (setterImplAddress && setterImplAddress.toLowerCase() !== networkConfig.setterContractAddress.toLowerCase()) {
    console.log(`🔗 Implementation: ${setterImplAddress}`);
  }

  // Fetch on-chain ABI
  console.log(`\n⬇️  Fetching on-chain ABI from Etherscan...`);
  const onChainSetterAbi = await fetchAbiFromEtherscan(
    setterImplAddress || networkConfig.setterContractAddress,
    networkConfig.networkId,
    apiKey
  );
  console.log(`   Items: ${onChainSetterAbi.length}`);

  // Compare (with normalization)
  const localSetterHash = hashAbi(localSetterAbi);
  const onChainSetterHash = hashAbi(onChainSetterAbi);

  console.log(`\n🔐 Local ABI hash:    ${localSetterHash}`);
  console.log(`🔐 On-chain ABI hash: ${onChainSetterHash}`);

  const setterMatch = localSetterHash === onChainSetterHash;
  console.log(`\n${setterMatch ? '✅ MATCH!' : '❌ MISMATCH'}`);

  if (!setterMatch) {
    console.log(`\n⚠️  Difference in item count: ${Math.abs(localSetterAbi.length - onChainSetterAbi.length)}`);
  }

  // Check Getter contract
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🔍 Verifying GETTER contract`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  // Load local getter ABI (use testnet for stage, mainnet for production)
  const getterAbiPath = resolve(`src/lib/abi/${abiFolder}/v4/getter.ts`);
  console.log(`\n📁 Local ABI: ${getterAbiPath}`);
  const localGetterAbi = await loadTsExport(getterAbiPath, `${abiExportPrefix}V4GetterABI`);
  console.log(`   Items: ${localGetterAbi.length}`);

  // Get implementation address
  const getterImplAddress = await getImplementationAddress(networkConfig.getterContractAddress, client);
  console.log(`\n🔗 Proxy: ${networkConfig.getterContractAddress}`);
  if (getterImplAddress && getterImplAddress.toLowerCase() !== networkConfig.getterContractAddress.toLowerCase()) {
    console.log(`🔗 Implementation: ${getterImplAddress}`);
  }

  // Fetch on-chain ABI
  console.log(`\n⬇️  Fetching on-chain ABI from Etherscan...`);
  const onChainGetterAbi = await fetchAbiFromEtherscan(
    getterImplAddress || networkConfig.getterContractAddress,
    networkConfig.networkId,
    apiKey
  );
  console.log(`   Items: ${onChainGetterAbi.length}`);

  // Compare (with normalization)
  const localGetterHash = hashAbi(localGetterAbi);
  const onChainGetterHash = hashAbi(onChainGetterAbi);

  console.log(`\n🔐 Local ABI hash:    ${localGetterHash}`);
  console.log(`🔐 On-chain ABI hash: ${onChainGetterHash}`);

  const getterMatch = localGetterHash === onChainGetterHash;
  console.log(`\n${getterMatch ? '✅ MATCH!' : '❌ MISMATCH'}`);

  if (!getterMatch) {
    console.log(`\n⚠️  Difference in item count: ${Math.abs(localGetterAbi.length - onChainGetterAbi.length)}`);
  }

  // Final result
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 SUMMARY`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Setter: ${setterMatch ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Getter: ${getterMatch ? '✅ PASS' : '❌ FAIL'}`);

  if (setterMatch && getterMatch) {
    console.log(`\n✅ All checks passed successfully!`);
    process.exit(0);
  } else {
    console.log(`\n❌ ABI mismatches detected`);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('\n💥 Error:', error.message);
  process.exit(1);
});
