import React from 'react';
import _ from 'underscore';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from '../../NewMyAccount.styles';
import { formatNumberToUi } from '~lib/utils/numbers';
import { longStringShorten } from '~lib/utils/strings';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import ClusterStore from '~app/common/stores/applications/SsvWeb/Cluster.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import Dashboard from '~app/components/applications/SSV/NewMyAccount/components/Dashboard';
import ToggleDashboards from '~app/components/applications/SSV/NewMyAccount/components/ToggleDashboards';

const ClusterDashboard = ({ changeState }: { changeState: any }) => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const clusterStore: ClusterStore = stores.Cluster;
  const processStore: ProcessStore = stores.Process;
  const myAccountStore: MyAccountStore = stores.MyAccount;
  const { page, pages, per_page, total } = myAccountStore.ownerAddressClustersPagination;

  const moveToRegisterValidator = () => {
    navigate(config.routes.SSV.VALIDATOR.HOME);
  };

  const createData = (
      clusterID: string,
      operators: string,
      validators: number,
      operational_runway: string,
  ) => {
    return { clusterID, operators, validators, operational_runway };
  };


  const rows = myAccountStore.ownerAddressClusters?.map((cluster: any)=>{
    return createData(
        longStringShorten(clusterStore.getClusterHash(cluster.operators), 4),
        cluster.operators.map((operator: { id: any; }) => operator.id).join(','),
        cluster.validator_count,
        `${formatNumberToUi(cluster.runWay, true)} Days`);
  });

  const openSingleCluster = (listIndex: string) => {
    processStore.setProcess({
      processName: 'single_cluster',
      item: myAccountStore.ownerAddressClusters[listIndex],
    }, 2);
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.ROOT);
  };

  const moveToFeeRecipient = () => {
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.FEE_RECIPIENT);
  };

  const onChangePage = _.debounce( async (newPage: number) =>  {
    // setLoadingOperators(true);
    await myAccountStore.getOwnerAddressClusters({ forcePage: newPage });
    // setLoadingOperators(false);
  }, 200);

  return (
    <Grid container className={classes.MyAccountWrapper}>
      <Grid container item className={classes.HeaderWrapper}>
        <ToggleDashboards changeState={changeState} title={'Validator Clusters'} />
        <Grid container item xs className={classes.HeaderButtonsWrapper}>
          <Grid item className={`${classes.HeaderButton} ${classes.lightHeaderButton}`} onClick={moveToFeeRecipient}>
            Fee Address
          </Grid>
          <Grid item className={classes.HeaderButton} onClick={moveToRegisterValidator}>Add Cluster</Grid>
        </Grid>
      </Grid>
      <Dashboard
          disable
          rows={rows}
          noItemsText={'No Clusters'}
          paginationActions={{
            page,
            count: total,
            onChangePage,
            totalPages: pages,
            rowsPerPage: per_page,
          }}
          rowsAction={openSingleCluster}
          columns={[
            { name: 'Cluster ID', tooltip: 'asdad' },
            { name: 'Operators' },
            { name: 'Validators' },
            { name: 'Operational Runway' },
          ]}
      />
    </Grid>
  );
};

export default observer(ClusterDashboard);
