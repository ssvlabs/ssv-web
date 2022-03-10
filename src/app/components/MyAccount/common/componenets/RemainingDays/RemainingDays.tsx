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
    withdraw?: boolean,
    newRemainingDays?: string
};

const RemainingDays = (props: Props) => {
    const stores = useStores();
    const { withdraw, newRemainingDays } = props;
    const ssvStore: SsvStore = stores.SSV;
    const remainingDays = newRemainingDays ? ssvStore.getRemainingDays(ssvStore.networkContractBalance + Number(newRemainingDays)) : ssvStore.getRemainingDays();
    const warningState = remainingDays < 30;
    const classes = useStyles({ warning: warningState, withdraw });

    function conditionalErrorType() {
        if (newRemainingDays && Math.floor(remainingDays) === 0) return 3;
        return newRemainingDays ? 1 : 0;
    }
    React.useEffect(() => {}, [ssvStore.networkContractBalance]);

    return (
      <Grid item container>
        <Grid item container>
          <Grid item container xs={12}>
            <Typography className={classes.AmountOfDaysText}>Est. Remaining Days</Typography>
            <Typography className={classes.Hint}>
              <Tooltip text={'need to implement'} />
            </Typography>
          </Grid>
          <Typography className={classes.AmountOfDays}>{formatNumberToUi(remainingDays, true)}</Typography>
          <Typography className={classes.Days}>
            days
          </Typography>
          {newRemainingDays && <Grid item xs className={classes.NewDaysEstimation}>{`(${newRemainingDays})`}</Grid>}
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
