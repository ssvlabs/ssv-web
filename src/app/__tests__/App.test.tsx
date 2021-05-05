import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import config, { translations } from '~app/common/config';
import { ApplicationComponent, findElementAtIndex } from '~lib/utils/tests';

describe('Check Application Screens', () => {
  it('Home screen', () => {
    const appWrapper: ReactWrapper = mount(<ApplicationComponent />);
    const predicate = (element: ReactWrapper) => element.prop('data-testid') === 'header-title';
    const headerTitle = findElementAtIndex(appWrapper, predicate, 0, true);
    expect(headerTitle).toHaveTextContent(translations.HOME.TITLE);
  });

  it('New Operator screen', () => {
    const appWrapper: ReactWrapper = mount(<ApplicationComponent initialRoutes={[config.routes.OPERATOR.START]} />);
    const predicate = (element: ReactWrapper) => element.prop('data-testid') === 'header-title';
    const headerTitle = findElementAtIndex(appWrapper, predicate, 0, true);
    expect(headerTitle).toHaveTextContent(translations.OPERATOR.HOME.TITLE);
  });

  it('New Validator screen', () => {
    const appWrapper: ReactWrapper = mount(<ApplicationComponent initialRoutes={[config.routes.VALIDATOR.HOME]} />);
    const predicate = (element: ReactWrapper) => element.prop('data-testid') === 'header-title';
    const headerTitle = findElementAtIndex(appWrapper, predicate, 0, true);
    expect(headerTitle).toHaveTextContent(translations.VALIDATOR.ENTER_KEY.TITLE);
  });
});

export default {};
