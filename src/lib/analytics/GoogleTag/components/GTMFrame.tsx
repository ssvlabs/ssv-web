import React, { useEffect, useState } from 'react';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';

export const GOOGLE_TAG_MANAGER_URL = 'https://www.googletagmanager.com/gtm.js?id=';
const GTMFrame = ({}) => {
  const [scriptCreated, setScriptCreated] = useState(false);
  const currentNetwork = getStoredNetwork();

  useEffect(() => {
    if (!scriptCreated) {
      // @ts-ignore
      window.dataLayer = window.dataLayer || [];
      // @ts-ignore
      window.dataLayer.push({
        'gtm.start':
          new Date().getTime(), event: 'gtm.js',
      });

      const scriptElement = document.createElement('script');
      scriptElement.src = `${GOOGLE_TAG_MANAGER_URL}${currentNetwork.googleTagSecret}`;

      const container = document.getElementById('root');
      container?.appendChild(scriptElement);

      setScriptCreated(true);
    }
  }, [scriptCreated]);

  return (
    <noscript>
      <div id="gtmContainer"/>
      ;
    </noscript>
  );
};

export default GTMFrame;
