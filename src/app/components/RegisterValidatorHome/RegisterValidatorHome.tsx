import React from 'react';
import { observer } from 'mobx-react';
import config from '~app/common/config';
import { Route, Switch } from 'react-router-dom';
import FileApproval from '~app/components/RegisterValidatorHome/components/FileApproval';
import SelectOperators from '~app/components/RegisterValidatorHome/components/SelectOperators';
import EnterValidatorPrivateKey from '~app/components/RegisterValidatorHome/components/EnterValidatorPrivateKey';

const RegisterValidatorHome = () => {
  return (
    <Switch>
      <Route exact path={config.routes.VALIDATOR.HOME}>
        <EnterValidatorPrivateKey />
      </Route>
      <Route path={config.routes.VALIDATOR.SELECT_OPERATORS}>
        <SelectOperators />
      </Route>
      <Route path={config.routes.VALIDATOR.DECRYPT}>
        <FileApproval />
      </Route>
    </Switch>
  );
};

export default observer(RegisterValidatorHome);
