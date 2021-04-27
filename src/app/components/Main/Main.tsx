import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Welcome from '~app/components/Welcome';
import Layout from '~app/common/components/Layout';
import config from '~app/common/config';

const Main = () => {
  return (
    <Layout>
      <Router>
        <Switch>
          <Route exact path="/">
            <Welcome />
          </Route>
          <Route path={config.routes.OPERATOR.KEYS.GENERATE}>
            Generate operator keys
          </Route>
          <Route path={config.routes.NETWORK.REGISTER}>
            Generate operator keys
          </Route>
        </Switch>
      </Router>
    </Layout>
  );
};

export default Main;
