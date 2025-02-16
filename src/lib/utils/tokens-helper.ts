import { createPublicClient, http } from "viem";
import { holesky } from "viem/chains";

const client = createPublicClient({
  // TODO: need to use current network
  chain: holesky,
  transport: http(),
});

const erc20ABI = [
  {
    name: "name",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string", name: "" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string", name: "" }],
  },
];

export async function getTokenMetadata(assets: `0x${string}`[][]) {
  const promises = assets.flatMap((assets: `0x${string}`[]) =>
    assets.map((asset: string) =>
      (async () => {
        try {
          const name = await client.readContract({
            address: asset as `0x${string}`,
            abi: erc20ABI,
            functionName: "name",
          });

          const symbol = await client.readContract({
            address: asset as `0x${string}`,
            abi: erc20ABI,
            functionName: "symbol",
          });
          return { asset, name, symbol };
        } catch (error) {
          return { asset };
        }
      })(),
    ),
  );

  try {
    const results = await Promise.all(promises);
    const resultRecord: Record<string, { symbol: string; name: string }> = {};
    results.forEach(({ asset, name, symbol }) => {
      resultRecord[asset] = {
        symbol: (symbol as string) || "",
        name: (name as string) || "",
      };
    });
    return resultRecord;
  } catch (error) {
    console.error("Error in Promise.all:", error);
  }
}
