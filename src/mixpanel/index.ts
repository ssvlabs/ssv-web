import { getChainId } from '@wagmi/core';
import { config } from '~root/wagmi/config';

import { merge } from 'lodash';
import _mixpanel from 'mixpanel-browser';
console.log('_mixpanel:', _mixpanel);

console.log('import.meta.env.VITE_MIXPANEL_TOKEN:', import.meta.env.VITE_MIXPANEL_TOKEN);
_mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
  ip: false
});

const getNetworkName = () => {
  const chainId = getChainId(config);
  const currentChain = config.chains.find((chain) => chain.id === chainId);
  return currentChain?.name;
};

export const getSuperProperties = () => ({
  network: getNetworkName()
});

export const track: typeof _mixpanel.track = (event, properties) => {
  _mixpanel.track(event, merge(properties, getSuperProperties()));
};

export const mixpanel = _mixpanel;
