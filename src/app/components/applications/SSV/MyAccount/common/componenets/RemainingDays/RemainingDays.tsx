import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import Tooltip from '~app/components/common/ToolTip/ToolTip';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import ClusterStore from '~app/common/stores/applications/SsvWeb/Cluster.store';
import ProgressBar from '~app/components/applications/SSV/MyAccount/common/componenets/ProgressBar/ProgressBar';
import { useStyles } from '~app/components/applications/SSV/MyAccount/common/componenets/RemainingDays/RemainingDays.styles';
import LiquidationStateError
  from '~app/components/applications/SSV/MyAccount/common/componenets/LiquidationStateError/LiquidationStateError';

type Props = {
  cluster?: any,
  gray80?: boolean,
  newBalance?: number,
  newBurnRate?: number,
  disableWarning?: boolean,
  operatorChange?: boolean,
};

const RemainingDays = (props: Props) => {
  const stores = useStores();
  const ssvStore: SsvStore = stores.SSV;
  const walletStore: WalletStore = stores.Wallet;
  const clusterStore: ClusterStore = stores.Cluster;
  const { gray80, newBalance, cluster, newBurnRate, operatorChange, disableWarning = false } = props;

  const oldRemainingDays = ssvStore.getRemainingDays({});
  let withdrawState: boolean = false;
  let newRemainingDays: number | undefined;
  let warningLiquidationState: boolean = oldRemainingDays < 30;

  if (typeof newBalance !== 'undefined' || typeof newBurnRate !== 'undefined') {
    newRemainingDays = clusterStore.getClusterRunWay({ ...cluster, balance: walletStore.toWei(newBalance) });
    withdrawState = oldRemainingDays > newRemainingDays;
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
  }, [ssvStore.contractDepositSsvBalance]);

  return (
      <Grid item container>
        <Grid item container>
          <Grid item container xs={12}>
            <Typography className={classes.AmountOfDaysText}>Est. Remaining Days</Typography>
            <Grid className={classes.Hint}>
              <Tooltip text={'Estimated amount of days the account balance is sufficient to run all it’s validators.'}/>
            </Grid>
          </Grid>
          <Typography
              className={classes.AmountOfDays}>{formatNumberToUi(newRemainingDays ?? oldRemainingDays, true)}</Typography>
          <Typography className={classes.Days}>
            days
          </Typography>
          {newRemainingDays !== undefined && newRemainingDays !== oldRemainingDays && (
              <Grid item xs
                    className={classes.NewDaysEstimation}>{`(${!withdrawState ? '+' : ''}${formatNumberToUi(newRemainingDays - oldRemainingDays, true)} days)`}
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
