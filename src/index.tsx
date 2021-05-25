import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import App from '~app/App';
import { rootStore } from '~root/stores';
import * as serviceWorker from '~root/serviceWorker';

/**
 * Render the app in container
 */
const renderApp = () => {
  const div = document.createElement('div');
  div.id = 'root';
  document.body.appendChild(div);

  ReactDOM.render(
    <Provider stores={rootStore}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    document.getElementById('root'),
  );
};

const shouldRenderIframe = () => {
  // @ts-ignore
  return window.location.hash !== '#protected' && !window.Cypress;
};

const createIframe = () => {
  const iframe = document.getElementById('self-frame');
  // @ts-ignore
  iframe.src = `${window.location}#protected`;
  // @ts-ignore
  iframe.style.display = '';
};

/**
 * Check if the app should be rendered.
 * Should be rendered in two cases:
 * 1) it runs inside of self iframe
 * 2) it runs in a Cypress
 */
const shouldRenderApp = () => {
  // @ts-ignore
  return window.location.hash === '#protected' || window.Cypress;
};

if (shouldRenderIframe()) {
  createIframe();
} else if (shouldRenderApp()) {
  renderApp();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
