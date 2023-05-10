import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import WhiteWrapper from '~app/components/common/WhiteWrapper';
import { validateFeeUpdate } from '~lib/utils/validatesInputs';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import { ErrorType } from '~app/components/common/ConversionInput/ConversionInput';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import OperatorId from '~app/components/applications/SSV/MyAccount/components/OperatorId';
import CancelUpdateFee
  from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/CancelUpdateFee';
import {
  useStyles,
} from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/UpdateFee.styles';
import ChangeFee
    from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/ChangeFee';
import IncreaseFlow
  from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/IncreaseFlow';
import DecreaseFlow
  from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/DecreaseFlow';

export type ChangeFeeProps = {
  error: ErrorType;
  nextIsDisabled: boolean;
  onNextHandler: Function;
  onChangeHandler?: Function;
  inputValue: number | string;
};

// eslint-disable-next-line no-unused-vars
enum FeeUpdateSteps {
  // eslint-disable-next-line no-unused-vars
  START = 'Start',
  // eslint-disable-next-line no-unused-vars
  INCREASE = 'Increase',
  // eslint-disable-next-line no-unused-vars
  DECREASE = 'Decrease',
}

const UpdateFee = () => {
  const stores = useStores();
  const navigate = useNavigate();
  const ssvStore: SsvStore = stores.SSV;
  const walletStore: WalletStore = stores.Wallet;
  const operatorStore: OperatorStore = stores.Operator;
  const [operator, setOperator] = useState<any>(null);
  const applicationStore: ApplicationStore = stores.Application;
  const [inputValue, setInputValue] = useState<any>(0);
  const [nextIsDisabled, setNextIsDisabled] = useState(true);
  const [currentFlowStep, setCurrentFlowStep] = useState(FeeUpdateSteps.START);

  const { logo, id } = operator || {};
  const classes = useStyles({ operatorLogo: logo });
  const [currentFee, setCurrentFee] = useState(0);
  const [error, setError] = useState({ shouldDisplay: false, errorMessage: '' });

  useEffect(() => {
    if (!operatorStore.processOperatorId) return navigate(applicationStore.strategyRedirect);
    applicationStore.setIsLoading(true);
    Operator.getInstance().getOperator(operatorStore.processOperatorId).then(async (response: any) => {
      if (response) {
        const operatorFee = formatNumberToUi(ssvStore.getFeeForYear(walletStore.fromWei(response.fee)));
        setOperator(response);
        setCurrentFee(+operatorFee);
        setInputValue(operatorFee);
      }
      applicationStore.setIsLoading(false);
    });
  }, []);
  
  const setErrorHandler = ( errorResponse: ErrorType ) => {
    setError(errorResponse);
    if (errorResponse.shouldDisplay) {
      setNextIsDisabled(true);
    } else {
      setNextIsDisabled(false);
    }
  };

  const onInputChange = ( e : any ) => {
    const { value } = e.target;
    setInputValue(value);
    if (value !== '') {
      validateFeeUpdate(operator.fee, value, operatorStore.maxFeeIncrease, setErrorHandler);
    } else {
      setError({ shouldDisplay: false, errorMessage: '' });
      setNextIsDisabled(true);
    }
  };

  const onNextHandler = () => {
    if (Number(inputValue) > currentFee) {
      setCurrentFlowStep(FeeUpdateSteps.INCREASE);
    } else {
      setCurrentFlowStep(FeeUpdateSteps.DECREASE);
    }
  };

  const components = {
    [FeeUpdateSteps.START]: ChangeFee,
    [FeeUpdateSteps.INCREASE]: IncreaseFlow,
    [FeeUpdateSteps.DECREASE]: DecreaseFlow,
  };
  const Component = components[currentFlowStep];

  return (
      <Grid container item>
        <WhiteWrapper header={'Update Operator Fee'}>
          <OperatorId id={id}/>
        </WhiteWrapper>
        <Grid className={classes.BodyWrapper}>
          <Component onNextHandler={onNextHandler} inputValue={inputValue} onChangeHandler={onInputChange} error={error} nextIsDisabled={nextIsDisabled}/>
          <CancelUpdateFee/>
        </Grid>
      </Grid>
  );
};

export default observer(UpdateFee);
