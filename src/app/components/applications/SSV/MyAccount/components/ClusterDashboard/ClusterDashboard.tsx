import React, { useRef, useState } from 'react';
import _ from 'underscore';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useLocation, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import { longStringShorten } from '~lib/utils/strings';
import LinkText from '~app/components/common/LinkText';
import NaDisplay from '~app/components/common/NaDisplay';
import config, { translations } from '~app/common/config';
import OperatorCard from '~app/components/common/OperatorCard/OperatorCard';
import OperatorCircleImage from '~app/components/common/OperatorCircleImage';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import AccountStore from '~app/common/stores/applications/SsvWeb/Account.store';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import Dashboard from '~app/components/applications/SSV/MyAccount/components/Dashboard';
import { useStyles } from '~app/components/applications/SSV/MyAccount/MyAccount.styles';
import ToggleDashboards from '~app/components/applications/SSV/MyAccount/components/ToggleDashboards';
import validatorRegistrationFlow from '~app/hooks/useValidatorRegistrationFlow';
import ClusterWarnings
  from '~app/components/applications/SSV/MyAccount/components/ClusterDashboard/components/ClusterWarnings';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsDarkMode } from '~app/redux/appState.slice';
import { getClusterHash } from '~root/services/cluster.service';

const ClusterDashboard = () => {
  const stores = useStores();
  const classes = useStyles({});
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef(null);
  const walletStore: WalletStore = stores.Wallet;
  const processStore: ProcessStore = stores.Process;
  const accountStore: AccountStore = stores.Account;
  const myAccountStore: MyAccountStore = stores.MyAccount;
  const [hoveredGrid, setHoveredGrid] = useState(null);
  const [loadingCluster, setLoadingClusters] = useState(false);
  const [loadingFeeRecipient, setLoadingFeeRecipient] = useState(false);
  const { page, pages, per_page, total } = myAccountStore.ownerAddressClustersPagination;
  const { getNextNavigation } = validatorRegistrationFlow(location.pathname);
  const isDarkMode = useAppSelector(getIsDarkMode);

  const moveToRegisterValidator = () => {
    navigate(getNextNavigation());
  };

  const handleGridHover = (index: string) => {
    // @ts-ignore
    timeoutRef.current = setTimeout(() => {
      // @ts-ignore
      setHoveredGrid(index);
    }, 300);
  };

  const handleGridLeave = () => {
    // @ts-ignore
    clearTimeout(timeoutRef.current);
    setHoveredGrid(null);
  };

  const createData = (
    clusterID: string,
    operators: JSX.Element,
    validators: number,
    operational_runway: string | JSX.Element,
    runWayError: JSX.Element | undefined,
  ) => {
    return { clusterID, operators, validators, operational_runway, runWayError };
  };

  const sortedClusters = myAccountStore.ownerAddressClusters?.slice().sort((a: {
    runWay: number;
  }, b: {
    runWay: number;
  }) => a.runWay - b.runWay);

  const rows = sortedClusters.map((cluster: any) => {
    const remainingDaysValue = formatNumberToUi(cluster.runWay, true);
    const remainingDays = +remainingDaysValue > 0 ? `${remainingDaysValue} Days` : remainingDaysValue;
    return createData(
      longStringShorten(getClusterHash(cluster.operators, walletStore.accountAddress).slice(2), 4),
      <Grid container style={{ gap: 8 }}>
        {cluster.operators.map((operator: any, index: number) => {
          return <Grid item
                       container
                       key={index}
                       onMouseLeave={handleGridLeave}
                       className={classes.CircleImageOperatorWrapper}
                       onMouseEnter={() => handleGridHover(getClusterHash(cluster.operators, walletStore.accountAddress) + operator.id)}
          >
            {(hoveredGrid === getClusterHash(cluster.operators, walletStore.accountAddress) + operator.id) && (
              <OperatorCard operator={operator}/>
            )}
            <OperatorCircleImage operatorLogo={operator.logo}/>
          </Grid>;
        })}
      </Grid>,
      cluster.validatorCount,
      isNaN(cluster.runWay) ? (
        <NaDisplay text={translations.NA_DISPLAY.TOOLTIP_TEXT} tooltipClassExtend={classes.TooltipCustomSize}/>
      ) : remainingDays,
      <ClusterWarnings cluster={cluster}/>,
    );
  });

  const openSingleCluster = (listIndex: string) => {
    processStore.setProcess({
      processName: 'single_cluster',
      item: sortedClusters[listIndex],
    }, 2);
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.ROOT);
  };

  const moveToFeeRecipient = async () => {
    setLoadingFeeRecipient(true);
    accountStore.getFeeRecipientAddress(walletStore.accountAddress).finally(() => {
      setLoadingFeeRecipient(false);
      navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.FEE_RECIPIENT);
    });
  };

  const onChangePage = _.debounce(async (newPage: number) => {
    setLoadingClusters(true);
    await myAccountStore.getOwnerAddressClusters({ forcePage: newPage });
    setLoadingClusters(false);
  }, 200);

  const rowBackgroundColor = (index: number) => {
    const indexCluster = sortedClusters[index];
    if (indexCluster.isLiquidated) return 'rgba(236, 28, 38, 0.03)';
    if (indexCluster.runWay < 30) return isDarkMode ? 'rgba(255, 210, 10, 0.2)' : '#FDFBF0';
  };


  return (
    <Grid container className={classes.MyAccountWrapper}>
      <Grid container item className={classes.HeaderWrapper}>
        <ToggleDashboards title={'Validator Clusters'}/>
        <Grid container item xs className={classes.HeaderButtonsWrapper}>
          {rows.length > 0 && (<Grid item className={`${classes.HeaderButton} ${classes.lightHeaderButton}`}
                                     onClick={() => !loadingFeeRecipient && moveToFeeRecipient()}>
            Fee Address
            {loadingFeeRecipient ? <CircularProgress className={classes.SpinnerWrapper} thickness={6} size={16}/> :
              <Grid item className={classes.Pencil}/>}
          </Grid>)}
          <Grid item className={classes.HeaderButton} onClick={moveToRegisterValidator}>Add Cluster</Grid>
        </Grid>
      </Grid>
      <Dashboard
        disable
        rows={rows}
        loading={loadingCluster}
        noItemsText={'No Clusters'}
        rowBackgroundColor={rowBackgroundColor}
        paginationActions={{
          page,
          count: total,
          onChangePage,
          totalPages: pages,
          rowsPerPage: per_page,
        }}
        rowsAction={openSingleCluster}
        columns={[
          {
            name: 'Cluster ID', tooltip: <Grid>Clusters represent a unique set of operators who operate your
              validators. <LinkText text={'Read more on clusters'} link={config.links.MORE_ON_CLUSTERS}/></Grid>,
          },
          { name: 'Operators' },
          { name: 'Validators' },
          { name: 'Est Operational Runway' },
          { name: '' },
        ]}
      />
    </Grid>
  );
};


export default observer(ClusterDashboard);
