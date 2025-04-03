import { defineChain, createPublicClient, getContract, http } from "viem";

const mainnet = defineChain({
  id: 1,
  name: "Ethereum",
  network: "mainnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.ankr.com/eth"],
    },
    public: {
      http: ["https://rpc.ankr.com/eth"],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://etherscan.io",
    },
  },
  iconUrl: "/images/networks/dark.svg",
  iconBackground: "none",
});

const holesky = defineChain({
  id: 17000,
  name: "Holesky",
  network: "holesky",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://ethereum-holesky.publicnode.com"],
    },
    public: {
      http: ["https://ethereum-holesky.publicnode.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Holesky Explorer",
      url: "https://holesky.beaconcha.in",
    },
  },
  iconUrl: "/images/networks/light.svg",
  iconBackground: "none",
  testnet: true,
});

const hoodi = defineChain({
  id: 560048,
  name: "Hoodi",
  network: "hoodi",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["http://57.129.73.156:31040"],
    },
    public: {
      http: ["http://57.129.73.156:31040"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://hoodi.cloud.blockscout.com",
    },
  },
  iconUrl: "/images/networks/light.svg",
  iconBackground: "none",
  testnet: true,
});

const ERC20_ABI = [
  {
    type: "function",
    name: "totalSupply",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
];

export async function isERC20Tokens(
  tokenAddresses: `0x${string}`[],
  chainId: number,
) {
  const chain = getChainById(chainId);

  const client = createPublicClient({
    chain,
    transport: http(chain.rpcUrls.default.http[0]),
  });

  const results: Record<`0x${string}`, boolean> = {};

  await Promise.all(
    tokenAddresses.map(async (address) => {
      const contract = getContract({
        address,
        abi: ERC20_ABI,
        client,
      });
      try {
        await contract.read.totalSupply();
        await contract.read.balanceOf([
          "0x000000000000000000000000000000000000dead",
        ]);
        results[address] = true;
      } catch {
        results[address] = false;
      }
    }),
  );
  return results;
}

function getChainById(id: number) {
  switch (id) {
    case mainnet.id:
      return mainnet;
    case holesky.id:
      return holesky;
    case hoodi.id:
      return hoodi;
    default:
      throw new Error(`Chain with id ${id} is not supported`);
  }
}
