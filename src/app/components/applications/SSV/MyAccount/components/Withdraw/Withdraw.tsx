import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Withdraw/Withdraw.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import { useAppSelector } from '~app/hooks/redux.hook';
import { SingleCluster, SingleOperator, ValidatorItem } from '~app/model/processes.model.ts';
import { getNetworkFeeAndLiquidationCollateral } from '~app/redux/network.slice';
import { getAccountAddress } from '~app/redux/wallet.slice';
import { formatNumberToUi } from '~lib/utils/numbers';
import { getClusterBalance } from '~root/services/cluster.service';
import { fromWei, toDecimalNumber } from '~root/services/conversions.service';
import OperatorFlow from '~app/components/applications/SSV/MyAccount/components/Withdraw/OperatorFlow';
import ClusterFlow from '~app/components/applications/SSV/MyAccount/components/Withdraw/ClusterFlow';
import { getIsValidatorFlow, getProcessItem } from '~app/redux/process.slice.ts';

let interval: NodeJS.Timeout;

function checkIfValidator(
  _validatorOrOperator: ReturnType<typeof getProcessItem<SingleOperator | SingleCluster>>,
  isVFlow: boolean | undefined
): _validatorOrOperator is ValidatorItem {
  return Boolean(isVFlow);
}

const Withdraw = () => {
  const accountAddress = useAppSelector(getAccountAddress);
  const { liquidationCollateralPeriod, minimumLiquidationCollateral } = useAppSelector(getNetworkFeeAndLiquidationCollateral);
  const classes = useStyles();
  const isValidatorFlow: boolean | undefined = useAppSelector(getIsValidatorFlow);
  const validatorOrOperator = useAppSelector(getProcessItem<SingleOperator | SingleCluster>)!;
  const [processItemBalance, setProcessItemBalance] = useState<number>(isValidatorFlow ? fromWei(validatorOrOperator?.balance) : +(validatorOrOperator?.balance ?? 0));

  useEffect(() => {
    if (checkIfValidator(validatorOrOperator, isValidatorFlow)) {
      interval = setInterval(async () => {
        const balance = await getClusterBalance(validatorOrOperator?.operators, accountAddress, liquidationCollateralPeriod, minimumLiquidationCollateral, true);
        setProcessItemBalance(balance);
      }, 12000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <Grid container item style={{ gap: 32 }}>
      <NewWhiteWrapper type={isValidatorFlow ? 0 : 1} header={isValidatorFlow ? 'Cluster' : 'Operator Details'} />
      <Grid container className={classes.ScreensWrapper} item xs={12}>
        <BorderScreen
          marginTop={0}
          withoutNavigation
          header={'Available Balance'}
          wrapperClass={classes.FirstSquare}
          body={[
            <Grid item container>
              <Grid item xs={12} className={classes.currentBalance}>
                {formatNumberToUi(toDecimalNumber(Number(processItemBalance?.toFixed(2))))} SSV
              </Grid>
              <Grid item xs={12} className={classes.currentBalanceDollar}></Grid>
            </Grid>
          ]}
        />
        {checkIfValidator(validatorOrOperator, isValidatorFlow) ? (
          <ClusterFlow cluster={validatorOrOperator} minimumLiquidationCollateral={minimumLiquidationCollateral} liquidationCollateralPeriod={liquidationCollateralPeriod} />
        ) : (
          <OperatorFlow operator={validatorOrOperator} />
        )}
      </Grid>
    </Grid>
  );
};

export default Withdraw;
