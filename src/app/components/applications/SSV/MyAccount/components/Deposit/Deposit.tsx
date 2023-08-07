import React, { useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import Button from '~app/components/common/Button/Button';
import IntegerInput from '~app/components/common/IntegerInput';
import BorderScreen from '~app/components/common/BorderScreen';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { useTermsAndConditions } from '~app/hooks/useTermsAndConditions';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import ClusterStore from '~app/common/stores/applications/SsvWeb/Cluster.store';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import NewRemainingDays from '~app/components/applications/SSV/MyAccount/common/NewRemainingDays';
import ProcessStore, { SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Deposit/Deposit.styles';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';

const Deposit = () => {
  const stores = useStores();
  const navigate = useNavigate();
  const classes = useStyles();
  const ssvStore: SsvStore = stores.SSV;
  const walletStore: WalletStore = stores.Wallet;
  const processStore: ProcessStore = stores.Process;
  const clusterStore: ClusterStore = stores.Cluster;
  const myAccountStore: MyAccountStore = stores.MyAccount;
  const process: SingleCluster = processStore.getProcess;
  const cluster = process.item;
  const clusterBalance = walletStore.fromWei(cluster.balance);
  const applicationStore: ApplicationStore = stores.Application;
  const [inputValue, setInputValue] = useState('');
  const { checkedCondition } = useTermsAndConditions();


  async function depositSsv() {
    applicationStore.setIsLoading(true);
    await ssvStore.deposit(inputValue.toString()).then(async (success: boolean) => {
      cluster.balance = await clusterStore.getClusterBalance(cluster.operators);
      GoogleTagManager.getInstance().sendEvent({
        category: 'my_account',
        action: 'deposit_tx',
        label: 'success',
      });
        await myAccountStore.getOwnerAddressClusters({});
        applicationStore.setIsLoading(false);
      if (success) navigate(-1);
    }).catch((error) => {
      GoogleTagManager.getInstance().sendEvent({
        category: 'my_account',
        action: 'deposit_tx',
        label: 'error',
      });
      console.error(error);
    });
    setInputValue('');
    applicationStore.setIsLoading(false);
  }

  function inputHandler(e: any) {
    let value = e.target.value.trim();
    if (value === '') {
        setInputValue(value);
        return;
    }
    if (Number(value) > ssvStore.walletSsvBalance) value = String(ssvStore.walletSsvBalance);
    setInputValue(value);
  }

  function maxDeposit() {
    setInputValue(String(ssvStore.walletSsvBalance));
  }

  const newBalance = inputValue ? clusterBalance + Number(inputValue) : undefined;

  return (
      <Grid container>
        <NewWhiteWrapper
            type={0}
            header={'Cluster'}
        />
        <BorderScreen
            withoutNavigation
            header={'Deposit'}
            body={[
              (
                  <Grid item container>
                    <Grid container item xs={12} className={classes.BalanceWrapper}>
                      <Grid item container xs={12}>
                        <Grid item xs={6}>
                          <IntegerInput
                              min={'0'}
                              type="number"
                              value={inputValue}
                              placeholder={'0.0'}
                              onChange={inputHandler}
                              className={classes.Balance}
                          />
                        </Grid>
                        <Grid item container xs={6} className={classes.MaxButtonWrapper}>
                          <Grid item onClick={maxDeposit} className={classes.MaxButton}>
                            MAX
                          </Grid>
                          <Grid item className={classes.MaxButtonText}>SSV</Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} className={classes.WalletBalance}>
                        Wallet Balance: {formatNumberToUi(ssvStore.walletSsvBalance)} SSV
                      </Grid>
                    </Grid>
                  </Grid>
              ),
              (
                  <>
                    <NewRemainingDays isInputFilled={!!inputValue} cluster={{ ...cluster, newRunWay: !inputValue ? undefined : clusterStore.getClusterRunWay({ ...cluster, balance: walletStore.toWei(newBalance) }) }}/>
                  </>
              ),
            ]}
            bottom={[(
                <TermsAndConditionsCheckbox>
                    <Button
                    withAllowance
                    text={'Deposit'}
                    onClick={depositSsv}
                    disable={Number(inputValue) <= 0 || !checkedCondition}
                    totalAmount={inputValue}
                />
                </TermsAndConditionsCheckbox>
            )]}
        />
      </Grid>
  );
};

export default observer(Deposit);
