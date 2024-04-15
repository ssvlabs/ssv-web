import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { translations } from '~app/common/config';
import { formatNumberToUi } from '~lib/utils/numbers';
import NaDisplay from '~app/components/common/NaDisplay';
import Tooltip from '~app/components/common/ToolTip/ToolTip';
import ProgressBar from '~app/components/applications/SSV/MyAccount/common/ProgressBar/ProgressBar';
import { useStyles } from '~app/components/applications/SSV/MyAccount/common/NewRemainingDays/NewRemainingDays.styles';
import LiquidationStateError, {
  LiquidationStateErrorType,
} from '~app/components/applications/SSV/MyAccount/common/LiquidationStateError/LiquidationStateError';

type Props = {
  cluster: any,
  withdrawState?: boolean,
  isInputFilled?: boolean | null,
};

const NewRemainingDays = ({ cluster, withdrawState, isInputFilled = null }: Props) => {
  let errorType;
  let showError: boolean;
  let warningLiquidationState: boolean;
  const clusterRunWay = cluster.newRunWay ?? cluster.runWay;
  let remainingDays: number = clusterRunWay;
  const typeOfiIsInputFilled =  typeof isInputFilled === 'boolean';
  const remainingDaysValue = formatNumberToUi(remainingDays, true);

  if (clusterRunWay < 30) {
    if (typeOfiIsInputFilled) {
      warningLiquidationState = isInputFilled;
      showError = warningLiquidationState && !cluster.isLiquidated && isInputFilled;
    } else {
      warningLiquidationState = true;
      showError = warningLiquidationState && !cluster.isLiquidated;
    }
  } else {
    warningLiquidationState = false;
    showError = false;
  }

  const setErrorType = (condition: boolean, ifCaseResponse: number, elseCaseResponse: number) => {
    if (condition) {
      return ifCaseResponse;
    } else {
      return elseCaseResponse;
    }
  };

  if (withdrawState) {
    errorType = setErrorType(remainingDays === 0, LiquidationStateErrorType.WithdrawAll, LiquidationStateErrorType.Withdraw);
  } else {
    errorType = setErrorType(remainingDays === 0, LiquidationStateErrorType.WithdrawAll, LiquidationStateErrorType.Deposit);
  }

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
                <Typography className={classes.AmountOfDays}>{remainingDaysValue}</Typography>
                {+remainingDaysValue > 0 && <Typography className={classes.Days}>days</Typography>}
              </>)
              :
              (<NaDisplay size={24} text={translations.NA_DISPLAY.TOOLTIP_TEXT} />)}
          {cluster.newRunWay !== undefined && (
              <Grid item xs className={classes.NewDaysEstimation}>
                {`(${withdrawState ? '' : '+'}${formatNumberToUi(cluster.newRunWay - cluster.runWay, true)} days)`}
              </Grid>
          )}
          {showError && (
            <Grid container>
              <ProgressBar remainingDays={remainingDays ?? 0} />
              <LiquidationStateError marginTop={'16px'} errorType={errorType} />
            </Grid>
          )}
        </Grid>
      </Grid>
    );
};

export default observer(NewRemainingDays);
