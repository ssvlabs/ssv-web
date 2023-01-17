import React from 'react';
import { Provider } from 'mobx-react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '~app/App';
import { rootStore } from '~root/stores';
import * as serviceWorker from '~root/serviceWorker';
// eslint-disable-next-line no-prototype-builtins


const container = document.getElementById('root');
// @ts-ignore
const root = createRoot(container);
root.render(
  <Provider stores={rootStore}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();