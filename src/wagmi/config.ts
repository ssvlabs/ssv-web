import type { Chain } from "@rainbow-me/rainbowkit";

import type { HttpTransport } from "viem";
import { createPublicClient, http } from "viem";
import { createConfig } from "wagmi";
import { holesky as holeskyBase, mainnet as mainnetBase } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";

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

// const connectors = connectorsForWallets(
//   [
//     {
//       groupName: "Popular",
//       wallets: [walletConnectWallet, coinbaseWallet],
//     },
//   ],
//   {
//     appName: "SSV Web App",
//     projectId: "c93804911b583e5cacf856eee58655e6",
//   },
// );

export const mainnet_private_rpc_client = createPublicClient({
  chain: mainnet,
  transport: http(import.meta.env.VITE_PRIVATE_RPC_URL),
});

export const config = createConfig({
  chains,
  connectors: [
    walletConnect({ projectId: "c93804911b583e5cacf856eee58655e6" }),
  ],
  transports,
});
