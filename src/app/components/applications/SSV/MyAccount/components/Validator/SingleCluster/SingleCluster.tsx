import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef, useState } from 'react';
import config from '~app/common/config';
import Validator from '~lib/api/Validator';
import { useStores } from '~app/hooks/useStores';
import Status from '~app/components/common/Status';
import { useStyles } from './SingleCluster.styles';
import ImageDiv from '~app/components/common/ImageDiv';
import { longStringShorten } from '~lib/utils/strings';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import ClusterStore from '~app/common/stores/applications/SsvWeb/Cluster.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import Balance from '~app/components/applications/SSV/MyAccount/components/Balance';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import Dashboard from '~app/components/applications/SSV/NewMyAccount/components/Dashboard/Dashboard';
import ProcessStore, { SingleCluster as SingleClusterProcess } from '~app/common/stores/applications/SsvWeb/Process.store';
import OperatorBox from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/OperatorBox';

const SingleCluster = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const settingsRef = useRef(null);
  const beaconchaBaseUrl = getBaseBeaconchaUrl();
  const walletStore: WalletStore = stores.Wallet;
  const processStore: ProcessStore = stores.Process;
  const clusterStore: ClusterStore = stores.Cluster;
  const operatorStore: OperatorStore = stores.Operator;
  const [showSettings, setShowSettings] = useState(false);
  const [loadingValidators, setLoadingValidators] = useState(false);
  const process: SingleClusterProcess = processStore.getProcess;
  const [clusterValidators, setClusterValidators] = useState([]);
  const [clusterValidatorsPagination, setClusterValidatorsPagination] = useState({
    page: 1,
    count: 10,
    onChangePage: console.log,
    totalPages: 1,
    rowsPerPage: 5,
  });
  const cluster = process?.item;

  useEffect(() => {
    if (!cluster) return navigate(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
    setLoadingValidators(true);
    Validator.getInstance().validatorsByClusterHash(walletStore.accountAddress, clusterStore.getClusterHash(cluster.operators)).then((response: any) => {
      setClusterValidators(response.validators);
      setClusterValidatorsPagination(response.pagination);
      setLoadingValidators(false);
    });
  }, []);

  useEffect(() => {
    /**
     * Close menu drop down when click outside
     */
    const handleClickOutside = (e: any) => {
      // @ts-ignore
      if (showSettings && settingsRef.current && (!settingsRef.current.contains(e.target))) {
        setShowSettings(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [settingsRef, showSettings]);

  const createData = (
      publicKey: string,
      status: JSX.Element,
      balance: JSX.Element,
      apr: JSX.Element,
  ) => {
    return { publicKey, status, balance, apr };
  };

  const openBeaconcha = (publicKey: string) => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'external_link',
      action: 'click',
      label: 'Open Beaconcha',
    });
    window.open(`${beaconchaBaseUrl}/validator/${publicKey}`);
  };

  const openExplorer = (publicKey: string) => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'explorer_link',
      action: 'click',
      label: 'operator',
    });
    window.open(`${config.links.EXPLORER_URL}/validators/${publicKey}/?version=${config.links.EXPLORER_VERSION}&network=${config.links.EXPLORER_NETWORK}`, '_blank');
  };

  const moveToRemoveValidator = (validator: any) => {
    process.validator = validator;
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.VALIDATOR_REMOVE.ROOT);
  };

  const extraButtons = (itemIndex: number) => {
    const validator: any = clusterValidators[itemIndex];

    return <Grid container className={classes.ExtraButtonsWrapper}>
      <ImageDiv onClick={()=> openBeaconcha(validator.public_key)} image={'beacon'} width={24} height={24}/>
      <ImageDiv onClick={()=> openExplorer(validator.public_key)} image={'explorer'} width={24} height={24}/>
      <ImageDiv onClick={() => setShowSettings(true)} image={'setting'} width={24} height={24}/>
      {showSettings && <Grid item className={classes.SettingsWrapper}>
        <Grid ref={settingsRef} container item className={classes.Settings}>
          <Grid container item className={classes.Button} onClick={console.log}>
            <Grid className={classes.ChangeOperatorsImage} />
            <Typography>Change Operators</Typography>
            <Grid className={classes.ChangeOperatorsLinkImage} />
          </Grid>
          <Grid container item className={classes.Button} onClick={() => moveToRemoveValidator(validator)}>
            <Grid className={classes.RemoveValidatorImage} />
            <Typography>Remove Validator</Typography>
          </Grid>
        </Grid>
      </Grid>
      }
    </Grid>;
  };

  const rows = clusterValidators?.map((validator: any)=>{
    return createData(
        `0x${longStringShorten(validator.public_key, 4)}`,
        <Status item={validator} />,
        <Grid item>33.12</Grid>,
        <Grid item>{12.3}%</Grid>,
    );
  });

  const addToCluster = () => {
    process.processName = 'cluster_registration';
    operatorStore.selectOperators(cluster.operators);
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.ADD_VALIDATOR);
  };

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
                header={<Grid container className={classes.HeaderWrapper}>
                  <Grid item className={classes.Header}>Validators</Grid>
                  <SecondaryButton className={classes.AddToCluster} text={'+ Add Validator'}
                                   submitFunction={addToCluster} />
                </Grid>}
                paginationActions={{ ...clusterValidatorsPagination, onChangePage: console.log }}
                rowsAction={console.log}
                columns={[
                  { name: 'Public Key' },
                  { name: 'Status', tooltip: 'asdsadsadas' },
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
