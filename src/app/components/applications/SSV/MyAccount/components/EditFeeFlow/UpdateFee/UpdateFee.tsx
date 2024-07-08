import Decimal from 'decimal.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid } from '~app/atomicComponents';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/UpdateFee.styles';
import ChangeFee from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/ChangeFee';
import DecreaseFlow from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/DecreaseFlow';
import IncreaseFlow from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/IncreaseFlow';
import { ErrorType } from '~app/components/common/ConversionInput/ConversionInput';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { setIsLoading } from '~app/redux/appState.slice';
import { getStrategyRedirect } from '~app/redux/navigation.slice';
import { clearOperatorFeeInfo, fetchAndSetOperatorFeeInfo, getFeeIncreaseAndPeriods, getMaxOperatorFeePerYear, getOperatorProcessId } from '~app/redux/operator.slice.ts';
import { formatNumberToUi } from '~lib/utils/numbers';
import { isOperatorPrivate } from '~lib/utils/operatorMetadataHelper';
import { validateFeeUpdate } from '~lib/utils/validatesInputs';
import { fromWei, getFeeForYear } from '~root/services/conversions.service';
import { getOperator } from '~root/services/operator.service';
import NewWhiteWrapper, { WhiteWrapperDisplayType } from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper.tsx';

enum FeeUpdateSteps {
  START = 'Start',
  INCREASE = 'Increase',
  DECREASE = 'Decrease'
}

const UpdateFee = () => {
  const navigate = useNavigate();
  const [operator, setOperator] = useState<any>(null);
  const [newFee, setNewFee] = useState<any>(0);
  const [nextIsDisabled, setNextIsDisabled] = useState(true);
  const { logo } = operator || {};
  const [oldFee, setOldFee] = useState('0');
  const classes = useStyles({ operatorLogo: logo });
  const [currency, setCurrency] = useState('SSV');
  const [currentFlowStep, setCurrentFlowStep] = useState(FeeUpdateSteps.START);
  const [error, setError] = useState({
    shouldDisplay: false,
    errorMessage: ''
  });
  const dispatch = useAppDispatch();
  const strategyRedirect = useAppSelector(getStrategyRedirect);
  const processOperatorId = useAppSelector(getOperatorProcessId);
  const feeIncreaseAndPeriods = useAppSelector(getFeeIncreaseAndPeriods);
  const maxOperatorFeePerYear = useAppSelector(getMaxOperatorFeePerYear);

  useEffect(() => {
    if (!processOperatorId) return navigate(strategyRedirect);
    dispatch(setIsLoading(true));
    getOperator(processOperatorId).then(async (response) => {
      if (response) {
        const operatorFee = formatNumberToUi(getFeeForYear(fromWei(response.fee)));
        setOperator(response);
        setOldFee(operatorFee);
        const res = await dispatch(fetchAndSetOperatorFeeInfo(response.id));
        if (!res.payload.operatorFutureFee) {
          setNewFee(Number(operatorFee));
        }
        if (res.payload.operatorApprovalBeginTime && res.payload.operatorApprovalEndTime && res.payload.operatorFutureFee) {
          setNewFee(formatNumberToUi(getFeeForYear(fromWei(res.payload.operatorFutureFee))));
          setCurrentFlowStep(FeeUpdateSteps.INCREASE);
        } else {
          setCurrentFlowStep(FeeUpdateSteps.START);
        }
      }
      dispatch(setIsLoading(false));
    });
  }, []);

  useEffect(() => {
    if (error.shouldDisplay || Number(newFee) === Number(oldFee)) {
      setNextIsDisabled(true);
    } else {
      setNextIsDisabled(false);
    }
  }, [newFee, error]);

  const declareNewFeeHandler = () => {
    setCurrentFlowStep(FeeUpdateSteps.START);
  };

  const updateFeeErrorHandler = (errorResponse: ErrorType) => {
    setError(errorResponse);
    if (errorResponse.shouldDisplay) {
      setNextIsDisabled(true);
    } else {
      setNextIsDisabled(false);
    }
  };

  const onInputChange = (e: any) => {
    const { value } = e.target;
    setNewFee(value.trim());
    const isPrivateOperator = isOperatorPrivate(operator);
    validateFeeUpdate({
      previousValue: new Decimal(getFeeForYear(fromWei(operator.fee))),
      newValue: value,
      maxFeeIncrease: feeIncreaseAndPeriods.maxFeeIncrease,
      isPrivateOperator,
      maxFee: maxOperatorFeePerYear,
      callback: updateFeeErrorHandler
    });
  };
  const onNextHandler = () => {
    dispatch(clearOperatorFeeInfo());
    if (Number(newFee) > Number(oldFee)) {
      setCurrentFlowStep(FeeUpdateSteps.INCREASE);
    } else {
      setCurrentFlowStep(FeeUpdateSteps.DECREASE);
    }
  };

  const components = {
    [FeeUpdateSteps.START]: ChangeFee,
    [FeeUpdateSteps.INCREASE]: IncreaseFlow,
    [FeeUpdateSteps.DECREASE]: DecreaseFlow
  };
  const Component = components[currentFlowStep];

  return (
    <Grid container item>
      <NewWhiteWrapper type={WhiteWrapperDisplayType.OPERATOR} header={'Update Operator Fee'} />
      <Grid className={classes.BodyWrapper}>
        <Component
          onNextHandler={onNextHandler}
          declareNewFeeHandler={declareNewFeeHandler}
          newFee={newFee}
          onChangeHandler={onInputChange}
          error={error}
          nextIsDisabled={nextIsDisabled}
          currency={currency}
          oldFee={oldFee}
          setCurrency={setCurrency}
        />
      </Grid>
    </Grid>
  );
};

export default UpdateFee;
