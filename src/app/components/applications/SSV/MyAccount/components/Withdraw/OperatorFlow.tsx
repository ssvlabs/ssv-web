import Grid from '@mui/material/Grid';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '~app/atomicComponents';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Withdraw/Withdraw.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import IntegerInput from '~app/components/common/IntegerInput';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { IOperator } from '~app/model/operator.model';
import { getIsContractWallet, getIsMainnet } from '~app/redux/wallet.slice';
import { withdrawRewards } from '~root/services/operatorContract.service';

const OperatorFlow = ({ operator }: { operator: IOperator; }) => {
  const [inputValue, setInputValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const isMainnet = useAppSelector(getIsMainnet);
  const isContractWallet = useAppSelector(getIsContractWallet);
  const classes = useStyles();
  const operatorBalance = operator.balance ?? 0;
  const dispatch = useAppDispatch();

  const withdrawSsv = async () => {
    setIsLoading(true);
    const success = await withdrawRewards({ operator, amount: inputValue.toString(), isContractWallet, dispatch });
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
            // @ts-ignore
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
      bottom={[<TermsAndConditionsCheckbox isChecked={isChecked} toggleIsChecked={() => setIsChecked(!isChecked)}
                                           isMainnet={isMainnet}>
        <PrimaryButton
          text={'Withdraw'}
          onClick={withdrawSsv}
          isLoading={isLoading}
          isDisabled={Number(inputValue) === 0 || (isMainnet && !isChecked)}
          size={ButtonSize.XL}/>
      </TermsAndConditionsCheckbox>]}
    />
  );
};

export default OperatorFlow;
