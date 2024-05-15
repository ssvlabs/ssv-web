import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Withdraw/Withdraw.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import { useAppSelector } from '~app/hooks/redux.hook';
import { useStores } from '~app/hooks/useStores';
import { SingleCluster, SingleOperator } from '~app/model/processes.model';
import { getNetworkFeeAndLiquidationCollateral } from '~app/redux/network.slice';
import { getAccountAddress } from '~app/redux/wallet.slice';
import { formatNumberToUi } from '~lib/utils/numbers';
import { getClusterBalance } from '~root/services/cluster.service';
import { fromWei, toDecimalNumber } from '~root/services/conversions.service';
import ClusterFlow from './ClusterFlow';
import OperatorFlow from './OperatorFlow';

let interval: NodeJS.Timeout;

const Withdraw = () => {
  const accountAddress = useAppSelector(getAccountAddress);
  const { liquidationCollateralPeriod, minimumLiquidationCollateral } = useAppSelector(getNetworkFeeAndLiquidationCollateral);
  const classes = useStyles();
  const stores = useStores();
  const processStore: ProcessStore = stores.Process;
  const process: SingleOperator | SingleCluster = processStore.getProcess;
  const processItem = process?.item;
  const [processItemBalance, setProcessItemBalance] = useState(processStore.isValidatorFlow ? fromWei(processItem.balance) : processItem.balance);

  useEffect(() => {
    if (processStore.isValidatorFlow) {
      interval = setInterval(async () => {
        const balance = await getClusterBalance(processItem.operators, accountAddress, liquidationCollateralPeriod, minimumLiquidationCollateral, true);
        setProcessItemBalance(balance);
      }, 12000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <Grid container item style={{ gap: 32 }}>
      <NewWhiteWrapper type={processStore.isValidatorFlow ? 0 : 1} header={processStore.isValidatorFlow ? 'Cluster' : 'Operator Details'} />
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
        {processStore.isValidatorFlow ? (
          <ClusterFlow cluster={processItem} minimumLiquidationCollateral={minimumLiquidationCollateral} liquidationCollateralPeriod={liquidationCollateralPeriod} />
        ) : (
          <OperatorFlow operator={processItem} />
        )}
      </Grid>
    </Grid>
  );
};

export default observer(Withdraw);
