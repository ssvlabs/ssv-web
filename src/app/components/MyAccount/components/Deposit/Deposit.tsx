import { observer } from 'mobx-react';
// import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import { formatNumberToUi } from '~lib/utils/numbers';
// import CTAButton from '~app/common/components/CTAButton';
import config, { translations } from '~app/common/config';
import IntegerInput from '~app/common/components/IntegerInput';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import RemainingDays from '~app/components/MyAccount/common/componenets/RemainingDays';
import { useStyles } from './Deposit.styles';
import PrimaryWithAllowance from '~app/common/components/Buttons/PrimaryWithAllowance/PrimaryWithAllowance';

const Deposit = () => {
    const stores = useStores();
    const classes = useStyles();
    const ssvStore: SsvStore = stores.SSV;
    const { redirectUrl, history } = useUserFlow();
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        redirectUrl && history.push(redirectUrl);
    }, [redirectUrl]);

    async function depositSsv() {
        await ssvStore.deposit(inputValue.toString());
        setInputValue('0.0');
    }

    function inputHandler(e: any) {
        let value = e.target.value;
        if (value === '') value = '0.0';
        if (value > ssvStore.networkContractBalance) value = ssvStore.networkContractBalance;
        setInputValue(`${+value}`);
    }

    function maxDeposit() {
        setInputValue(String(ssvStore.networkContractBalance));
    }

    return (
      <div>
        <BorderScreen
          header={'Deposit'}
          navigationLink={config.routes.MY_ACCOUNT.DASHBOARD}
          navigationText={translations.MY_ACCOUNT.DEPOSIT.NAVIGATION_TEXT}
          body={[
                    (
                      <Grid item container>
                        <Grid container item xs={12} className={classes.BalanceWrapper}>
                          <Grid item container xs={12}>
                            <Grid item xs={6}>
                              <IntegerInput
                                min="0"
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
                            Wallet Balance: {formatNumberToUi(ssvStore.ssvContractBalance)} SSV
                          </Grid>
                        </Grid>
                      </Grid>
                    ),
                    (
                      <>
                        <RemainingDays newRemainingDays={`+${formatNumberToUi(ssvStore.getRemainingDays(Number(inputValue)), true)}`} />
                      </>
                    ),
          ]}
          bottom={(
            <PrimaryWithAllowance
              withAllowance
              text={'Deposit'}
              onClick={depositSsv}
              disable={ssvStore.ssvContractBalance === 0 || Number(inputValue) <= 0}
            />
          )}
        />
      </div>
    );
};
export default observer(Deposit);