import { isMainnetEnvironment } from "@/lib/utils/env-checker";
import { type Chain, connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { createPublicClient, http } from "viem";
import { createConfig } from "wagmi";
import { mainnet as mainnetBase } from "wagmi/chains";

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

const chains = (isMainnetEnvironment ? [mainnet] : [hoodi]) satisfies [
  Chain,
  ...Chain[],
];
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
    [hoodi.id]: http(
      "https://ethereum-hoodi-rpc.publicnode.com/d8a2cc6e7483872e917d7899f9403d738b001c80e37d66834f4e40e9efb54a27",
    ),
  },
});
