import React, { useEffect, useState } from 'react';
import { getCurrentNetwork } from '~lib/utils/envHelper';

export const GOOGLE_TAG_MANAGER_URL = 'http://www.googletagmanager.com/gtm.js?id=';
const GTMFrame = ({ }) => {
    const [iframeCreated, setIframeCreated] = useState(false);
    const currentNetwork = getCurrentNetwork();

    useEffect(() => {
        if (!iframeCreated) {
            const iframe = document.createElement('iframe');

            iframe.src = `${GOOGLE_TAG_MANAGER_URL}${currentNetwork.googleTagSecret}`;
            iframe.width = '0';
            iframe.height = '0';
            iframe.style.display = 'none';
            iframe.style.visibility = 'hidden';

            const container = document.getElementById('root');
            container?.appendChild(iframe);

            setIframeCreated(true);
        }
    }, [iframeCreated]);

    return (
        <noscript>
            <div id="gtmContainer" />;
        </noscript>
    );
};

export default GTMFrame;