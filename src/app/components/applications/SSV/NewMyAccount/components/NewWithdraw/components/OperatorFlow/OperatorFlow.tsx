import Decimal from 'decimal.js';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from '../../NewWithdraw.styles';
import Button from '~app/components/common/Button/Button';
import IntegerInput from '~app/components/common/IntegerInput';
import BorderScreen from '~app/components/common/BorderScreen';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import ApplicationStore from '~app/common/stores/Abstracts/Application';

const OperatorFlow = () => {
  const classes = useStyles();
  const stores = useStores();
  const ssvStore: SsvStore = stores.SSV;
  const [inputValue, setInputValue] = useState(0.0);
  const applicationStore: ApplicationStore = stores.Application;
  const [userAgree, setUserAgreement] = useState(false);
  const [buttonColor, setButtonColor] = useState({ userAgree: '', default: '' });

  useEffect(() => {
    if (ssvStore.getRemainingDays({ newBalance }) > 30 && userAgree) {
      setUserAgreement(false);
    }
    if (buttonColor.default === '#ec1c2640') {
      setButtonColor({ userAgree: '', default: '' });
    }
  }, [inputValue]);

  const withdrawSsv = async () => {
    applicationStore.setIsLoading(true);
    const success = await ssvStore.withdrawSsv(ssvStore.isValidatorState, inputValue.toString(), new Decimal(inputValue).equals(ssvStore.contractDepositSsvBalance));
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
    // @ts-ignore
    setInputValue(ssvStore.toDecimalNumber(Number(ssvStore.contractDepositSsvBalance)));
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
            {/* <Grid item xs={12} className={classes.BalanceInputDollar}> */}
            {/*  ~$9485.67 */}
            {/* </Grid> */}
          </Grid>
        </Grid>
      </Grid>
  )];

  const newBalance = inputValue ? ssvStore.contractDepositSsvBalance - Number(inputValue) : undefined;
  let buttonText = 'Withdraw';
  if (inputValue === ssvStore.contractDepositSsvBalance) {
    buttonText = 'Withdraw All';
  }

  return (
      <BorderScreen
          marginTop={0}
          withConversion
          withoutNavigation
          header={'Withdraw'}
          body={secondBorderScreen}
          bottom={[(
              <Button
                  text={buttonText}
                  withAllowance={false}
                  onClick={withdrawSsv}
                  disable={(ssvStore.isValidatorState && ssvStore.getRemainingDays({ newBalance }) <= 30 && !userAgree) || Number(inputValue) === 0}
              />
          )]}
      />
  );
};

export default observer(OperatorFlow);
