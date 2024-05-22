import { Grid } from '~app/atomicComponents';
import Typography from '@mui/material/Typography';
import { UPDATE_FEE_STEPS } from '~lib/utils/updateFeeNotificationSteps';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/index.styles';
import { useAppSelector } from '~app/hooks/redux.hook.ts';
import { getFeeIncreaseAndPeriods, getOperatorFeeData } from '~app/redux/operator.slice.ts';

type StepperProps = {
  step: number;
  subText?: string;
  subTextAlign: string;
  registerButtonEnabled?: boolean;
};

enum StepperProcessesSteps {
  DECLARE_STEP = 0,
  WAITING_STEP = 1,
  PENDING_STEP = 2
}

const ReactStepper = ({ step, registerButtonEnabled, subTextAlign, subText }: StepperProps) => {
  const classes = useStyles({ step, registerButtonEnabled, subTextAlign });
  const operatorFeeData = useAppSelector(getOperatorFeeData);
  const feeIncreaseAndPeriods = useAppSelector(getFeeIncreaseAndPeriods);

  const time = (operatorFeeData.operatorApprovalBeginTime - feeIncreaseAndPeriods.declaredOperatorFeePeriod) * 1000;
  const declareFeeDate = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short'
  };

  const getStepNumber = (currentStep: number, currentPosition: number) => (currentStep === currentPosition - 1 || currentStep >= currentPosition ? '' : currentPosition);

  return (
    <Grid item container className={classes.Stepper}>
      <Grid item container className={classes.ProgressBarWrapper}>
        <Grid item className={classes.StepWrapper}>
          {getStepNumber(step, UPDATE_FEE_STEPS.DECLARE_FEE)}
        </Grid>
        <Grid item className={classes.Line} />
        <Grid item className={classes.StepWrapper}>
          {getStepNumber(step, UPDATE_FEE_STEPS.WAITING)}
        </Grid>
        <Grid item className={classes.Line} />
        <Grid item className={classes.StepWrapper}>
          {getStepNumber(step, UPDATE_FEE_STEPS.PENDING)}
        </Grid>
        <Grid item className={classes.Line} />
        <Grid item className={classes.StepWrapper}>
          {getStepNumber(step, UPDATE_FEE_STEPS.EXECUTE)}
        </Grid>
      </Grid>
      <Grid item container className={classes.ProgressBarTextWrapper}>
        <Grid className={classes.ProgressBarText}>
          Declare Fee
          <Typography className={classes.DeclaredFee}>{step === StepperProcessesSteps.DECLARE_STEP ? subText : declareFeeDate.toLocaleString('en-US', options)}</Typography>
        </Grid>
        <Grid className={classes.ProgressBarText}>
          Waiting Period
          {step === StepperProcessesSteps.WAITING_STEP && <Typography className={classes.WaitingPeriod}>{subText}</Typography>}
        </Grid>
        <Grid className={classes.ProgressBarText}>
          Pending Execution
          {step === StepperProcessesSteps.PENDING_STEP && <Typography className={classes.ExpiresIn}>{subText}</Typography>}
        </Grid>
        <Grid className={classes.ProgressBarText}>Fee Updated</Grid>
      </Grid>
    </Grid>
  );
};

export default ReactStepper;
