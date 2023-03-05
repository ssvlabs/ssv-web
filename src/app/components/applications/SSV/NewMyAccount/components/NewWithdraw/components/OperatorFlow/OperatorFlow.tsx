import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from '../../NewWithdraw.styles';
import Button from '~app/components/common/Button/Button';
import IntegerInput from '~app/components/common/IntegerInput';
import BorderScreen from '~app/components/common/BorderScreen';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import ProcessStore, { SingleOperator } from '~app/common/stores/applications/SsvWeb/Process.store';

const OperatorFlow = () => {
  const classes = useStyles();
  const stores = useStores();
  const ssvStore: SsvStore = stores.SSV;
  const [inputValue, setInputValue] = useState(0.0);
  const processStore: ProcessStore = stores.Process;
  const process: SingleOperator = processStore.getProcess;
  const applicationStore: ApplicationStore = stores.Application;
  const operator = process?.item;
  const operatorBalance = operator?.balance ?? 0;

  const withdrawSsv = async () => {
    applicationStore.setIsLoading(true);
    const success = await ssvStore.withdrawSsv(inputValue.toString());
    applicationStore.setIsLoading(false);
    if (success) setInputValue(0.0);
  };

  function inputHandler(e: any) {
    const value = e.target.value;
    if (value > operatorBalance) {
      setInputValue(operatorBalance);
    } else if (value < 0) {
      setInputValue(0);
    } else {
      setInputValue(value);
    }
  }

  function maxValue() {
    // @ts-ignore
    setInputValue(operatorBalance);
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

  return (
      <BorderScreen
          marginTop={0}
          withConversion
          withoutNavigation
          header={'Withdraw'}
          body={secondBorderScreen}
          bottom={[(
              <Button
                  text={'Withdraw'}
                  withAllowance={false}
                  onClick={withdrawSsv}
                  disable={Number(inputValue) === 0}
              />
          )]}
      />
  );
};

export default observer(OperatorFlow);
