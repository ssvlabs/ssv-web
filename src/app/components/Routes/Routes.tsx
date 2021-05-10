import React from 'react';
import { observer } from 'mobx-react';
import { Switch, Route } from 'react-router-dom';
import config from '~app/common/config';
import Layout from '~app/common/components/Layout';
import SSVHome from '~app/components/Home';
import RegisterValidator from '~app/components/RegisterValidator';
import GenerateOperatorKeys from '~app/components/GenerateOperatorKeys';
import RegisterOperatorMenu from '~app/components/RegisterOperatorMenu';
import ConfirmationScreen from '~app/components/ConfirmationScreen';

const Routes = () => {
  return (
    <Layout>
      <Switch>
        <Route exact path={config.routes.OPERATOR.HOME}>
          <SSVHome />
        </Route>
        <Route path={config.routes.OPERATOR.START}>
          <Switch>
            <Route exact path={config.routes.OPERATOR.START}>
              <RegisterOperatorMenu />
            </Route>
            <Route exact path={config.routes.OPERATOR.GENERATE_KEYS}>
              <GenerateOperatorKeys />
            </Route>
            <Route exact path={config.routes.OPERATOR.CONFIRMATION_PAGE}>
              <ConfirmationScreen />
            </Route>
          </Switch>
        </Route>
        <Route path={config.routes.VALIDATOR.HOME}>
          <RegisterValidator />
        </Route>
      </Switch>
    </Layout>
  );
};

export default observer(Routes);
