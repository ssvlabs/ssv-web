import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Validator from '~lib/api/Validator';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from '../../Withdraw.styles';
import Button from '~app/components/common/Button/Button';
import IntegerInput from '~app/components/common/IntegerInput';
import BorderScreen from '~app/components/common/BorderScreen';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import ClusterStore from '~app/common/stores/applications/SsvWeb/Cluster.store';
import ProcessStore, { SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';
import NewRemainingDays from '~app/components/applications/SSV/MyAccount/common/NewRemainingDays';

const ValidatorFlow = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const ssvStore: SsvStore = stores.SSV;
  const walletStore: WalletStore = stores.Wallet;
  const clusterStore: ClusterStore = stores.Cluster;
  const processStore: ProcessStore = stores.Process;
  const process: SingleCluster = processStore.getProcess;
  const cluster = process.item;
  const clusterBalance = walletStore.fromWei(cluster.balance);
  const [inputValue, setInputValue] = useState(0.0);
  const applicationStore: ApplicationStore = stores.Application;
  const [userAgree, setUserAgreement] = useState(false);
  const [buttonColor, setButtonColor] = useState({ userAgree: '', default: '' });

  useEffect(() => {
    if (clusterStore.getClusterRunWay({ ...cluster, balance: walletStore.toWei(newBalance) }) > 30 && userAgree) {
      setUserAgreement(false);
    }
    if (inputValue === clusterBalance) {
      setButtonColor({ userAgree: '#d3030d', default: '#ec1c2640' });
    } else if (buttonColor.default === '#ec1c2640') {
      setButtonColor({ userAgree: '', default: '' });
    }
  }, [inputValue]);

  const withdrawSsv = async () => {
    applicationStore.setIsLoading(true);
    const success = await ssvStore.withdrawSsv(inputValue.toString());
    setTimeout(async () => {
      const response = await Validator.getInstance().clusterByHash(clusterStore.getClusterHash(cluster.operators));
      const newCluster = response.cluster;
      newCluster.validator_count = newCluster.validatorCount;
      newCluster.operators = cluster.operators;
      processStore.setProcess({
        processName: 'single_cluster',
        // @ts-ignore
        item: await clusterStore.extendClusterEntity(newCluster),
      }, 2);
      applicationStore.setIsLoading(false);
      if (clusterStore.getClusterRunWay({ ...cluster, balance: walletStore.toWei(newBalance) }) <= 0) {
        navigate(-1);
      }
      if (success) setInputValue(0.0);
    }, 10000);
  };

  function inputHandler(e: any) {
    const value = e.target.value;
    if (value > clusterBalance) {
      setInputValue(clusterBalance);
    } else if (value < 0) {
      setInputValue(0);
    } else {
      setInputValue(value);
    }
  }

  function maxValue() {
    // @ts-ignore
    setInputValue(Number(clusterBalance));
  }

  const newBalance = (inputValue ? clusterBalance - Number(inputValue) : clusterBalance).toFixed(18);
  // @ts-ignore
  const errorButton = clusterStore.getClusterRunWay({ ...cluster, balance: walletStore.toWei(newBalance) }) <= 0;
  const showCheckBox = clusterStore.getClusterRunWay({ ...cluster, balance: walletStore.toWei(newBalance) }) <= 30;
  const checkBoxText = errorButton ? 'I understand that withdrawing this amount will liquidate my account.' : 'I understand the risks of having my account liquidated.';
  let buttonText = 'Withdraw';
  if (errorButton) {
    buttonText = 'Liquidate my account';
  } else if (inputValue === clusterBalance) {
    buttonText = 'Withdraw All';
  }

  const secondBorderScreen = [(
      <Grid item container>
        <Grid container item xs={12} className={classes.BalanceWrapper}>
          <Grid item container xs={12}>
            <Grid item xs={6}>
              <IntegerInput
                  type="number"
                  value={inputValue}
                  placeholder={'0.0'}
                  onChange={inputHandler}
                  className={classes.Balance}
              />
            </Grid>
            <Grid item container xs={6} className={classes.MaxButtonWrapper}>
              <Grid item onClick={maxValue} className={classes.MaxButton}>
                MAX
              </Grid>
              <Grid item className={classes.MaxButtonText}>SSV</Grid>
            </Grid>
            {/* <Grid item xs={12} className={classes.BalanceInputDollar}> */}
            {/*  ~$9485.67 */}
            {/* </Grid> */}
          </Grid>
        </Grid>
      </Grid>
  ), (
      <NewRemainingDays withdrawState cluster={{ ...cluster, newRunWay: !inputValue ? undefined : clusterStore.getClusterRunWay({ ...cluster, balance: walletStore.toWei(newBalance) }) }} />
  )];

  return (
      <BorderScreen
          marginTop={0}
          withoutNavigation
          header={'Withdraw'}
          body={secondBorderScreen}
          bottom={[
              <Button
                  text={buttonText}
                  withAllowance={false}
                  onClick={withdrawSsv}
                  errorButton={errorButton}
                  checkboxesText={showCheckBox ? [checkBoxText] : []}
                  checkBoxesCallBack={showCheckBox ? [setUserAgreement] : []}
                  disable={(clusterStore.getClusterRunWay({ ...cluster, balance: walletStore.toWei(newBalance) }) <= 30 && !userAgree) || Number(inputValue) === 0}
              />,
          ]}
      />
  );
};

export default observer(ValidatorFlow);
