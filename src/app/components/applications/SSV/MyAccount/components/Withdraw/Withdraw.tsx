import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Withdraw/Withdraw.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getNetworkFeeAndLiquidationCollateral } from '~app/redux/network.slice';
import { getAccountAddress } from '~app/redux/wallet.slice';
import { formatNumberToUi } from '~lib/utils/numbers';
import { getClusterBalance } from '~root/services/cluster.service';
import { fromWei } from '~root/services/conversions.service';
import OperatorFlow from '~app/components/applications/SSV/MyAccount/components/Withdraw/OperatorFlow';
import ClusterFlow from '~app/components/applications/SSV/MyAccount/components/Withdraw/ClusterFlow';
import { getSelectedCluster, getSelectedOperator } from '~app/redux/account.slice.ts';
import { useOperatorBalance } from '~app/hooks/operator/useOperatorBalance.ts';

let interval: NodeJS.Timeout;

const Withdraw = ({ isValidatorFlow }: { isValidatorFlow: boolean }) => {
  const accountAddress = useAppSelector(getAccountAddress);
  const { liquidationCollateralPeriod, minimumLiquidationCollateral } = useAppSelector(getNetworkFeeAndLiquidationCollateral);
  const classes = useStyles();
  const cluster = useAppSelector(getSelectedCluster);
  const operator = useAppSelector(getSelectedOperator);
  const { data: balance } = useOperatorBalance(operator?.id);
  const [processItemBalance, setProcessItemBalance] = useState<number>(isValidatorFlow ? fromWei(cluster.balance) : +(balance ?? 0));

  useEffect(() => {
    if (isValidatorFlow) {
      interval = setInterval(async () => {
        const balance = await getClusterBalance(cluster.operators, accountAddress, liquidationCollateralPeriod, minimumLiquidationCollateral, true);
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
                {formatNumberToUi(processItemBalance)} SSV
              </Grid>
              <Grid item xs={12} className={classes.currentBalanceDollar}></Grid>
            </Grid>
          ]}
        />
        {isValidatorFlow ? (
          <ClusterFlow clusterBalance={processItemBalance} minimumLiquidationCollateral={minimumLiquidationCollateral} liquidationCollateralPeriod={liquidationCollateralPeriod} />
        ) : (
          operator && <OperatorFlow operator={operator} />
        )}
      </Grid>
    </Grid>
  );
};

export default Withdraw;
