import _ from 'underscore';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from '../../NewMyAccount.styles';
import { formatNumberToUi } from '~lib/utils/numbers';
import { longStringShorten } from '~lib/utils/strings';
import LinkText from '~app/components/common/LinkText';
import ClusterWarnings from './components/ClusterWarnings';
import OperatorType from '~app/components/common/OperatorType/OperatorType';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import ClusterStore from '~app/common/stores/applications/SsvWeb/Cluster.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import Dashboard from '~app/components/applications/SSV/NewMyAccount/components/Dashboard';
import ToggleDashboards from '~app/components/applications/SSV/NewMyAccount/components/ToggleDashboards';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';

const ClusterDashboard = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const clusterStore: ClusterStore = stores.Cluster;
  const processStore: ProcessStore = stores.Process;
  const myAccountStore: MyAccountStore = stores.MyAccount;
  const applicationStore: ApplicationStore = stores.Application;
  const [hoveredGrid, setHoveredGrid] = useState(null);
  const [loadingCluster, setLoadingClusters] = useState(false);
  const { page, pages, per_page, total } = myAccountStore.ownerAddressClustersPagination;

  const moveToRegisterValidator = () => {
    navigate(config.routes.SSV.VALIDATOR.HOME);
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
      operational_runway: string,
      runWayError: JSX.Element | undefined,
  ) => {
    return { clusterID, operators, validators, operational_runway, runWayError };
  };

  const sortedClusters = myAccountStore.ownerAddressClusters?.slice().sort((a: { runWay: number; }, b: { runWay: number; }) => a.runWay - b.runWay);

  const rows = sortedClusters.map((cluster: any) => {
    return createData(
        longStringShorten(clusterStore.getClusterHash(cluster.operators).slice(2), 4),
        <Grid container style={{ gap: 8 }}>
          {cluster.operators.map((operator: any, index: number) => {

            return <Grid item
                         container
                         key={index}
                         onMouseLeave={handleGridLeave}
                         className={classes.CircleImageOperatorWrapper}
                         onMouseEnter={() => handleGridHover(clusterStore.getClusterHash(cluster.operators) + operator.id)}
            >
              {(hoveredGrid === clusterStore.getClusterHash(cluster.operators) + operator.id) && (
                  <Grid container className={classes.OperatorPopUp}>
                    <Grid item className={classes.FullImageOperator} />
                    <Grid item className={classes.Line} />
                    <Grid item>
                      <Grid item container style={{ alignItems: 'center', gap: 4 }}>
                        <Grid>{operator.name}</Grid>
                        {operator.type !== 'operator' && (
                            <OperatorType type={'verified_operator'} />
                        )}
                      </Grid>
                      <Grid item className={classes.OperatorId}>ID: {operator.id}</Grid>
                    </Grid>
                  </Grid>
              )}
              <Grid item className={classes.CircleImageOperator} />
            </Grid>;
          })}
        </Grid>,
        cluster.validator_count,
        `${isNaN(cluster.runWay) ? 'N/A' : `${formatNumberToUi(cluster.runWay, true)  } Days`}`,
        <ClusterWarnings cluster={cluster} />,
    );
  });

  const openSingleCluster = (listIndex: string) => {
    processStore.setProcess({
      processName: 'single_cluster',
      item: sortedClusters[listIndex],
    }, 2);
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.ROOT);
  };

  const moveToFeeRecipient = () => {
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.FEE_RECIPIENT);
  };

  const onChangePage = _.debounce( async (newPage: number) =>  {
    setLoadingClusters(true);
    await myAccountStore.getOwnerAddressClusters({ forcePage: newPage });
    setLoadingClusters(false);
  }, 200);

  const rowBackgroundColor = (index: number) => {
    const indexCluster = sortedClusters[index];
    if (indexCluster.isLiquidated) return 'rgba(236, 28, 38, 0.03)';
    if (indexCluster.runWay < 30) return applicationStore.darkMode ? 'rgba(255, 210, 10, 0.2)' : '#FDFBF0';
  };

  return (
    <Grid container className={classes.MyAccountWrapper}>
      <Grid container item className={classes.HeaderWrapper}>
        <ToggleDashboards title={'Validator Clusters'} />
        <Grid container item xs className={classes.HeaderButtonsWrapper}>
          <Grid item className={`${classes.HeaderButton} ${classes.lightHeaderButton}`} onClick={moveToFeeRecipient}>
            Fee Address
            <Grid item className={classes.Pencil} />
          </Grid>
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
            { name: 'Cluster ID', tooltip: <Grid>Clusters represent a unique set of 4 operators who operate your validators. <LinkText text={'Read more on clusters'} link={'asdas'}/></Grid> },
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
