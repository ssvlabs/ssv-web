import { observer } from 'mobx-react';
import styled from 'styled-components';
import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { getImage } from '~lib/utils/filePath';
import { useStores } from '~app/hooks/useStores';
import SsvStore from '~app/common/stores/SSV.store';
import { formatNumberToUi } from '~lib/utils/numbers';
import CTAButton from '~app/common/components/CTAButton';
import config, { translations } from '~app/common/config';
import IntegerInput from '~app/common/components/IntegerInput';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import RemainingDays from '~app/components/MyAccount/common/componenets/RemainingDays';
import { useStyles } from './Deposit.styles';

const Title = styled.div`
  height: 18px;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #a1acbe;
`;

const Deposit = () => {
    const stores = useStores();
    const classes = useStyles();
    const ssvStore: SsvStore = stores.SSV;
    const [inputValue, setInputValue] = useState(0.0);

    const depositSsv = async () => {
        await ssvStore.deposit(inputValue.toString());
        setInputValue(0.0);
    };

    return (
      <div className={classes.DepositWrapper}>
        <BorderScreen
          withConversion
          header={'Deposit'}
          link={{ to: config.routes.MY_ACCOUNT.DASHBOARD, text: translations.MY_ACCOUNT.DEPOSIT.NAVIGATION_TEXT }}
          body={[
                    (
                      <Grid item container>
                        <Grid item xs={12}>
                          <Title>Amount</Title>
                        </Grid>
                        <Grid container item xs={12} className={classes.BalanceWrapper}>
                          <Grid item container xs={12}>
                            <Grid item xs={6}>
                              <IntegerInput
                                type="number"
                                onChange={(e) => { // @ts-ignore
                                                setInputValue(e.target.value); }}
                                value={inputValue}
                                className={classes.Balance}
                              />
                            </Grid>
                            <Grid item container xs={6} className={classes.MaxButtonWrapper}>
                              <Grid item onClick={() => { setInputValue(ssvStore.ssvBalance); }}>
                                <img className={classes.MaxButtonImage} src={getImage('max-button.svg')} />
                              </Grid>
                              <Grid item className={classes.MaxButtonText}>SSV</Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} className={classes.WalletBalance} onClick={() => { setInputValue(ssvStore.ssvBalance); }}>
                            Wallet Balance: {formatNumberToUi(ssvStore.ssvBalance)} SSV
                          </Grid>
                        </Grid>
                      </Grid>
                    ),
                    (
                      <>
                        <RemainingDays fromPage={'deposit'} inputValue={inputValue} />
                      </>
                    ),
          ]}
          bottom={(
            <Grid container className={classes.ButtonWrapper}>
              <Grid item xs>
                <CTAButton text={'Deposit'} disable={ssvStore.ssvBalance === 0 || inputValue <= 0} onClick={depositSsv} withAllowance />
              </Grid>
            </Grid>
          )}
        />
      </div>
    );
};
export default observer(Deposit);