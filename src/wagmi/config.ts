import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { holesky, mainnet } from 'wagmi/chains';
import { config as projectConfig } from '~app/common/config/config';

export const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: projectConfig.ONBOARD.PROJECT_ID,
  chains: [mainnet, holesky],
  transports: {
    [mainnet.id]: http(),
    [holesky.id]: http()
  },
  ssr: false // If your dApp uses server side rendering (SSR)
});
// export const config = createConfig({
//   chains: [mainnet, holesky],
//   connectors: [
//     walletConnect({
//       projectId: projectConfig.ONBOARD.PROJECT_ID
//     })
//   ],
//   transports: {
//     [mainnet.id]: http(),
//     [holesky.id]: http()
//   }
// });
