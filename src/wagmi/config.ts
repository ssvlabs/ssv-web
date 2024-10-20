import { connectorsForWallets, type Chain } from "@rainbow-me/rainbowkit";
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

const chains = import.meta.env.VITE_SSV_NETWORKS.map((network) =>
  [mainnet, holesky].find((chain) => chain.id === network.networkId),
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
  chain: mainnet,
  transport: http(
    "https://misty-purple-sailboat.quiknode.pro/7fea68f21d77d9b54fc35c3f6d68199a880f5cf0",
  ),
});

export const config = createConfig({
  chains,
  connectors: connectors,
  transports,
});
