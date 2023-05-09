import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
// import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import WhiteWrapper from '~app/components/common/WhiteWrapper';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import OperatorId from '~app/components/applications/SSV/MyAccount/components/OperatorId';
import CancelUpdateFee
  from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/CancelUpdateFee';
import {
  useStyles,
} from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/UpdateFee.styles';
// import FeeChange
//   from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/FeeChange';
import BorderScreen from '~app/components/common/BorderScreen';
import Typography from '@mui/material/Typography';
import ConversionInput from '~app/components/common/ConversionInput/ConversionInput';
import PrimaryButton from '~app/components/common/Button/PrimaryButton/PrimaryButton';
// import Typography from "@mui/material/Typography";
// import ReactStepper
//   from "~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/Stepper";
// import TextInput from "~app/components/common/TextInput";
// import {validateFeeUpdate} from "~lib/utils/validatesInputs";
// import PrimaryButton from "~app/components/common/Button/PrimaryButton/PrimaryButton";
// import BorderScreen from '~app/components/common/BorderScreen';
// import Typography from '@mui/material/Typography';
// import ConversionInput from '~app/components/common/ConversionInput/ConversionInput';
// import PrimaryButton from '~app/components/common/Button/PrimaryButton/PrimaryButton';
// import DeclareFee
//   from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/DeclareFee';
// import FeeUpdated
//   from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/FeeUpdated';
// import WaitingPeriod
//   from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/WaitingPeriod';
// import PendingExpired
//   from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/PendingExpired';
// import PendingExecution
//   from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/PendingExecution';
// import { formatNumberToUi } from '~lib/utils/numbers';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import { formatNumberToUi } from '~lib/utils/numbers';
// import {validateFeeUpdate} from "~lib/utils/validatesInputs";

const UpdateFee = () => {
  const stores = useStores();
  const navigate = useNavigate();
  const operatorStore: OperatorStore = stores.Operator;
  const walletStore: WalletStore = stores.Wallet;
  const ssvStore: SsvStore = stores.SSV;
  const [operator, setOperator] = useState<any>(null);
  const applicationStore: ApplicationStore = stores.Application;
    console.log(stores);
  const [inputValue, setInputValue] = useState<any>('');

  useEffect(() => {
    console.log(operatorStore.processOperatorId);
    if (!operatorStore.processOperatorId) return navigate(applicationStore.strategyRedirect);
    applicationStore.setIsLoading(true);
    Operator.getInstance().getOperator(operatorStore.processOperatorId).then(async (response: any) => {
      if (response) {
        setOperator(response);
        setInputValue(formatNumberToUi(ssvStore.getFeeForYear(walletStore.fromWei(response.fee))));
        await getCurrentState();
      }
      applicationStore.setIsLoading(false);
    });
  }, []);

  // useEffect(() => setInputValue(ssvStore.getFeeForYear(walletStore.fromWei(operator?.fee))), [operator]);

  const getCurrentState = async () => {
    console.log('in func');
    // navigate(ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.START);
    // console.log('in get current');
    // // @ts-ignore
    // await operatorStore.getOperatorFeeInfo(operatorStore.processOperatorId);
    // console.log(operatorStore.operatorApprovalBeginTime);
    // console.log(operatorStore.operatorApprovalEndTime);
    // console.log(operatorStore.operatorFutureFee);
    // console.log(operatorStore);
    // navigate(ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.START);
    // if (operatorStore.operatorApprovalBeginTime && operatorStore.operatorApprovalEndTime && operatorStore.operatorFutureFee) {
    //   console.log('if');
    //   const todayDate = new Date();
    //   const endPendingStateTime = new Date(operatorStore.operatorApprovalEndTime * 1000);
    //   const startPendingStateTime = new Date(operatorStore.operatorApprovalBeginTime * 1000);
    //   const isInPendingState = todayDate >= startPendingStateTime && todayDate < endPendingStateTime;
    //
    //   // @ts-ignore
    //   const daysFromEndPendingStateTime = Math.ceil(Math.abs(todayDate - endPendingStateTime) / (1000 * 3600 * 24));
    //
    //   if (isInPendingState) {
    //     navigate(ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.PENDING);
    //   } else if (startPendingStateTime > todayDate) {
    //     navigate(ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.UPDATE);
    //   } else if (todayDate > endPendingStateTime && daysFromEndPendingStateTime <= 3) {
    //     // @ts-ignore
    //     const savedOperator = JSON.parse(localStorage.getItem('expired_operators'));
    //     if (savedOperator && savedOperator?.includes(operatorStore.processOperatorId)) {
    //       navigate(ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.START);
    //     } else {
    //       navigate(ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.EXPIRED);
    //     }
    //   }
    // }
  };

  // @ts-ignore
  const { logo, id } = operator || {};
  const classes = useStyles({ operatorLogo: logo });
  const [error] = useState({ shouldDisplay: false, errorMessage: '' });
  // validateFeeUpdate(operatorFee, e.target.value, operatorStore.maxFeeIncrease, setError);
  if (!operator) return null;
    console.log(operator);
  return (
      <Grid container item>
        <WhiteWrapper header={'Update Operator Fee'}>
          <OperatorId id={id}/>
        </WhiteWrapper>
        <Grid className={classes.BodyWrapper}>
          <BorderScreen
              blackHeader
              withoutNavigation
              header={'Update Fee'}
              withoutBorderBottom={true}
              body={[
                (<Typography fontSize={16}>Enter your new operator annual fee.</Typography>),
                <ConversionInput value={inputValue}/>,
                <Typography >{error.errorMessage}</Typography>,
                <PrimaryButton  text={'Next'}
                                submitFunction={() => null}/>,
              ]}
          />
          <CancelUpdateFee/>
        </Grid>
      </Grid>
  );
};

export default observer(UpdateFee);
