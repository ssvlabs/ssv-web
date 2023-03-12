import _ from 'underscore';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import config from '~app/common/config';
import Validator from '~lib/api/Validator';
import Settings from './components/Settings';
import { useStores } from '~app/hooks/useStores';
import Status from '~app/components/common/Status';
import { useStyles } from './SingleCluster.styles';
import { longStringShorten } from '~lib/utils/strings';
import ImageDiv from '~app/components/common/ImageDiv';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import ClusterStore from '~app/common/stores/applications/SsvWeb/Cluster.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import Balance from '~app/components/applications/SSV/MyAccount/components/Balance';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import Dashboard from '~app/components/applications/SSV/NewMyAccount/components/Dashboard/Dashboard';
import ProcessStore, { SingleCluster as SingleClusterProcess } from '~app/common/stores/applications/SsvWeb/Process.store';
import OperatorBox from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/OperatorBox';

const SingleCluster = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const walletStore: WalletStore = stores.Wallet;
  const processStore: ProcessStore = stores.Process;
  const clusterStore: ClusterStore = stores.Cluster;
  const operatorStore: OperatorStore = stores.Operator;
  const notificationsStore: NotificationsStore = stores.Notifications;
  const process: SingleClusterProcess = processStore.getProcess;
  const [clusterValidators, setClusterValidators] = useState([]);
  const [loadingValidators, setLoadingValidators] = useState(false);
  const [clusterValidatorsPagination, setClusterValidatorsPagination] = useState({
    page: 1,
    total: 10,
    pages: 1,
    per_page: 5,
    rowsPerPage: 7,
    onChangePage: console.log,
  });

  const cluster = process?.item;

  useEffect(() => {
    if (!cluster) return navigate(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
    setLoadingValidators(true);
    Validator.getInstance().validatorsByClusterHash(1, walletStore.accountAddress, clusterStore.getClusterHash(cluster.operators)).then((response: any) => {
      setClusterValidators(response.validators);
      setClusterValidatorsPagination(response.pagination);
      setLoadingValidators(false);
    });
  }, []);


  const createData = (
      publicKey: JSX.Element,
      status: JSX.Element,
      balance: JSX.Element,
      apr: JSX.Element,
  ) => {
    return { publicKey, status, balance, apr };
  };

  const extraButtons = (itemIndex: number) => {
    const validator: any = clusterValidators[itemIndex];

    return <Settings validator={validator} />;
  };

  const copyToClipboard = (publicKey: string) => {
    navigator.clipboard.writeText(publicKey);
    notificationsStore.showMessage('Copied to clipboard.', 'success');
  };

  const rows = clusterValidators?.map((validator: any)=>{
    return createData(
        <Grid container style={{ alignItems: 'center', gap: 8 }}>
          <Grid item>0x{longStringShorten(validator.public_key, 4)}</Grid>
          <ImageDiv onClick={() => copyToClipboard(validator.public_key)} image={'copy'} width={24} height={24} />
        </Grid>,
        <Status item={validator} />,
        <Grid item>33.12 ETH</Grid>,
        <Grid item>{12.3}%</Grid>,
    );
  });

  const addToCluster = () => {
    process.processName = 'cluster_registration';
    operatorStore.selectOperators(cluster.operators);
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.ADD_VALIDATOR);
  };

  const onChangePage = _.debounce( async (newPage: number) =>  {
    setLoadingValidators(true);
    Validator.getInstance().validatorsByClusterHash(newPage, walletStore.accountAddress, clusterStore.getClusterHash(cluster.operators)).then((response: any) => {
      setClusterValidators(response.validators);
      setClusterValidatorsPagination(response.pagination);
      setLoadingValidators(false);
    }).catch(() => setLoadingValidators(false));
  }, 200);

  return (
      <Grid container>
        <NewWhiteWrapper
            type={0}
            header={'Cluster'}
        />
        <Grid container item className={classes.Section}>
          {(cluster?.operators).map((operator: any, index: number) => {
            return <OperatorBox key={index} operator={operator} />;
          })}
        </Grid>
        <Grid container item className={classes.Section}>
          <Grid item>
            <Balance />
          </Grid>
          <Grid item xs>
            {cluster.operators && <Dashboard
                disable
                rows={rows}
                headerPadding={7}
                loading={loadingValidators}
                noItemsText={'No Validators'}
                header={<Grid container className={classes.HeaderWrapper}>
                  <Grid item className={classes.Header}>Validators</Grid>
                  <SecondaryButton className={classes.AddToCluster} text={'+ Add Validator'} submitFunction={addToCluster} />
                </Grid>}
                paginationActions={{
                  onChangePage: onChangePage,
                  page: clusterValidatorsPagination.page,
                  count: clusterValidatorsPagination.total,
                  totalPages: clusterValidatorsPagination.pages,
                  rowsPerPage: clusterValidatorsPagination.per_page,
                }}
                columns={[
                  { name: 'Public Key' },
                  { name: 'Status', tooltip: 'Refers to the validator’s status in the SSV network (not beacon chain), and reflects whether its operators are consistently performing their duties (according to the last 2 epochs).' },
                  { name: 'Balance' },
                  { name: 'Est. APR' },
                ]}
                extraActions={extraButtons}
            />}
          </Grid>
        </Grid>
      </Grid>
  );
};

export default observer(SingleCluster);
