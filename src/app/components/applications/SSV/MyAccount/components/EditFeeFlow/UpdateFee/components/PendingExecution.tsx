import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { IncreaseFlowProps } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/IncreaseFlow';
import ReactStepper from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/Stepper';
import { StepperSteps, useStyles } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/index.styles';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { getIsContractWallet } from '~app/redux/wallet.slice';
import { ButtonSize } from '~app/enums/Button.enum';
import { PrimaryButton, SecondaryButton } from '~app/atomicComponents';
import BorderScreen from '~app/components/common/BorderScreen';
import { timeDiffCalc } from '~lib/utils/time';
import ChangeFeeDisplayValues from '~app/components/common/FeeUpdateTo/ChangeFeeDisplayValues';
import { approveOperatorFee } from '~root/services/operatorContract.service.ts';
import { getOperatorFeeData } from '~app/redux/operator.slice.ts';
import { getSelectedOperator } from '~app/redux/account.slice.ts';

const PendingExecution = ({ oldFee, newFee, currentCurrency, getCurrentState, cancelUpdateFee }: IncreaseFlowProps) => {
  const classes = useStyles({ step: StepperSteps.EXECUTION });
  const [isLoading, setIsLoading] = useState(false);
  const operator = useAppSelector(getSelectedOperator)!;
  const isContractWallet = useAppSelector(getIsContractWallet);
  const dispatch = useAppDispatch();
  const operatorFeeData = useAppSelector(getOperatorFeeData);

  const submitFeeChange = async () => {
    setIsLoading(true);
    const response = await approveOperatorFee({ operator, isContractWallet, dispatch });
    if (response) {
      getCurrentState(true);
    }
    setIsLoading(false);
  };

  const operatorEndApprovalTime = new Date(Number(operatorFeeData.operatorApprovalEndTime) * 1000);
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
          <ReactStepper step={StepperSteps.EXECUTION} subTextAlign={'center'} subText={`Expires in ~ ${timeDiffCalc(today, operatorEndApprovalTime)}`} />
          <Grid item container className={classes.TextWrapper}>
            <Grid item>
              <Typography>Execute your new fee in order to finalize the fee update process.</Typography>
            </Grid>
          </Grid>
          <Grid item container className={classes.FeesChangeWrapper}>
            <ChangeFeeDisplayValues currentCurrency={currentCurrency} newFee={newFee} oldFee={oldFee} />
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
              <SecondaryButton text={'Cancel'} onClick={cancelUpdateFee} size={ButtonSize.XL} />
            </Grid>
            <Grid item xs>
              <PrimaryButton isDisabled={false} text={'Execute'} onClick={submitFeeChange} isLoading={isLoading} size={ButtonSize.XL} />
            </Grid>
          </Grid>
        </Grid>
      ]}
    />
  );
};

export default PendingExecution;
