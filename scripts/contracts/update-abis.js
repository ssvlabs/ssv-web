import process from "node:process";
import { replaceAbi } from "ssv-abi-checker";

const VALID_NETWORKS = ["dev", "testnet", "mainnet"];

const network = process.argv[2];

if (!network || !VALID_NETWORKS.includes(network)) {
  console.error(
    `Usage: node scripts/update-abis.js <network>\nValid networks: ${VALID_NETWORKS.join(", ")}`,
  );
  process.exit(1);
}

const contracts = [
  {
    name: "SSVNetwork",
    localPath: `./src/lib/abi/setter.ts`,
  },
  {
    name: "SSVNetworkViews",
    localPath: `./src/lib/abi/getter.ts`,
  },
];

for (const contract of contracts) {
  await replaceAbi({
    network,
    contract: contract.name,
    localPath: contract.localPath,
  });
}
