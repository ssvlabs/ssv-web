import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import Tooltip from '~app/components/common/ToolTip/ToolTip';
import ProgressBar from '~app/components/applications/SSV/MyAccount/common/ProgressBar/ProgressBar';
import { useStyles } from '~app/components/applications/SSV/MyAccount/common/RemainingDays/RemainingDays.styles';
import LiquidationStateError
  from '~app/components/applications/SSV/MyAccount/common/LiquidationStateError/LiquidationStateError';
import { toWei } from '~root/services/conversions.service';
import { getClusterRunWay } from '~root/services/cluster.service';
import { SsvStore } from '~app/common/stores/applications/SsvWeb';

type Props = {
  cluster?: any,
  gray80?: boolean,
  newBalance?: any,
  newBurnRate?: any,
  disableWarning?: boolean,
  operatorChange?: boolean,
};

const RemainingDays = (props: Props) => {
  const stores = useStores();
  const { cluster, gray80, operatorChange, disableWarning = false } = props;
  const ssvStore: SsvStore = stores.SSV;
  let withdrawState: boolean = false;
  let newRemainingDays: number | undefined;
  let warningLiquidationState: boolean = cluster.runWay < 30;

  if (typeof cluster.newBalance !== 'undefined' || typeof cluster.newBurnRate !== 'undefined') {
    newRemainingDays = getClusterRunWay({ ...cluster, balance: toWei(cluster.newBalance) }, ssvStore.liquidationCollateralPeriod, ssvStore.minimumLiquidationCollateral);
    withdrawState = cluster.runWay > newRemainingDays;
    warningLiquidationState = newRemainingDays < 30;
  }

  // @ts-ignore
  const classes = useStyles({ warningLiquidationState, withdrawState, gray80 });

  const conditionalErrorType = () => {
    if (operatorChange && newRemainingDays === 0) {
      return 5;
    }
    if (operatorChange && newRemainingDays) {
      return 4;
    }
    if (newRemainingDays === 0) return 3;
    return newRemainingDays ? 1 : 0;
  };

  React.useEffect(() => {
  }, [cluster.balance]);

  return (
      <Grid item container>
        <Grid item container>
          <Grid item container xs={12}>
            <Typography className={classes.AmountOfDaysText}>Est. Operational Runway</Typography>
            <Grid className={classes.Hint}>
              <Tooltip text={'Estimated amount of days the cluster balance is sufficient to run all it’s validators.'}/>
            </Grid>
          </Grid>
          <Typography
              className={classes.AmountOfDays}>{formatNumberToUi(newRemainingDays ?? cluster.runWay, true)}</Typography>
          <Typography className={classes.Days}>
            days
          </Typography>
          {newRemainingDays !== undefined && newRemainingDays !== cluster.runWay && (
              <Grid item xs
                    className={classes.NewDaysEstimation}>{`(${!withdrawState ? '+' : ''}${formatNumberToUi(newRemainingDays - cluster.runWay, true)} days)`}
              </Grid>
          )}
          {!disableWarning && warningLiquidationState && (
              <Grid container>
                <ProgressBar remainingDays={newRemainingDays ?? 0}/>
                <LiquidationStateError marginTop={'16px'} errorType={conditionalErrorType()}/>
              </Grid>
          )}
        </Grid>
      </Grid>
  );
};

export default observer(RemainingDays);
