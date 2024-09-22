import type { Chain } from "@rainbow-me/rainbowkit";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  walletConnectWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";
import type { HttpTransport } from "viem";
import { createPublicClient, http } from "viem";
import { createConfig } from "wagmi";
import { holesky as holeskyBase, mainnet as mainnetBase } from "wagmi/chains";

const mainnet: Chain = {
  ...mainnetBase,
  iconBackground: "none",
  iconUrl: "/images/networks/dark.svg",
};

const holesky: Chain = {
  ...holeskyBase,
  iconBackground: "none",
  iconUrl: "/images/networks/light.svg",
};

const isFaucet = import.meta.env.VITE_FAUCET_PAGE;
const isDistribution = import.meta.env.VITE_CLAIM_PAGE;

const app = isFaucet ? "faucet" : isDistribution ? "distribution" : "ssvweb";

const appChains: Record<typeof app, [Chain, ...Chain[]]> = {
  ssvweb: [mainnet, holesky],
  distribution: [mainnet, holesky],
  faucet: [holesky],
};

const supportedChainsMap: Record<number, Chain> = appChains[app].reduce(
  (acc, chain) => {
    acc[chain.id] = chain;
    return acc;
  },
  {} as Record<number, Chain>,
);

const chains = import.meta.env.VITE_SSV_NETWORKS.map(
  (network) => supportedChainsMap[network.networkId],
).filter(Boolean) as [Chain, ...Chain[]];

export const isChainSupported = (chainId: number) => {
  return chains.some((chain) => chain.id === chainId);
};

const transports = chains.reduce(
  (acc, chain) => {
    acc[chain.id] = http();
    return acc;
  },
  {} as Record<string, HttpTransport>,
);

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

export const mainnet_private_rpc_client = createPublicClient({
  chain: holesky,
  transport: http(import.meta.env.VITE_PRIVATE_RPC_URL),
});

export const config = createConfig({
  chains,
  connectors,
  transports,
});
