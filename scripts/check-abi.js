import process from "node:process";
import {
  createPublicClient,
  http,
  getFunctionSelector,
  getAddress,
  defineChain,
} from "viem";
import LocalSSVNetworkABIJson from "../src/lib/abi/setter.json" with { type: "json" };
import LocalSSVNetworkViewsABIJson from "../src/lib/abi/getter.json" with { type: "json" };

const RPC_BY_CHAIN_ID = {
  1: "https://ethereum-rpc.publicnode.com/d8a2cc6e7483872e917d7899f9403d738b001c80e37d66834f4e40e9efb54a27",
  560048:
    "https://ethereum-hoodi-rpc.publicnode.com/d8a2cc6e7483872e917d7899f9403d738b001c80e37d66834f4e40e9efb54a27",
};

const EIP1967_IMPLEMENTATION_SLOT =
  "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";

const setterAddress = process.env.SSV_NETWORK_CONTRACT_ADDRESS;
const getterAddress = process.env.SSV_NETWORK_VIEWS_CONTRACT_ADDRESS;
const chainId = Number(process.env.SSV_NETWORK_CHAIN_ID ?? 1);

if (!setterAddress || !getterAddress) {
  console.error(
    "Missing env vars: SSV_NETWORK_CONTRACT_ADDRESS and SSV_NETWORK_VIEWS_CONTRACT_ADDRESS are required",
  );
  process.exit(1);
}

const rpcUrl = RPC_BY_CHAIN_ID[chainId];
if (!rpcUrl) {
  console.error(`Unknown chain ID: ${chainId}. Supported: 1, 560048`);
  process.exit(1);
}

const chain = defineChain({
  id: chainId,
  name: chainId === 1 ? "Ethereum" : "Hoodi",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [rpcUrl] } },
});

const client = createPublicClient({
  chain,
  transport: http(rpcUrl),
});

const EIP1167_MINIMAL_PROXY_PREFIX = "363d3d373d3d3d363d73";

function getImplementationFromEIP1167(bytecode) {
  const hex = bytecode.startsWith("0x") ? bytecode.slice(2) : bytecode;
  const idx = hex.indexOf(EIP1167_MINIMAL_PROXY_PREFIX);
  if (idx === -1) return null;
  const addrStart = idx + EIP1167_MINIMAL_PROXY_PREFIX.length;
  const addrHex = hex.slice(addrStart, addrStart + 40);
  if (addrHex.length !== 40) return null;
  return getAddress("0x" + addrHex);
}

function extractSelectors(bytecode) {
  const hex = (
    bytecode.startsWith("0x") ? bytecode.slice(2) : bytecode
  ).toLowerCase();
  const selectors = new Set();
  for (let i = 0; i < hex.length - 9; i += 2) {
    const op = hex[i] + hex[i + 1];
    if (op === "63") {
      // PUSH4 — full 4-byte selector
      selectors.add("0x" + hex.slice(i + 2, i + 10));
      i += 8;
    } else if (op === "62") {
      // PUSH3 — optimized for selectors whose first byte is 0x00
      selectors.add("0x00" + hex.slice(i + 2, i + 8));
      i += 6;
    }
  }
  return selectors;
}

async function getImplementationAddress(proxyAddress) {
  const slot = await client.getStorageAt({
    address: proxyAddress,
    slot: EIP1967_IMPLEMENTATION_SLOT,
  });
  if (slot && slot !== "0x" + "0".repeat(64)) {
    return getAddress("0x" + slot.slice(-40));
  }
  return null;
}

async function getBytecodeForCheck(address) {
  const code = await client.getBytecode({ address });
  if (!code) return code;

  const implFromStorage = await getImplementationAddress(address);
  if (implFromStorage) {
    return client.getBytecode({ address: implFromStorage });
  }

  const implFromEIP1167 = getImplementationFromEIP1167(code);
  if (implFromEIP1167) {
    return client.getBytecode({ address: implFromEIP1167 });
  }

  return code;
}

const ABIS = [
  { name: "SSVNetwork", abi: LocalSSVNetworkABIJson, address: setterAddress },
  {
    name: "SSVNetworkViews",
    abi: LocalSSVNetworkViewsABIJson,
    address: getterAddress,
  },
];

let hasFailures = false;

for (const { name, abi, address } of ABIS) {
  const fnItems = abi.filter((x) => x.type === "function");
  const passed = [];
  const failed = [];

  let code;
  try {
    code = await getBytecodeForCheck(address);
  } catch (e) {
    console.error(`Failed to fetch bytecode for ${name}: ${e.message}`);
    hasFailures = true;
    continue;
  }

  const push4Selectors = extractSelectors(code ?? "");

  for (const item of fnItems) {
    const selector = getFunctionSelector(item);
    if (push4Selectors.has(selector)) {
      passed.push(item.name);
    } else {
      failed.push({ name: item.name, selector });
    }
  }

  console.log(`\n${name}:`);
  if (failed.length) {
    hasFailures = true;
    console.log(
      `  ✗ Missing on-chain (${failed.length}):`,
      failed.map((f) => `${f.name} (${f.selector})`).join(", "),
    );
  } else {
    console.log(`  ✓ All ${passed.length} functions verified`);
  }
}

if (hasFailures) {
  process.exit(1);
}
console.log("\nAll ABI checks passed.");
