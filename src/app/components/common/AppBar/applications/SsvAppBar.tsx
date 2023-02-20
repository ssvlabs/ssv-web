import React from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import AppBar from '~app/components/common/AppBar/AppBar';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import ApplicationStore from '~app/common/stores/Abstracts/Application';

const SsvAppBar = () => {
  const stores = useStores();
  const navigate = useNavigate();
  const applicationStore: ApplicationStore = stores.Application;
  const hasOperatorsOrClusters = applicationStore.strategyRedirect === config.routes.SSV.MY_ACCOUNT.DASHBOARD;
  const backgroundColor = applicationStore.theme.colors.white;

  const moveToDashboard = () => {
    if (applicationStore.isLoading) return;
    if (hasOperatorsOrClusters) {
      // @ts-ignore
      applicationStore.whiteNavBarBackground = false;
      GoogleTagManager.getInstance().sendEvent({
        category: 'nav',
        action: 'click',
        label: 'My Account',
      });
      navigate(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
    }
  };
  const openDocs = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'nav',
      action: 'click',
      label: 'Docs',
    });
    window.open(config.links.LINK_SSV_DEV_DOCS);
  };

  const openExplorer = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'nav',
      action: 'click',
      label: 'Explorer',
    });
    window.open(config.links.EXPLORER_URL);
  };

  const buttons = [
    {
      label: 'My Account', blueColor: true, onClick: moveToDashboard,
    },
    {
      label: 'Explorer', onClick: openExplorer,
    },
    {
      label: 'Docs', onClick: openDocs,
    },
  ];

  return <AppBar backgroundColor={backgroundColor} buttons={buttons} />;
};

export default observer(SsvAppBar);
