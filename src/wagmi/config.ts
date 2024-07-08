import { Chain, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { walletConnectWallet, coinbaseWallet } from '@rainbow-me/rainbowkit/wallets';
import { HttpTransport, http } from 'viem';
import { createConfig } from 'wagmi';
import { holesky as holeskyBase, mainnet as mainnetBase, holesky } from 'wagmi/chains';
import { config as projectConfig } from '~app/common/config/config';
import { networks } from '~root/providers/networkInfo.provider';

const mainnet: Chain = {
  ...mainnetBase,
  iconBackground: 'none',
  iconUrl: '/images/networks/dark.svg'
};

const holesky: Chain = {
  ...holeskyBase,
  iconBackground: 'none',
  iconUrl: '/images/networks/light.svg'
};

const isFaucet = import.meta.env.VITE_FAUCET_PAGE;
const isDistribution = import.meta.env.VITE_CLAIM_PAGE;

const app = isFaucet ? 'faucet' : isDistribution ? 'distribution' : 'ssvweb';

const appChains: Record<typeof app, [Chain, ...Chain[]]> = {
  ssvweb: [mainnet, holesky],
  distribution: [mainnet, holesky],
  faucet: [holesky]
};

const supportedChainsMap: Record<number, Chain> = appChains[app].reduce(
  (acc, chain) => {
    acc[chain.id] = chain;
    return acc;
  },
  {} as Record<number, Chain>
);

const chains = networks.map((network) => supportedChainsMap[network.networkId]).filter(Boolean) as [Chain, ...Chain[]];

export const isChainSupported = (chainId: number) => {
  return chains.some((chain) => chain.id === chainId);
};

const transports = chains.reduce(
  (acc, chain) => {
    acc[chain.id] = http();
    return acc;
  },
  {} as Record<string, HttpTransport>
);

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [walletConnectWallet, coinbaseWallet]
    }
  ],
  {
    appName: 'SSV Web App',
    projectId: projectConfig.ONBOARD.PROJECT_ID
  }
);

export const config = createConfig({
  chains,
  connectors,
  transports
});
