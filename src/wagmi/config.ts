import { http, createConfig } from 'wagmi';
import { mainnet, holesky } from 'wagmi/chains';

//@ts-ignore This is a
export const config = createConfig({
  chains: [mainnet, holesky],
  transports: {
    [mainnet.id]: http(),
    [holesky.id]: http()
  }
});
