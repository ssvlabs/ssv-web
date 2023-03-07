import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useStores } from '~app/hooks/useStores';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import OperatorDashboard from '~app/components/applications/SSV/NewMyAccount/components/OperatorDashboard';
import ClusterDashboard from '~app/components/applications/SSV/NewMyAccount/components/ClusterDashboard';

// eslint-disable-next-line no-unused-vars
enum State {
  // eslint-disable-next-line no-unused-vars
  Validator = 1,
  // eslint-disable-next-line no-unused-vars
  Operator = 2,
}

const NewMyAccount = () => {
  const stores = useStores();
  const myAccountStore: MyAccountStore = stores.MyAccount;
  const [dashboardState, setDashboardState] = useState(myAccountStore.ownerAddressClusters.length ? State.Validator : State.Operator);

  return (
      dashboardState === State.Validator ?
          <ClusterDashboard changeState={setDashboardState} />
          : <OperatorDashboard changeState={setDashboardState} />
  );
};

export default observer(NewMyAccount);
