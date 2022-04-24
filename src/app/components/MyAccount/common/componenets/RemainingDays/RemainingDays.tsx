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
    operator?: string,
    withdraw?: boolean,
    newRemainingDays?: number,
};

const math_it_up = {
    // eslint-disable-next-line func-names
    '+': function (x: any, y: any) {
        return x + y;
    },
    // eslint-disable-next-line func-names
    '-': function (x: number, y: number) {
        return x - y;
    },
};

const RemainingDays = (props: Props) => {
    const stores = useStores();
    const { gray80, withdraw, newRemainingDays, operator } = props;
    const ssvStore: SsvStore = stores.SSV;
    const presentNewEstimation = Number(newRemainingDays) > 0;
    // @ts-ignore
    const remainingDays = operator ? ssvStore.getRemainingDays(math_it_up[operator](ssvStore.contractDepositSsvBalance, newRemainingDays)) : ssvStore.getRemainingDays();
    const warningState = remainingDays < 30;
    const classes = useStyles({ warning: warningState, withdraw, gray80 });

    function conditionalErrorType() {
        if (newRemainingDays && Math.floor(remainingDays) === 0) return 3;
        return newRemainingDays ? 1 : 0;
    }
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
          <Typography className={classes.AmountOfDays}>{formatNumberToUi(remainingDays, true)}</Typography>
          <Typography className={classes.Days}>
            days
          </Typography>
          {presentNewEstimation && (
            <Grid item xs
              className={classes.NewDaysEstimation}>{`(${operator ?? ''}${formatNumberToUi(newRemainingDays, true)})`}
            </Grid>
          )}
          {warningState && (
            <Grid container>
              <ProgressBar remainingDays={remainingDays} />
              <LiquidationStateError marginTop={'16px'} errorType={conditionalErrorType()} />
            </Grid>
          )}
        </Grid>
      </Grid>
    );
};

export default observer(RemainingDays);
