import React from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import AppBar from '~app/components/common/AppBar/AppBar';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsLoading, getRestrictedUserGeo } from '~app/redux/appState.slice';
import { getStrategyRedirect } from '~app/redux/navigation.slice';

const SsvAppBar = () => {
  const stores = useStores();
  const navigate = useNavigate();
  const isLoading = useAppSelector(getIsLoading);
  const myAccountStore: MyAccountStore = stores.MyAccount;
  const strategyRedirect = useAppSelector(getStrategyRedirect);
  const isRestrictedCountry = useAppSelector(getRestrictedUserGeo);
  const hasOperatorsOrClusters = [config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD, config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD].includes(strategyRedirect);

  const moveToDashboard = () => {
    if (isLoading || isRestrictedCountry) return;
    if (hasOperatorsOrClusters) {
      // @ts-ignore
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

  return <AppBar buttons={buttons} />;
};

export default observer(SsvAppBar);
