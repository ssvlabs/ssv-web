import { formatAbiItem } from "abitype";
import process from "node:process";
import LocalSSVNetworkABIJson from "../src/lib/abi/mainnet/v4/setter.json" with { type: "json" };
import LocalSSVNetworkViewsABIJson from "../src/lib/abi/mainnet/v4/getter.json" with { type: "json" };

const remoteSSVNetworkABIUrl = process.env.REMOTE_SSV_NETWORK_ABI_URL;
const remoteSSVNetworkViewsABIUrl =
  process.env.REMOTE_SSV_NETWORK_VIEWS_ABI_URL;

const ABIS = [
  {
    name: "SSVNetwork",
    remoteAbi: remoteSSVNetworkABIUrl,
    localAbi: LocalSSVNetworkABIJson,
  },
  {
    name: "SSVNetworkViews",
    remoteAbi: remoteSSVNetworkViewsABIUrl,
    localAbi: LocalSSVNetworkViewsABIJson,
  },
];

function compareAbis(sourceAbi, targetAbi, targetLabel = "Target") {
  const key = (item) => formatAbiItem(item);
  const sourceKeys = new Set(sourceAbi.map(key));
  const targetKeys = new Set(targetAbi.map(key));

  const onlyInSource = [...sourceKeys].filter((k) => !targetKeys.has(k));
  const onlyInTarget = [...targetKeys].filter((k) => !sourceKeys.has(k));
  const match = onlyInSource.length === 0 && onlyInTarget.length === 0;

  return {
    sourceCount: sourceAbi.length,
    targetCount: targetAbi.length,
    onlyInSource,
    onlyInTarget,
    match,
    log() {
      if (this.match) return;
      if (this.onlyInSource.length) {
        console.log(
          `${targetLabel} — Missing ABI items locally (new in remote):`,
        );
        console.log(this.onlyInSource);
      } else if (this.onlyInTarget.length) {
        console.log(
          `${targetLabel} — Extra ABI items locally (removed in remote):`,
        );
        console.log(this.onlyInTarget);
      }
    },
  };
}

for (const abi of ABIS) {
  let remoteAbi;
  try {
    const res = await fetch(abi.remoteAbi);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    remoteAbi = await res.json();
  } catch (e) {
    console.error(`Failed to fetch ${abi.name} ABI: ${e.message}`);
    console.error(`Please verify the URL is correct: ${abi.remoteAbi}`);
    process.exit(1);
  }
  const result = compareAbis(remoteAbi, abi.localAbi, abi.name);

  if (!result.match) {
    console.log("\n");
    result.log();
    console.error(`\nYou can get the latest abi from: \n${abi.remoteAbi}`);
    process.exit(1);
  } else {
    console.log(`${abi.name} ABI is up to date`);
  }
}
