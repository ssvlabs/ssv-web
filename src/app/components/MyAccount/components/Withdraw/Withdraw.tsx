import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import IntegerInput from '~app/common/components/IntegerInput';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import RemainingDays from '~app/components/MyAccount/common/componenets/RemainingDays/RemainingDays';
import Button from '~app/common/components/Button/Button';
import { useStyles } from './Withdrew.styles';

const Withdraw = () => {
    const classes = useStyles();
    const stores = useStores();
    const ssvStore: SsvStore = stores.SSV;
    const applicationStore: ApplicationStore = stores.Application;
    const [inputValue, setInputValue] = useState(0.0);
    const [userAgree, setUserAgreement] = useState(false);
    const [buttonColor, setButtonColor] = useState({ userAgree: '', default: '' });

    useEffect(() => {
        if (inputValue === ssvStore.contractDepositSsvBalance && ssvStore.isValidatorState) {
            setButtonColor({ userAgree: '#d3030d', default: '#ec1c2640' });
        } else if (buttonColor.default === '#ec1c2640') {
            setButtonColor({ userAgree: '', default: '' });
        }
    }, [inputValue]);

    const withdrawSsv = async () => {
        applicationStore.setIsLoading(true);
        const success = await ssvStore.withdrawSsv(inputValue.toString());
        applicationStore.setIsLoading(false);
        if (success) setInputValue(0.0);
    };

    function inputHandler(e: any) {
        const value = e.target.value;
        if (value > ssvStore.contractDepositSsvBalance) {
            setInputValue(ssvStore.contractDepositSsvBalance);
        } else if (value < 0) {
            setInputValue(0);
        } else {
            setInputValue(value);
        }
    }

    function maxValue() {
        setInputValue(ssvStore.contractDepositSsvBalance);
    }

    const secondBorderScreen = [(
      <Grid item container>
        <Grid container item xs={12} className={classes.BalanceWrapper}>
          <Grid item container xs={12}>
            <Grid item xs={6}>
              <IntegerInput
                type="number"
                value={inputValue}
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
            <Grid item xs={12} className={classes.BalanceInputDollar}>
              ~$9485.67
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )];

    if (ssvStore.isValidatorState) {
        const remainDays = ssvStore.getRemainingDays({ newBalance: ssvStore.contractDepositSsvBalance - (ssvStore.contractDepositSsvBalance - Number(inputValue)) });
     secondBorderScreen.push((<RemainingDays withdraw operator={'-'} newRemainingDays={remainDays} />));
    }

    return (
      <>
        <BorderScreen
          header={'Available Balance'}
          wrapperClass={classes.FirstSquare}
          body={[
                    (
                      <Grid item container>
                        <Grid item xs={12} className={classes.currentBalance}>
                          {formatNumberToUi(ssvStore.contractDepositSsvBalance)} SSV
                        </Grid>
                        <Grid item xs={12} className={classes.currentBalanceDollar}>
                          ~$2,449.53
                        </Grid>
                      </Grid>
                    ),
                ]}
        />
        <BorderScreen
          withoutNavigation
          header={'Withdraw'}
          body={secondBorderScreen}
          bottom={(
            <Button
              withAllowance
              text={'Withdraw'}
              onClick={withdrawSsv}
              checkBoxesCallBack={[setUserAgreement]}
              disable={!userAgree || inputValue === 0}
              checkboxesText={['I understand that risks of having my account liquidated.']}
            />
          )}
        />
      </>
    );
};

export default observer(Withdraw);
