import React from 'react';
import { Provider } from 'mobx-react';
import { render } from '@testing-library/react';
import App from '~app/App';
import { rootStore } from '~root/stores';

test('Renders Application', () => {
  const { getByText } = render(
    <Provider stores={rootStore}>
      <App />
    </Provider>,
  );

  expect(getByText(/Join SSV Network/i)).toBeInTheDocument();
});
