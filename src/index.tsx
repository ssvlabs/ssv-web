import React from 'react';
import { Provider } from 'mobx-react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '~app/App';
import { rootStore } from '~root/stores';
import * as serviceWorker from '~root/serviceWorker';
import GTMFrame from '~lib/analytics/GoogleTag/components/GTMFrame';
import { store } from '~app/store';
import { Provider as RdProvider } from 'react-redux';

const container = document.getElementById('root');
// @ts-ignore
const root = createRoot(container);
root.render(
  <RdProvider store={store}>
    <Provider stores={rootStore}>
      <BrowserRouter>
        <App />
        <GTMFrame />
      </BrowserRouter>
    </Provider>
  </RdProvider>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
