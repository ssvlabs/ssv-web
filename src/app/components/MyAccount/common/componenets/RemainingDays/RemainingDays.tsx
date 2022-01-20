import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useStores } from '~app/hooks/useStores';
import SsvStore from '~app/common/stores/SSV.store';
import { formatNumberToUi } from '~lib/utils/numbers';
import Tooltip from '~app/common/components/ToolTip/ToolTip';
import ProgressBar from '~app/components/MyAccount/common/componenets/ProgressBar';
import ErrorText from '~app/components/MyAccount/common/componenets/ErrorText/ErrorText';
import { useStyles } from '~app/components/MyAccount/common/componenets/RemainingDays/RemainingDays.styles';

type Props = {
    fromPage?: string,
    inputValue?: number,
    wrapperClass?: any,
};

const RemainingDays = (props: Props) => {
    const { fromPage, wrapperClass } = props;
    let { inputValue } = props;
    if (inputValue) {
        inputValue = parseFloat(inputValue.toString().replace('-', ''));
    }
    const stores = useStores();
    const classes = useStyles();
    const ssvStore: SsvStore = stores.SSV;
    const fromWithdraw = fromPage === 'withdraw';
    const newRemainingDays: any = ssvStore.getNewRemainingDays(inputValue);
    let currentRemainingDays: number;
    if (fromPage === 'withdraw') {
        currentRemainingDays = ssvStore.getRemainingDays - newRemainingDays;
    } else {
        currentRemainingDays = ssvStore.getRemainingDays + newRemainingDays;
    }

    const liquidationError = currentRemainingDays < 30;
    const operatorSign = fromWithdraw ? '-' : '+';

    const errorMessageHandler = () => {
        if (ssvStore.networkContractBalance === 0) {
            return 2;
        }
        if (currentRemainingDays === 0) {
            return 3;
        }
        return 1;
    };

    return (
      <Grid item container className={wrapperClass}>
        <Grid item container xs={12}>
          <Grid className={classes.AmountOfDaysText} item>Est. Remaining Days</Grid>
          <Grid item className={classes.Hint}>
            <Tooltip text={'need to implement'} />
          </Grid>
        </Grid>
        <Grid item className={`${classes.AmountOfDays} ${liquidationError ? classes.Red : ''}`}>{formatNumberToUi(currentRemainingDays, true)}</Grid>
        <Grid item className={`${classes.Days} ${liquidationError ? classes.Red : ''}`}>
          days
        </Grid>
        {!!inputValue && <Grid item xs className={`${classes.NewDaysEstimation} ${fromWithdraw ? classes.Red : ''}`}>({operatorSign}{formatNumberToUi(newRemainingDays, true)})</Grid>}
        {liquidationError && <ProgressBar remainingDays={currentRemainingDays} />}
        {liquidationError && <ErrorText marginTop={'16px'} errorType={errorMessageHandler()} />}
      </Grid>
    );
};

export default observer(RemainingDays);
