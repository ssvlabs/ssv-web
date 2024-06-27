import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'mobx-react';
import { createRoot } from 'react-dom/client';
import { Provider as RdProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import App from '~app/App';
import { store } from '~app/store';
import GTMFrame from '~lib/analytics/GoogleTag/components/GTMFrame';
import * as serviceWorker from '~root/serviceWorker';
import { rootStore } from '~root/stores';
import { config } from '~root/wagmi/config';

import { Buffer } from 'buffer';
import { RainbowKitProvider } from '~root/RainbowKitProvider';
// @ts-ignore
globalThis.Buffer = Buffer;

export const queryClient = new QueryClient();

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RdProvider store={store}>
        <Provider stores={rootStore}>
          <RainbowKitProvider>
            <BrowserRouter>
              <App />
              <GTMFrame />
            </BrowserRouter>
          </RainbowKitProvider>
        </Provider>
      </RdProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
