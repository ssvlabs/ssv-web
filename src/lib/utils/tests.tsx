import React from 'react';
import { Provider } from 'mobx-react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from '~app/App';
import { rootStore } from '~root/stores';
import { ReactWrapper, ShallowWrapper } from 'enzyme';

export const ApplicationComponent: any = ({ initialRoutes }: { initialRoutes?: string[] }) => {
  if (initialRoutes) {
    return (
      <Provider stores={rootStore}>
        <MemoryRouter initialEntries={initialRoutes}>
          <App />
        </MemoryRouter>
      </Provider>
    );
  }
  return (
    <Provider stores={rootStore}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
};

/**
 * Shorthand to finding first occurrence of element in the DOM by condition (predicate)
 * @param wrapper
 * @param predicate
 * @param index
 * @param returnDomNode
 */
export const findElementAtIndex = (wrapper: ReactWrapper | ShallowWrapper,
                            predicate: any,
                            index?: number,
                            returnDomNode?: boolean): any => {
  let element: ReactWrapper | ShallowWrapper = wrapper.findWhere(predicate);
  if (index !== undefined && index !== null && index >= 0) {
    element = element.at(index);
  }
  if (returnDomNode) {
    return element.getDOMNode();
  }
  return element;
};
