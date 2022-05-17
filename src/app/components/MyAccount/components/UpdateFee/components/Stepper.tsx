import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useStyles } from './index.styles';
import Typography from '@material-ui/core/Typography';

const ReactStepper = ({ step }:{ step: number }) => {
    const classes = useStyles({ step });
    const steps = ['Declare Fee', 'Waiting Period', 'Pending Execution', 'Fee Updated'];
    step;
    steps;
    classes;

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
            <Typography className={classes.ProgressBarText}>
              21 Mar, 18:55
            </Typography>
          </Grid>
          <Grid className={classes.ProgressBarText}>
            Waiting Period
            {step === 1 && (
            <Typography className={classes.WaitingPeriod}>
              1 day 2 hrs left
            </Typography>
            )}
          </Grid>
          <Grid className={classes.ProgressBarText}>
            Pending Execution
            {step === 2 && (
            <Typography className={classes.ExpiresIn}>
              Expires in ~ 2 days 5 hrs
            </Typography>
            )}
          </Grid>
          <Grid className={classes.ProgressBarText}>Fee Updated</Grid>
        </Grid>
      </Grid>
    );
};

export default observer(ReactStepper);