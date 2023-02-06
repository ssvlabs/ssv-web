import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import Button from '~app/components/common/Button/Button';
import IntegerInput from '~app/components/common/IntegerInput';
import BorderScreen from '~app/components/common/BorderScreen';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import RemainingDays from '~app/components/applications/SSV/MyAccount/common/componenets/RemainingDays';
import { useStyles } from './Deposit.styles';

const Deposit = () => {
  const stores = useStores();
  const classes = useStyles();
  const ssvStore: SsvStore = stores.SSV;
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
    let value = e.target.value;
    if (value === '') value = '0.0';
    if (value > ssvStore.walletSsvBalance) value = ssvStore.walletSsvBalance;
    setInputValue(value);
  }

  function maxDeposit() {
    setInputValue(String(ssvStore.walletSsvBalance));
  }

  const newBalance = inputValue ? ssvStore.contractDepositSsvBalance + Number(inputValue) : undefined;

  return (
    <div>
      <BorderScreen
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
              <RemainingDays newBalance={newBalance} />
            </>
          ),
        ]}
        bottom={(
          <Button
            withAllowance
            text={'Deposit'}
            onClick={depositSsv}
            disable={Number(inputValue) <= 0}
          />
        )}
      />
    </div>
  );
};

export default observer(Deposit);
