import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { timeDiffCalc } from '~lib/utils/time';
import { useStores } from '~app/hooks/useStores';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ChangeFeeDisplayValues from '~app/components/common/FeeUpdateTo/ChangeFeeDisplayValues';
import ReactStepper from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/Stepper';
import { IncreaseFlowProps } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/IncreaseFlow';
import { useStyles, StepperSteps } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/index.styles';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { setIsLoading } from '~app/redux/appState.slice';
import { getIsContractWallet } from '~app/redux/wallet.slice';

const PendingExecution = ({ oldFee, newFee, currentCurrency, getCurrentState, cancelUpdateFee }: IncreaseFlowProps) => {
  const stores = useStores();
  const classes = useStyles({ step: StepperSteps.EXECUTION });
  const operatorStore: OperatorStore = stores.Operator;
  const dispatch = useAppDispatch();
  const isContractWallet = useAppSelector(getIsContractWallet);

  const submitFeeChange = async () => {
    dispatch(setIsLoading(true));
    const response = await operatorStore.approveOperatorFee(Number(operatorStore.processOperatorId), isContractWallet);
    if (response) {
        getCurrentState(true);
    }
    dispatch(setIsLoading(false));
  };

  const operatorEndApprovalTime = new Date(Number(operatorStore.operatorApprovalEndTime) * 1000);
  const today = new Date();

  return (
    <BorderScreen
      blackHeader
      withoutNavigation
      body={[
        <Grid container item>
          <Grid container item className={classes.HeaderWrapper}>
            <Grid item>
              <Typography className={classes.Title}>Update Fee</Typography>
            </Grid>
            <Grid item className={classes.Step}>
              Execute
            </Grid>
          </Grid>
          <ReactStepper step={StepperSteps.EXECUTION} subTextAlign={'center'}
                        subText={`Expires in ~ ${timeDiffCalc(today, operatorEndApprovalTime)}`} />
          <Grid item container className={classes.TextWrapper}>
            <Grid item>
              <Typography>Execute your new fee in order to finalize the fee update process.</Typography>
            </Grid>
          </Grid>
          <Grid item container className={classes.FeesChangeWrapper}>
            <ChangeFeeDisplayValues currentCurrency={currentCurrency} newFee={newFee} oldFee={oldFee}/>
          </Grid>
          <Grid item className={classes.Notice}>
            <Grid item className={classes.BulletsWrapper}>
              <ul>
                <li>You can always cancel your declared fee (your managed validators will be notified accordingly).</li>
              </ul>
            </Grid>
          </Grid>
          <Grid item container className={classes.ButtonsWrapper}>
            <Grid item xs>
              <SecondaryButton withoutLoader className={classes.CancelButton} disable={false} children={'Cancel'}
                               submitFunction={cancelUpdateFee} />
            </Grid>
            <Grid item xs>
              <PrimaryButton withoutLoader={operatorStore.openCancelDialog} disable={false} children={'Execute'}
                submitFunction={submitFeeChange} />
            </Grid>
          </Grid>
        </Grid>,
      ]}
    />
  );
};

export default observer(PendingExecution);
