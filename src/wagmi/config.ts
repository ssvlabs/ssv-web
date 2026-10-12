import { type Chain, connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { createPublicClient, fallback, http } from "viem";
import { createConfig } from "wagmi";
import { mainnet as mainnetBase } from "wagmi/chains";

import { networks } from "@/config/networks";

const mainnet: Chain = {
  ...mainnetBase,
  iconBackground: "none",
  iconUrl: "/images/networks/dark.svg",
};

export const hoodi = {
  id: 560048,
  name: "Hoodi",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        "https://ethereum-hoodi-rpc.publicnode.com/d8a2cc6e7483872e917d7899f9403d738b001c80e37d66834f4e40e9efb54a27",
      ],
    },
    public: {
      http: [
        "https://ethereum-hoodi-rpc.publicnode.com/d8a2cc6e7483872e917d7899f9403d738b001c80e37d66834f4e40e9efb54a27",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://hoodi.etherscan.io/",
    },
  },
  iconBackground: "none",
  iconUrl: "/images/networks/light.svg",
  testnet: true,
} satisfies Chain;

const chainMap: Record<number, Chain> = {
  [mainnet.id]: mainnet,
  [hoodi.id]: hoodi,
};

const chains = networks
  .map((n) => chainMap[n.networkId])
  .filter((chain): chain is Chain => Boolean(chain));

export type Chains = typeof chains;
const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [walletConnectWallet, coinbaseWallet],
    },
  ],
  {
    appName: "SSV Web App",
    projectId: "c93804911b583e5cacf856eee58655e6",
  },
);

const defaultRpcUrls: Record<number, string> = {
  [mainnet.id]:
    "https://ethereum-rpc.publicnode.com/d8a2cc6e7483872e917d7899f9403d738b001c80e37d66834f4e40e9efb54a27",
  [hoodi.id]:
    "https://ethereum-hoodi-rpc.publicnode.com/d8a2cc6e7483872e917d7899f9403d738b001c80e37d66834f4e40e9efb54a27",
};

const getRpcUrl = (chainId: number): string =>
  localStorage.getItem(`customRpcUrl_${chainId}`) ?? defaultRpcUrls[chainId];

/**
 * Primary RPC is the user's custom URL (if set) or our publicnode endpoint;
 * the chain's default public RPC is the fallback, so a single endpoint outage
 * doesn't take every on-chain read down. Identical URLs collapse into a single
 * transport. `rank: false` keeps the primary first instead of re-ordering by
 * latency. Every fallback retry walks both endpoints, so `retryCount: 1` keeps
 * the worst case (both down) at roughly the old single-endpoint budget.
 */
const createRpcTransport = (chain: Chain) => {
  const urls = [
    ...new Set([getRpcUrl(chain.id), chain.rpcUrls.default.http[0]]),
  ].filter(Boolean);
  const transports = urls.map((url) => http(url, { batch: { wait: 20 } }));
  return transports.length === 1
    ? transports[0]
    : fallback(transports, { rank: false, retryCount: 1 });
};

export const mainnet_private_rpc_client = createPublicClient({
  chain: mainnet,
  transport: createRpcTransport(mainnet),
});

export const config = createConfig({
  chains: chains as [Chain, ...Chain[]],
  connectors: connectors,
  transports: Object.fromEntries(
    chains.map((chain) => [chain.id, createRpcTransport(chain)]),
  ),
});
