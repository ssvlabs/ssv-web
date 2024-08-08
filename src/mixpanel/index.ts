import { getChainId } from '@wagmi/core';
import { config } from '~root/wagmi/config';

import { merge } from 'lodash';
import _mixpanel from 'mixpanel-browser';
_mixpanel.init('98daf7d1d9e414c2fdd786641ec5b310');

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
