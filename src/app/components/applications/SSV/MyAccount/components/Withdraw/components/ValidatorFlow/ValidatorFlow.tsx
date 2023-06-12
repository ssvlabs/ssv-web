import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Validator from '~lib/api/Validator';
import { useStores } from '~app/hooks/useStores';
import Button from '~app/components/common/Button/Button';
import IntegerInput from '~app/components/common/IntegerInput';
import BorderScreen from '~app/components/common/BorderScreen';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import { useTermsAndConditions } from '~app/hooks/useTermsAndConditions';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import ClusterStore from '~app/common/stores/applications/SsvWeb/Cluster.store';
import NewRemainingDays from '~app/components/applications/SSV/MyAccount/common/NewRemainingDays';
import ProcessStore, { SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Withdraw/Withdraw.styles';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';

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
  const applicationStore: ApplicationStore = stores.Application;
  const [userAgree, setUserAgreement] = useState(false);
  const { checkedCondition } = useTermsAndConditions();
  const [withdrawValue, setWithdrawValue] = useState<number | string>('');
  const [buttonColor, setButtonColor] = useState({ userAgree: '', default: '' });

  useEffect(() => {
    if (clusterStore.getClusterRunWay({ ...cluster, balance: walletStore.toWei(newBalance) }) > 30 && userAgree) {
      setUserAgreement(false);
    }
    if (withdrawValue === clusterBalance) {
      setButtonColor({ userAgree: '#d3030d', default: '#ec1c2640' });
    } else if (buttonColor.default === '#ec1c2640') {
      setButtonColor({ userAgree: '', default: '' });
    }
  }, [withdrawValue]);

  const withdrawSsv = async () => {
    applicationStore.setIsLoading(true);
    const success = await ssvStore.withdrawSsv(withdrawValue.toString());
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
      if (success) {
        setWithdrawValue(0.0);
        navigate(-1);
      }
    }, 10000);
  };

  function inputHandler(e: any) {
    const value = e.target.value;
    if (value > clusterBalance) {
      setWithdrawValue(clusterBalance);
    } else if (value < 0) {
      setWithdrawValue(0);
    } else if (value === '') {
      setWithdrawValue(value);
    } else {
      setWithdrawValue(Number(value));
    }
  }

  function maxValue() {
    // @ts-ignore
    setWithdrawValue(Number(clusterBalance));
  }
  
  const newBalance = (withdrawValue ? clusterBalance - Number(withdrawValue) : clusterBalance).toFixed(18);
  // @ts-ignore
  const errorButton = clusterStore.getClusterRunWay({ ...cluster, balance: walletStore.toWei(newBalance) }) <= 0;
  const showCheckBox = clusterStore.getClusterRunWay({ ...cluster, balance: walletStore.toWei(newBalance) }) <= 30;
  const buttonDisableCondition = clusterStore.getClusterRunWay({ ...cluster, balance: walletStore.toWei(newBalance) }) <= 30 && !userAgree || Number(withdrawValue) === 0 || !checkedCondition;
  const checkBoxText = errorButton ? 'I understand that withdrawing this amount will liquidate my cluster.' : 'I understand the risks of having my cluster liquidated.';
  let buttonText = 'Withdraw';
  if (errorButton) {
    buttonText = 'Liquidate my cluster';
  } else if (withdrawValue === clusterBalance) {
    buttonText = 'Withdraw All';
  }

  const secondBorderScreen = [(
      <Grid item container>
        <Grid container item xs={12} className={classes.BalanceWrapper}>
          <Grid item container xs={12}>
            <Grid item xs={6}>
              <IntegerInput
                  type="number"
                  value={withdrawValue}
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
      <NewRemainingDays withdrawState isInputFilled={!!withdrawValue} cluster={{ ...cluster, newRunWay: !withdrawValue ? undefined : clusterStore.getClusterRunWay({ ...cluster, balance: walletStore.toWei(newBalance) }) }} />
  )];

  return (
      <BorderScreen
          marginTop={0}
          withoutNavigation
          header={'Withdraw'}
          body={secondBorderScreen}
          bottom={[
              <TermsAndConditionsCheckbox buttonElement={<Button
                  text={buttonText}
                  withAllowance={false}
                  onClick={withdrawSsv}
                  errorButton={errorButton}
                  checkboxesText={showCheckBox ? [checkBoxText] : []}
                  checkBoxesCallBack={showCheckBox ? [setUserAgreement] : []}
                  disable={buttonDisableCondition}
              />}/>,
          ]}
      />
  );
};

export default observer(ValidatorFlow);
