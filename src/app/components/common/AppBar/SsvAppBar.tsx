import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import AppBar from '~app/components/common/AppBar/AppBar';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getAccountClusters, getAccountOperators } from '~app/redux/account.slice';
import { getIsLoading, getIsMaintenancePage, getRestrictedUserGeo } from '~app/redux/appState.slice';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import SimpleAppBar from '~app/components/common/AppBar/components/SimpleAppBar.tsx';

const SsvAppBar = () => {
  const navigate = useNavigate();
  const isLoading = useAppSelector(getIsLoading);
  const operators = useAppSelector(getAccountOperators);
  const clusters = useAppSelector(getAccountClusters);
  const isRestrictedCountry = useAppSelector(getRestrictedUserGeo);
  const isMaintenancePage = useAppSelector(getIsMaintenancePage);

  const moveToDashboard = () => {
    if (isLoading || isRestrictedCountry) return;
    if (clusters.length > 0) {
      navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD);
    } else if (operators.length > 0) {
      navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD);
    }
  };
  const openDocs = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'nav',
      action: 'click',
      label: 'Docs'
    });
    window.open(config.links.LINK_SSV_DEV_DOCS);
  };

  const openExplorer = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'nav',
      action: 'click',
      label: 'Explorer'
    });
    window.open(config.links.EXPLORER_URL);
  };

  const buttons = [
    {
      label: 'My Account',
      blueColor: true,
      onClick: moveToDashboard
    },
    {
      label: 'Explorer',
      onClick: openExplorer
    },
    {
      label: 'Docs',
      onClick: openDocs
    },
    {
      label: '...',
      onClick: () => null,
      options: [
        { label: 'Governance Forum', link: config.links.GOVERNANCE_FORUM_LINK },
        {
          label: 'Snapshot',
          link: config.links.SNAPSHOT_LINK,
          bottomLine: true
        },
        { label: 'Terms of Use', link: config.links.TERMS_OF_USE_LINK },
        { label: 'Privacy Policy', link: config.links.PRIVACY_POLICY_LINK }
      ]
    }
  ];

  const components = {
    true: <SimpleAppBar />,
    false: <AppBar buttons={buttons} />
  };

  const Component = components[`${isMaintenancePage}`];

  return Component;
};

export default SsvAppBar;
