import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from './NewRemainingDays.styles';
import { formatNumberToUi } from '~lib/utils/numbers';
import Tooltip from '~app/components/common/ToolTip/ToolTip';
import ProgressBar from '~app/components/applications/SSV/MyAccount/common/componenets/ProgressBar/ProgressBar';
import LiquidationStateError from '~app/components/applications/SSV/MyAccount/common/componenets/LiquidationStateError/LiquidationStateError';

type Props = {
  cluster: any,
};

const NewRemainingDays = (props: Props) => {
  const stores = useStores();
  stores;
  const { cluster } = props;

  let withdrawState: boolean = false;
  let remainingDays: number = cluster.runWay;
  let warningLiquidationState: boolean = cluster.runWay < 30;

  const classes = useStyles({ warningLiquidationState, withdrawState });
    

    return (
      <Grid item container>
        <Grid item container>
          <Grid item container xs={12}>
            <Typography className={classes.AmountOfDaysText}>Est. Remaining Days</Typography>
            <Grid className={classes.Hint}>
              <Tooltip text={'Estimated amount of days the account balance is sufficient to run all it’s validators.'} />
            </Grid>
          </Grid>
          <Typography className={classes.AmountOfDays}>{formatNumberToUi(remainingDays, true)}</Typography>
          <Typography className={classes.Days}>
            days
          </Typography>
          {warningLiquidationState && (
            <Grid container>
              <ProgressBar remainingDays={remainingDays ?? 0} />
              <LiquidationStateError marginTop={'16px'} errorType={1} />
            </Grid>
          )}
        </Grid>
      </Grid>
    );
};

export default observer(NewRemainingDays);
