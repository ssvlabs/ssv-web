import { getChainId } from '@wagmi/core';
import { config } from '~root/wagmi/config';

import { merge } from 'lodash';
import _mixpanel from 'mixpanel-browser';

if (import.meta.env.VITE_MIXPANEL_TOKEN) _mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN);

const getNetworkName = () => {
  const chainId = getChainId(config);
  const currentChain = config.chains.find((chain) => chain.id === chainId);
  return currentChain?.name;
};

export const getSuperProperties = () => ({
  network: getNetworkName(),
  $region: null,
  $city: null
});

export const track: typeof _mixpanel.track = (event, properties) => {
  if (!import.meta.env.VITE_MIXPANEL_TOKEN) return;
  _mixpanel.track(event, merge(properties, getSuperProperties()));
};

export const mixpanel = import.meta.env.VITE_MIXPANEL_TOKEN
  ? _mixpanel
  : {
      track: () => {},
      track_pageview: () => {},
      identify: () => {},
      reset: () => {}
    };
