import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Tooltip from '~app/common/components/ToolTip/ToolTip';
import { formatNumberToUi } from '~lib/utils/numbers';
import { useStores } from '~app/hooks/useStores';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import ProgressBar from '~app/components/MyAccount/common/componenets/ProgressBar/ProgressBar';
import { useStyles } from '~app/components/MyAccount/common/componenets/RemainingDays/RemainingDays.styles';
import LiquidationStateError from '~app/components/MyAccount/common/componenets/LiquidationStateError/LiquidationStateError';

type Props = {
    gray80?: boolean,
    newBalance?: number,
    newBurnRate?: number,
    disableWarning?: boolean,
    operatorChange?: boolean,
};

const RemainingDays = (props: Props) => {
    const stores = useStores();
    const ssvStore: SsvStore = stores.SSV;
    const { gray80, newBalance, newBurnRate, operatorChange, disableWarning = false } = props;

    const oldRemainingDays = ssvStore.getRemainingDays({});
    let withdrawState: boolean = false;
    let newRemainingDays: number | undefined;
    let warningLiquidationState: boolean = oldRemainingDays < 30;

    if (typeof newBalance !== 'undefined' || typeof newBurnRate !== 'undefined') {
        newRemainingDays = ssvStore.getRemainingDays({ newBalance, newBurnRate });
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

    React.useEffect(() => {}, [ssvStore.contractDepositSsvBalance]);

    return (
      <Grid item container>
        <Grid item container>
          <Grid item container xs={12}>
            <Typography className={classes.AmountOfDaysText}>Est. Remaining Days</Typography>
            <Grid className={classes.Hint}>
              <Tooltip text={'need to implement'} />
            </Grid>
          </Grid>
          <Typography className={classes.AmountOfDays}>{formatNumberToUi(newRemainingDays ?? oldRemainingDays, true)}</Typography>
          <Typography className={classes.Days}>
            days
          </Typography>
          {newRemainingDays !== undefined && newRemainingDays - oldRemainingDays !== 0 && (
            <Grid item xs
              className={classes.NewDaysEstimation}>{`(${!withdrawState ? '+' : ''}${formatNumberToUi(newRemainingDays - oldRemainingDays, true)})`}
            </Grid>
          )}
          {!disableWarning && warningLiquidationState && (
            <Grid container>
              <ProgressBar remainingDays={newRemainingDays ?? 0} />
              <LiquidationStateError marginTop={'16px'} errorType={conditionalErrorType()} />
            </Grid>
          )}
        </Grid>
      </Grid>
    );
};

export default observer(RemainingDays);
