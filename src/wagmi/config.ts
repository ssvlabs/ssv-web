import { connectorsForWallets, type Chain } from "@rainbow-me/rainbowkit";
import {
  walletConnectWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";

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

export const hoodi = {
  id: 560048,
  name: "hoodi",
  rpcUrls: {
    default: {
      http: ["https://rpc.hoodi.ethpandaops.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://hoodi.cloud.blockscout.com",
    },
  },
  iconBackground: "none",
  iconUrl: "/images/networks/light.svg",
  testnet: true,
};

const chains = import.meta.env.VITE_SSV_NETWORKS.map((network) =>
  [mainnet, holesky, hoodi].find((chain) => chain.id === network.networkId),
).filter(Boolean) as [Chain, ...Chain[]];
export const isChainSupported = (chainId: number) => {
  return chains.some((chain) => chain.id === chainId);
};

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
    "https://ethereum-rpc.publicnode.com/d8a2cc6e7483872e917d7899f9403d738b001c80e37d66834f4e40e9efb54a27",
  ),
});

export const config = createConfig({
  chains,
  connectors: connectors,
  transports: {
    [mainnet.id]: http(
      "https://ethereum-rpc.publicnode.com/d8a2cc6e7483872e917d7899f9403d738b001c80e37d66834f4e40e9efb54a27",
    ),
    [holesky.id]: http(),
    [hoodi.id]: http(),
  },
});
