import React from 'react';
import { expect } from 'chai';
import { Provider } from 'mobx-react';
import { render } from '@testing-library/react';
import App from '~app/App';
import { rootStore } from '~root/stores';

it('Renders Application', () => {
  const { getByText } = render(
    <Provider stores={rootStore}>
      <App />
    </Provider>,
  );

  expect(getByText(/Join SSV Network/i)).to.equal(true);
});
