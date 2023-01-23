import { observer } from 'mobx-react';
import React, { useState } from 'react';
import OperatorDashboard from '~app/components/applications/SSV/NewMyAccount/components/OperatorDashboard';
import ValidatorDashboard from '~app/components/applications/SSV/NewMyAccount/components/ValidatorDashboard';

// eslint-disable-next-line no-unused-vars
enum State {
  // eslint-disable-next-line no-unused-vars
  Validator = 1,
  // eslint-disable-next-line no-unused-vars
  Operator = 2,
}

const NewMyAccount = () => {
  const [dashboardState, setDashboardState] = useState(State.Validator);

  return (
      dashboardState === State.Validator ?
          <ValidatorDashboard changeState={setDashboardState}/>
          : <OperatorDashboard changeState={setDashboardState}/>
  );
};

export default observer(NewMyAccount);
