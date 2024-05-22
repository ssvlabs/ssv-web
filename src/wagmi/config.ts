import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { HttpTransport, http } from 'viem';
import { Chain } from '@rainbow-me/rainbowkit';
import { holesky, mainnet } from 'wagmi/chains';
import { config as projectConfig } from '~app/common/config/config';
import { networks } from '~root/providers/networkInfo.provider';

// const isFaucet = import.meta.env.VITE_FAUCET_PAGE;
// const isDistribution = import.meta.env.VITE_CLAIM_PAGE;

// const app = isFaucet ? 'faucet' : isDistribution ? 'distribution' : 'ssvweb';

// const appChains: Record<typeof app, [Chain, ...Chain[]]> = {
//   ssvweb: [mainnet, holesky],
//   distribution: [mainnet],
//   faucet: [holesky]
// };

// const chains = appChains[app];

const supportedChainsMap: Record<number, Chain> = {
  [mainnet.id]: {
    ...mainnet,
    iconBackground: 'none',
    iconUrl: '/images/networks/dark.svg'
  },
  [holesky.id]: {
    ...holesky,
    iconBackground: 'none',
    iconUrl: '/images/networks/light.svg'
  }
};

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

export const config = getDefaultConfig({
  appName: 'SSV Web App',
  projectId: projectConfig.ONBOARD.PROJECT_ID,
  chains,
  transports,
  ssr: false
});
