import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { Chain, HttpTransport, http } from 'viem';
import { holesky, mainnet } from 'wagmi/chains';
import { config as projectConfig } from '~app/common/config/config';

const isFaucet = import.meta.env.VITE_FAUCET_PAGE;
const isDistribution = import.meta.env.VITE_CLAIM_PAGE;

const app = isFaucet ? 'faucet' : isDistribution ? 'distribution' : 'webapp';

const appChains: Record<typeof app, [Chain, ...Chain[]]> = {
  faucet: [holesky],
  distribution: [mainnet],
  webapp: [mainnet, holesky]
};

export const isChainSupported = (chainId: number) => {
  return chains.some((chain) => chain.id === chainId);
};

const chains = appChains[app];
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
