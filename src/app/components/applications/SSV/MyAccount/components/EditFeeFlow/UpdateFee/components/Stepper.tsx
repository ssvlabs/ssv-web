import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStores } from '~app/hooks/useStores';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/index.styles';

type Props = {
    step: number,
    subText?: string,
    subTextAlign: string,
    registerButtonEnabled?: boolean
};

const ReactStepper = (props: Props) => {
    const stores = useStores();
    const operatorStore: OperatorStore = stores.Operator;
    const { step, registerButtonEnabled, subTextAlign, subText } = props;
    const classes = useStyles({ step, registerButtonEnabled, subTextAlign });
    // @ts-ignore
    const time = (operatorStore.operatorApprovalBeginTime - operatorStore?.declaredOperatorFeePeriod) * 1000;
    const declareFeeDate = new Date(time);
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric',
    };

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
                {step === 0 ? subText : declareFeeDate.toLocaleString('en-US', options)}
              </Typography>
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