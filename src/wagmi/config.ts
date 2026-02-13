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
  network: "hoodi",
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
};

const chains = [
  // {
  //   networkId: 1,
  //   apiVersion: "v4",
  //   apiNetwork: "mainnet",
  //   api: "https://api.hoodi.ssv.network/api",
  //   explorerUrl: "https://explorer.hoodi.ssv.network/",
  //   insufficientBalanceUrl: "https://faucet.ssv.network",
  //   googleTagSecret: "GTM-K3GR7M5",
  //   tokenAddress: "0x9F5d4Ec84fC4785788aB44F9de973cF34F7A038e",
  //   setterContractAddress: "0x58410Bef803ECd7E63B23664C586A6DB72DAf59c",
  //   getterContractAddress: "0x5AdDb3f1529C5ec70D77400499eE4bbF328368fe",
  // },
  {
    networkId: 560048,
    apiVersion: "v4",
    apiNetwork: "hoodi",
    api: "https://api.hoodi.ssv.network/api",
    explorerUrl: "https://explorer.hoodi.ssv.network/",
    insufficientBalanceUrl: "https://faucet.ssv.network",
    googleTagSecret: "GTM-K3GR7M5",
    tokenAddress: "0x9F5d4Ec84fC4785788aB44F9de973cF34F7A038e",
    setterContractAddress: "0x58410Bef803ECd7E63B23664C586A6DB72DAf59c",
    getterContractAddress: "0x5AdDb3f1529C5ec70D77400499eE4bbF328368fe",
  },
]
  .map((network) =>
    [mainnet, hoodi].find((chain) => chain.id === network.networkId),
  )
  .filter(Boolean) as [Chain, ...Chain[]];
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
    [hoodi.id]: http(
      "https://ethereum-hoodi-rpc.publicnode.com/d8a2cc6e7483872e917d7899f9403d738b001c80e37d66834f4e40e9efb54a27",
    ),
  },
});
