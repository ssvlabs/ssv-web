import process from "node:process";
import { formatAbi } from "abitype";
import {
  createPublicClient,
  http,
  getAddress,
  defineChain,
} from "viem";
import LocalSSVNetworkABIJson from "../src/lib/abi/mainnet/v4/setter.json" with {
  type: "json",
};
import LocalSSVNetworkViewsABIJson from "../src/lib/abi/mainnet/v4/getter.json" with {
  type: "json",
};

const CHAINS = {
  1: {
    name: "Ethereum",
    rpc: "https://ethereum-rpc.publicnode.com/d8a2cc6e7483872e917d7899f9403d738b001c80e37d66834f4e40e9efb54a27",
    etherscanApi: "https://api.etherscan.io/v2/api",
  },
  560048: {
    name: "Hoodi",
    rpc: "https://ethereum-hoodi-rpc.publicnode.com/d8a2cc6e7483872e917d7899f9403d738b001c80e37d66834f4e40e9efb54a27",
    etherscanApi: "https://api.etherscan.io/v2/api",
  },
};

const EIP1967_IMPLEMENTATION_SLOT =
  "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";

const setterAddress = process.env.SSV_NETWORK_CONTRACT_ADDRESS;
const getterAddress = process.env.SSV_NETWORK_VIEWS_CONTRACT_ADDRESS;
const chainId = Number(process.env.SSV_NETWORK_CHAIN_ID ?? 1);
const apiKey = process.env.ETHERSCAN_API_KEY || "7D5ZWV94V4N8G13GXI2PWGM8PU8G7NY366";

if (!setterAddress || !getterAddress) {
  console.error(
    "Missing env vars: SSV_NETWORK_CONTRACT_ADDRESS and SSV_NETWORK_VIEWS_CONTRACT_ADDRESS are required",
  );
  process.exit(1);
}

const chainConfig = CHAINS[chainId];
if (!chainConfig) {
  console.error(`Unknown chain ID: ${chainId}. Supported: 1, 560048`);
  process.exit(1);
}

const chain = defineChain({
  id: chainId,
  name: chainConfig.name,
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [chainConfig.rpc] } },
});

const client = createPublicClient({
  chain,
  transport: http(chainConfig.rpc),
});

async function getImplementation(proxyAddress) {
  const slot = await client.getStorageAt({
    address: proxyAddress,
    slot: EIP1967_IMPLEMENTATION_SLOT,
  });
  if (!slot || slot === "0x" + "0".repeat(64)) {
    return proxyAddress;
  }
  return getAddress("0x" + slot.slice(-40));
}

async function fetchAbi(address) {
  const url = `${chainConfig.etherscanApi}?apikey=${apiKey}&chainid=${chainId}&module=contract&action=getabi&address=${address}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.status !== "1") {
    throw new Error(`Etherscan error: ${json.message} — ${json.result}`);
  }
  return JSON.parse(json.result);
}

const ABIS = [
  { name: "SSVNetwork", localAbi: LocalSSVNetworkABIJson, proxyAddress: setterAddress },
  {
    name: "SSVNetworkViews",
    localAbi: LocalSSVNetworkViewsABIJson,
    proxyAddress: getterAddress,
  },
];

let hasFailures = false;

for (const { name, localAbi, proxyAddress } of ABIS) {
  console.log(`\n${name}:`);

  let impl;
  try {
    impl = await getImplementation(proxyAddress);
    console.log(`  Proxy:          ${proxyAddress}`);
    console.log(`  Implementation: ${impl}`);
  } catch (e) {
    console.error(`  Failed to get implementation: ${e.message}`);
    hasFailures = true;
    continue;
  }

  let etherscanAbi;
  try {
    etherscanAbi = await fetchAbi(impl);
  } catch (e) {
    console.error(`  Failed to fetch ABI from Etherscan: ${e.message}`);
    hasFailures = true;
    continue;
  }

  const localSigs = formatAbi(localAbi).sort();
  const etherscanSigs = formatAbi(etherscanAbi).sort();

  if (JSON.stringify(localSigs) === JSON.stringify(etherscanSigs)) {
    console.log(`  ✓ ABI matches (${localSigs.length} items)`);
  } else {
    hasFailures = true;
    const localSet = new Set(localSigs);
    const etherscanSet = new Set(etherscanSigs);
    const onlyInLocal = localSigs.filter((s) => !etherscanSet.has(s));
    const onlyInEtherscan = etherscanSigs.filter((s) => !localSet.has(s));
    if (onlyInLocal.length) {
      console.log(
        `  ✗ In local but not in Etherscan (${onlyInLocal.length}):`,
        onlyInLocal.join(", "),
      );
    }
    if (onlyInEtherscan.length) {
      console.log(
        `  ✗ In Etherscan but not in local (${onlyInEtherscan.length}):`,
        onlyInEtherscan.join(", "),
      );
    }
  }
}

if (hasFailures) {
  process.exit(1);
}
console.log("\nAll ABI checks passed.");
