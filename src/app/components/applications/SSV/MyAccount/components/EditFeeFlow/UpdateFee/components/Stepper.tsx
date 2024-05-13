
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStores } from '~app/hooks/useStores';
import { UPDATE_FEE_STEPS } from '~lib/utils/updateFeeNotificationSteps';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/index.styles';

type StepperProps = {
    step: number,
    subText?: string,
    subTextAlign: string,
    registerButtonEnabled?: boolean
};

// eslint-disable-next-line no-unused-vars
enum StepperProcessesSteps {
    // eslint-disable-next-line no-unused-vars
    DECLARE_STEP = 0,
    // eslint-disable-next-line no-unused-vars
    WAITING_STEP = 1,
    // eslint-disable-next-line no-unused-vars
    PENDING_STEP = 2,
}

const ReactStepper = ({ step, registerButtonEnabled, subTextAlign, subText }: StepperProps) => {
    const stores = useStores();
    const operatorStore: OperatorStore = stores.Operator;
    const classes = useStyles({ step, registerButtonEnabled, subTextAlign });
    // @ts-ignore
    const time = (operatorStore.operatorApprovalBeginTime - operatorStore?.declaredOperatorFeePeriod) * 1000;
    const declareFeeDate = new Date(time);
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
    };


    const getStepNumber = (currentStep: number, currentPosition: number) => currentStep === currentPosition - 1 || currentStep >= currentPosition ? '' : currentPosition;

    return (
      <Grid item container className={classes.Stepper}>
        <Grid item container className={classes.ProgressBarWrapper}>
          <Grid item className={classes.StepWrapper}>{getStepNumber(step, UPDATE_FEE_STEPS.DECLARE_FEE)}</Grid>
          <Grid item className={classes.Line} />
          <Grid item className={classes.StepWrapper}>{getStepNumber(step, UPDATE_FEE_STEPS.WAITING)}</Grid>
          <Grid item className={classes.Line} />
          <Grid item className={classes.StepWrapper}>{getStepNumber(step, UPDATE_FEE_STEPS.PENDING)}</Grid>
          <Grid item className={classes.Line} />
          <Grid item className={classes.StepWrapper}>{getStepNumber(step, UPDATE_FEE_STEPS.EXECUTE)}</Grid>
        </Grid>
        <Grid item container className={classes.ProgressBarTextWrapper}>
          <Grid className={classes.ProgressBarText}>
            Declare Fee
              <Typography className={classes.DeclaredFee}>
                {step === StepperProcessesSteps.DECLARE_STEP ? subText : declareFeeDate.toLocaleString('en-US', options)}
              </Typography>
          </Grid>
          <Grid className={classes.ProgressBarText}>
            Waiting Period
            {step === StepperProcessesSteps.WAITING_STEP && (
            <Typography className={classes.WaitingPeriod}>
                {subText}
            </Typography>
            )}
          </Grid>
          <Grid className={classes.ProgressBarText}>
            Pending Execution
            {step === StepperProcessesSteps.PENDING_STEP && (
            <Typography className={classes.ExpiresIn}>
                {subText}
            </Typography>
            )}
          </Grid>
          <Grid className={classes.ProgressBarText}>Fee Updated</Grid>
        </Grid>
      </Grid>
    );
};

export default observer(ReactStepper);