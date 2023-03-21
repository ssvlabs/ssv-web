import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import { useStyles } from './Deposit.styles';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import Button from '~app/components/common/Button/Button';
import IntegerInput from '~app/components/common/IntegerInput';
import BorderScreen from '~app/components/common/BorderScreen';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import ProcessStore, { SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';
import NewRemainingDays from '~app/components/applications/SSV/NewMyAccount/common/NewRemainingDays';

const Deposit = () => {
  const stores = useStores();
  const classes = useStyles();
  const ssvStore: SsvStore = stores.SSV;
  const walletStore: WalletStore = stores.Wallet;
  const processStore: ProcessStore = stores.Process;
  const process: SingleCluster = processStore.getProcess;
  const cluster = process.item;
  const clusterBalance = walletStore.fromWei(cluster.balance);
  const applicationStore: ApplicationStore = stores.Application;
  const [inputValue, setInputValue] = useState('');

  async function depositSsv() {
    applicationStore.setIsLoading(true);
    await ssvStore.deposit(inputValue.toString()).then(() => {
      GoogleTagManager.getInstance().sendEvent({
        category: 'my_account',
        action: 'deposit_tx',
        label: 'success',
      });
    }).catch((error) => {
      GoogleTagManager.getInstance().sendEvent({
        category: 'my_account',
        action: 'deposit_tx',
        label: 'error',
      });
      console.error(error);
    });
    setInputValue('0.0');
    applicationStore.setIsLoading(false);
  }

  function inputHandler(e: any) {
    let value = e.target.value.trim();
    if (value === '') value = '0.0';
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
                      <Grid item xs={12} className={classes.WalletBalance} onClick={maxDeposit}>
                        Wallet Balance: {formatNumberToUi(ssvStore.walletSsvBalance)} SSV
                      </Grid>
                    </Grid>
                  </Grid>
              ),
              (
                  <>
                    <NewRemainingDays cluster={{ ...cluster, newBalance: newBalance }}/>
                  </>
              ),
            ]}
            bottom={[(
                <Button
                    withAllowance
                    text={'Deposit'}
                    onClick={depositSsv}
                    disable={Number(inputValue) <= 0}
                />
            )]}
        />
      </Grid>
  );
};

export default observer(Deposit);
