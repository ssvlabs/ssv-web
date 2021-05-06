import React from 'react';
import { observer } from 'mobx-react';
import config from '~app/common/config';
import { Route, Switch } from 'react-router-dom';
import FileApproval from '~app/components/RegisterValidator/components/FileApproval';
import SelectOperators from '~app/components/RegisterValidator/components/SelectOperators';
import EnterValidatorPrivateKey from '~app/components/RegisterValidator/components/EnterValidatorPrivateKey';

const RegisterValidator = () => {
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

export default observer(RegisterValidator);
