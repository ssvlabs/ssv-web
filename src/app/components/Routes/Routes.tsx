import React from 'react';
import { observer } from 'mobx-react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import config from '~app/common/config';
import Layout from '~app/common/components/Layout';
import SSVHome from '~app/components/SSVHome';
import ShareValidatorKey from '~app/components/ShareValidatorKey';
import GenerateOperatorKeys from '~app/components/SSVHome/components/GenerateOperatorKeys';
import RegisterOperatorMenu from '~app/components/SSVHome/components/RegisterOperatorMenu';

const Routes = () => {
  return (
    <Layout>
      <Router>
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
            </Switch>
          </Route>
          <Route exact path={config.routes.VALIDATOR.SHARE}>
            <ShareValidatorKey />
          </Route>
        </Switch>
      </Router>
    </Layout>
  );
};

export default observer(Routes);
