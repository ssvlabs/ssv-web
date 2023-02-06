import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStyles } from './index.styles';

type Props = {
    step: number,
    subText?: string,
    subTextAlign: string,
    registerButtonEnabled?: boolean
};

const ReactStepper = (props: Props) => {
    const { step, registerButtonEnabled, subTextAlign, subText } = props;
    const classes = useStyles({ step, registerButtonEnabled, subTextAlign });

    return (
      <Grid item container className={classes.Stepper}>
        <Grid item container className={classes.ProgressBarWrapper}>
          <Grid item className={classes.StepWrapper} />
          <Grid item className={classes.Line} />
          <Grid item className={classes.StepWrapper} />
          <Grid item className={classes.Line} />
          <Grid item className={classes.StepWrapper} />
          <Grid item className={classes.Line} />
          <Grid item className={classes.StepWrapper} />
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