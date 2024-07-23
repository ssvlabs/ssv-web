import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { translations } from '~app/common/config';
import { formatNumberToUi } from '~lib/utils/numbers';
import NaDisplay from '~app/components/common/NaDisplay';
import Tooltip from '~app/components/common/ToolTip/ToolTip';
import ProgressBar from '~app/components/applications/SSV/MyAccount/common/ProgressBar/ProgressBar';
import { useStyles } from '~app/components/applications/SSV/MyAccount/common/NewRemainingDays/NewRemainingDays.styles';
import LiquidationStateError, { LiquidationStateErrorType } from '~app/components/applications/SSV/MyAccount/common/LiquidationStateError/LiquidationStateError';
import { ICluster } from '~app/model/cluster.model.ts';

type Props = {
  cluster: ICluster & { newRunWay?: number };
  withdrawState?: boolean;
  isInputFilled?: string | number | null;
};

const NewRemainingDays = ({ cluster, withdrawState, isInputFilled = null }: Props) => {
  let errorType;
  const [showErrorCondition, setShowErrorCondition] = useState(false);
  const [warningLiquidationState, setWarningLiquidationState] = useState(!withdrawState);
  const [clusterRunWay, setClusterRunWay] = useState(cluster.newRunWay ?? cluster.runWay);
  const remainingDays: number = clusterRunWay;
  const remainingDaysValue = formatNumberToUi(remainingDays, true);

  useEffect(() => {
    let showError: boolean;
    const newRunWay = cluster.newRunWay ?? cluster.runWay;
    if (newRunWay < 30) {
      if (isInputFilled !== null) {
        setWarningLiquidationState(!!isInputFilled);
        showError = !!isInputFilled || !cluster.isLiquidated;
      } else {
        showError = !cluster.isLiquidated;
      }
    } else {
      showError = false;
    }
    setClusterRunWay(newRunWay);
    setShowErrorCondition(withdrawState ? !!isInputFilled && showError : showError);
  }, [isInputFilled, cluster.newRunWay]);

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

  const classes = useStyles({ warningLiquidationState, withdrawState, showErrorCondition });

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
          </>
        ) : (
          <NaDisplay size={24} text={translations.NA_DISPLAY.TOOLTIP_TEXT} />
        )}
        {cluster.newRunWay !== undefined && (
          <Grid item xs className={classes.NewDaysEstimation}>
            {`(${withdrawState ? '' : '+'}${formatNumberToUi(cluster.newRunWay - cluster.runWay, true)} days)`}
          </Grid>
        )}
        {showErrorCondition && (
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
