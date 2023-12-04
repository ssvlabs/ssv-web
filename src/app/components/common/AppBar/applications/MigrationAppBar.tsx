import React from 'react';
import { observer } from 'mobx-react';
import { useStores } from '~app/hooks/useStores';
import AppBar from '~app/components/common/AppBar/AppBar';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import MigrationSteps from '~app/components/applications/SSV/Migration/MigrationSteps';

const MigrationAppBar = () => {
  const stores = useStores();
  const applicationStore: ApplicationStore = stores.Application;
  const backgroundColor = applicationStore.theme.colors.white;

  return <AppBar backgroundColor={backgroundColor} customComponent={<MigrationSteps />}/>;
};

export default observer(MigrationAppBar);
