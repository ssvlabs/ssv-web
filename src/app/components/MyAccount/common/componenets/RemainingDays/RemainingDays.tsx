import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import { useStores } from '~app/hooks/useStores';
import SsvStore from '~app/common/stores/SSV.store';
import { formatNumberToUi } from '~lib/utils/numbers';
import Tooltip from '~app/common/components/Tooltip/Tooltip';
import ProgressBar from '~app/components/MyAccount/common/componenets/ProgressBar';
import { useStyles } from '~app/components/MyAccount/common/componenets/RemainingDays/RemainingDays.styles';
import ErrorText from '~app/components/MyAccount/common/componenets/ErrorText/ErrorText';

const Title = styled.div`
  height: 18px;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #a1acbe;
`;

type Props = {
    fromPage?: string,
    inputValue?: number,
    wrapperClass?: any,
};

const RemainingDays = (props: Props) => {
    const { fromPage, inputValue, wrapperClass } = props;
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
        <Grid item xs={12}>
          <Title>Est. Remaining Days <Tooltip text={'need to implement'} /></Title>
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
