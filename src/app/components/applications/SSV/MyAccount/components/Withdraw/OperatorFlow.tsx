import  { useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Button from '~app/components/common/Button/Button';
import IntegerInput from '~app/components/common/IntegerInput';
import BorderScreen from '~app/components/common/BorderScreen';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Withdraw/Withdraw.styles';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';
import { getIsContractWallet, getIsMainnet } from '~app/redux/wallet.slice';
import { useAppSelector } from '~app/hooks/redux.hook';
import { IOperator } from '~app/model/operator.model';
import { getOperatorBalance, withdrawRewards } from '~root/services/operator.service';
import { useStores } from '~app/hooks/useStores';
import { SingleOperator } from '~app/model/processes.model';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';

const OperatorFlow = ({ operator }: { operator: IOperator }) => {
  const [inputValue, setInputValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const isMainnet = useAppSelector(getIsMainnet);
  const isContractWallet = useAppSelector(getIsContractWallet);
  const classes = useStyles();
  const operatorBalance = operator.balance ?? 0;
  const stores = useStores();
  const processStore: ProcessStore = stores.Process;
  const process: SingleOperator = processStore.getProcess;

  const callbackAfterExecution = async () => {
    const balance = await getOperatorBalance({ id: operator.id });
    process.item = { ...process.item, balance };
  };


  const withdrawSsv = async () => {
    setIsLoading(true);
    const success = await withdrawRewards({ operator, amount: inputValue.toString(), isContractWallet, callbackAfterExecution });
    setIsLoading(false);
    if (success) {
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
