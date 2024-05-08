import { walletConnect } from '@wagmi/connectors';
import { createConfig, http } from 'wagmi';
import { holesky, mainnet } from 'wagmi/chains';
import { config as projectConfig } from '~app/common/config/config';

export const config = createConfig({
  chains: [mainnet, holesky],
  connectors: [
    walletConnect({
      projectId: projectConfig.ONBOARD.PROJECT_ID
    })
  ],
  transports: {
    [mainnet.id]: http(),
    [holesky.id]: http()
  }
});
