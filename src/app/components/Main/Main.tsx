import React from 'react';
import { observer } from 'mobx-react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import config from '~app/common/config';
import Welcome from '~app/components/Welcome';
import Layout from '~app/common/components/Layout';
import NewOperator from '~app/components/NewOperator';
import RegisterInNetwork from '~app/components/RegisterInNetwork';

const Main = () => {
  return (
    <Layout>
      <Router>
        <Switch>
          <Route exact path="/">
            <Welcome />
          </Route>
          <Route path={config.routes.OPERATOR.KEYS.GENERATE}>
            <NewOperator />
          </Route>
          <Route path={config.routes.NETWORK.REGISTER}>
            <RegisterInNetwork />
          </Route>
        </Switch>
      </Router>
    </Layout>
  );
};

export default observer(Main);
