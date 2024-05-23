import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Withdraw/Withdraw.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import { useAppSelector } from '~app/hooks/redux.hook';
import { SingleCluster, SingleOperator } from '~app/model/processes.model';
import { getNetworkFeeAndLiquidationCollateral } from '~app/redux/network.slice';
import { getAccountAddress } from '~app/redux/wallet.slice';
import { formatNumberToUi } from '~lib/utils/numbers';
import { getClusterBalance } from '~root/services/cluster.service';
import { fromWei, toDecimalNumber } from '~root/services/conversions.service';
import OperatorFlow from '~app/components/applications/SSV/MyAccount/components/Withdraw/OperatorFlow';
import ClusterFlow from '~app/components/applications/SSV/MyAccount/components/Withdraw/ClusterFlow';
import { getIsValidatorFlow, getProcess } from '~app/redux/process.slice.ts';

let interval: NodeJS.Timeout;

const Withdraw = () => {
  const accountAddress = useAppSelector(getAccountAddress);
  const { liquidationCollateralPeriod, minimumLiquidationCollateral } = useAppSelector(getNetworkFeeAndLiquidationCollateral);
  const classes = useStyles();
  const process: SingleOperator | SingleCluster | undefined = useAppSelector(getProcess);
  const isValidatorFlow: boolean | undefined = useAppSelector(getIsValidatorFlow);
  const processItem = process?.item;
  const [processItemBalance, setProcessItemBalance] = useState(isValidatorFlow ? fromWei(processItem.balance) : processItem.balance);

  useEffect(() => {
    if (isValidatorFlow) {
      interval = setInterval(async () => {
        const balance = await getClusterBalance(processItem.operators, accountAddress, liquidationCollateralPeriod, minimumLiquidationCollateral, true);
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
        {isValidatorFlow ? (
          <ClusterFlow cluster={processItem} minimumLiquidationCollateral={minimumLiquidationCollateral} liquidationCollateralPeriod={liquidationCollateralPeriod} />
        ) : (
          <OperatorFlow operator={processItem} />
        )}
      </Grid>
    </Grid>
  );
};

export default Withdraw;
