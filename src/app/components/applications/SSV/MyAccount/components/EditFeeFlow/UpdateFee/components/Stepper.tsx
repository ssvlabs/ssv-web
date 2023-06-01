import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/index.styles';

type StepperProps = {
    step: number,
    subText?: string,
    subTextAlign: string,
    registerButtonEnabled?: boolean
};

const ReactStepper = ({ step, registerButtonEnabled, subTextAlign, subText }: StepperProps) => {
    const classes = useStyles({ step, registerButtonEnabled, subTextAlign });

    const getStepNumber = (currentStep: number, currentPosition: number) => currentStep === currentPosition - 1 || currentStep >= currentPosition ? '' : currentPosition;

    return (
      <Grid item container className={classes.Stepper}>
        <Grid item container className={classes.ProgressBarWrapper}>
          <Grid item className={classes.StepWrapper}>{getStepNumber(step, 1)}</Grid>
          <Grid item className={classes.Line} />
          <Grid item className={classes.StepWrapper}>{getStepNumber(step, 2)}</Grid>
          <Grid item className={classes.Line} />
          <Grid item className={classes.StepWrapper}>{getStepNumber(step, 3)}</Grid>
          <Grid item className={classes.Line} />
          <Grid item className={classes.StepWrapper}>{getStepNumber(step, 4)}</Grid>
        </Grid>
        <Grid item container className={classes.ProgressBarTextWrapper}>
          <Grid className={classes.ProgressBarText}>
            Declare Fee
            {registerButtonEnabled && (
              <Typography className={classes.ProgressBarText}>
                {subText}
              </Typography>
              )}
          </Grid>
          <Grid className={classes.ProgressBarText}>
            Waiting Period
            {step === 1 && (
            <Typography className={classes.WaitingPeriod}>
                {subText}
            </Typography>
            )}
          </Grid>
          <Grid className={classes.ProgressBarText}>
            Pending Execution
            {step === 2 && (
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