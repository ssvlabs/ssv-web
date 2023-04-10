import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import NaDisplay from '~app/components/common/NaDisplay';
import Tooltip from '~app/components/common/ToolTip/ToolTip';
import ProgressBar from '~app/components/applications/SSV/MyAccount/common/ProgressBar/ProgressBar';
import { useStyles } from '~app/components/applications/SSV/MyAccount/common/NewRemainingDays/NewRemainingDays.styles';
import LiquidationStateError from '~app/components/applications/SSV/MyAccount/common/LiquidationStateError/LiquidationStateError';

type Props = {
  cluster: any,
  withdrawState?: boolean,
};

const NewRemainingDays = (props: Props) => {
  const stores = useStores();
  stores;
  const { cluster, withdrawState } = props;

  const clusterRunWay = cluster.newRunWay ?? cluster.runWay;

  let remainingDays: number = clusterRunWay;
  let warningLiquidationState: boolean = clusterRunWay < 30;

  const classes = useStyles({ warningLiquidationState, withdrawState });

    return (
      <Grid item container>
        <Grid item container>
          <Grid item container xs={12}>
            <Typography className={classes.AmountOfDaysText}>Est. Operational Runway</Typography>
            <Grid className={classes.Hint}>
              <Tooltip text={'Estimated amount of days the cluster balance is sufficient to run all it’s validators.'} />
            </Grid>
          </Grid>
          {remainingDays || cluster.isLiquidated ? (
              <>
                <Typography className={classes.AmountOfDays}>{formatNumberToUi(remainingDays, true)}</Typography>
                <Typography className={classes.Days}>days</Typography>
              </>)
              :
              (<NaDisplay size={24} />)}
          {cluster.newRunWay !== undefined && (
              <Grid item xs className={classes.NewDaysEstimation}>
                {`(${withdrawState ? '' : '+'}${formatNumberToUi(cluster.newRunWay - cluster.runWay, true)} days)`}
              </Grid>
          )}
          {warningLiquidationState && !cluster.isLiquidated && (
            <Grid container>
              <ProgressBar remainingDays={remainingDays ?? 0} />
              <LiquidationStateError marginTop={'16px'} errorType={remainingDays === 0 ? 3 : 1} />
            </Grid>
          )}
        </Grid>
      </Grid>
    );
};

export default observer(NewRemainingDays);
