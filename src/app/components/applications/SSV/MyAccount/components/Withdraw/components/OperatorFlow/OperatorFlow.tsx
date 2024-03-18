import React, { useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import Button from '~app/components/common/Button/Button';
import IntegerInput from '~app/components/common/IntegerInput';
import BorderScreen from '~app/components/common/BorderScreen';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Withdraw/Withdraw.styles';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';
import { SingleOperator } from '~app/model/processes.model';
import { getIsMainnet } from '~app/redux/wallet.slice';
import { useAppSelector } from '~app/hooks/redux.hook';
import { store } from '~app/store';
import { setIsShowTxPendingPopup } from '~app/redux/appState.slice';
import { WalletStore } from '~app/common/stores/applications/SsvWeb';

const OperatorFlow = () => {
  const classes = useStyles();
  const stores = useStores();
  const navigate = useNavigate();
  const ssvStore: SsvStore = stores.SSV;
  const walletStore: WalletStore = stores.Wallet;
  const [inputValue, setInputValue] = useState(0.0);
  const [isLoading, setIsLoading] = useState(false);
  const processStore: ProcessStore = stores.Process;
  const process: SingleOperator = processStore.getProcess;
  const operatorStore: OperatorStore = stores.Operator;
  const operator = process?.item;
  const operatorBalance = operator?.balance ?? 0;
  const isMainnet = useAppSelector(getIsMainnet);
  const [isChecked, setIsChecked] = useState(false);

  const withdrawSsv = async () => {
    setIsLoading(true);
    const success = await ssvStore.withdrawSsv(inputValue.toString());
    setIsLoading(false);
    if (!walletStore.isContractWallet) {
      store.dispatch(setIsShowTxPendingPopup(false));
    }
    if (success) {
      setInputValue(0.0);
      const balance = await operatorStore.getOperatorBalance(operator.id);
      processStore.setProcess({
        processName: 'single_operator',
        item: { ...operator, balance },
      }, 1);
      navigate(-1);
    }
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
          bottom={[<TermsAndConditionsCheckbox isChecked={isChecked} toggleIsChecked={() => setIsChecked(!isChecked)} isMainnet={isMainnet}>
            <Button
              text={'Withdraw'}
              withAllowance={false}
              onClick={withdrawSsv}
              isLoading={isLoading}
              disable={Number(inputValue) === 0 || (isMainnet && !isChecked)}
          />
          </TermsAndConditionsCheckbox>]}
      />
  );
};

export default observer(OperatorFlow);
