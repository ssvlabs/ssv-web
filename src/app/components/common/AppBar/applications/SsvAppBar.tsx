import React from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import AppBar from '~app/components/common/AppBar/AppBar';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';

const SsvAppBar = () => {
  const stores = useStores();
  const navigate = useNavigate();
  const myAccountStore: MyAccountStore = stores.MyAccount;
  const applicationStore: ApplicationStore = stores.Application;
  const hasOperatorsOrClusters = [config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD, config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD].includes(applicationStore.strategyRedirect);
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
      if (myAccountStore.ownerAddressClusters?.length > 0) {
        navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD);
      } else {
        navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD);
      }
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
    {
      label: '...',
      onClick: () => null,
      options: [
        { label: 'Governance Forum', link: config.links.GOVERNANCE_FORUM_LINK },
        { label: 'Snapshot', link: config.links.SNAPSHOT_LINK, bottomLine: true },
        { label: 'Terms of Use', link: config.links.TERMS_OF_USE_LINK },
        { label: 'Privacy Policy', link: config.links.PRIVACY_POLICY_LINK }],
    },
  ];

  return <AppBar backgroundColor={backgroundColor} buttons={buttons} />;
};

export default observer(SsvAppBar);
