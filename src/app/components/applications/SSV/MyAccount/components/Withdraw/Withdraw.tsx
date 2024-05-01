import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getAccountAddress } from '~app/redux/wallet.slice';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import BorderScreen from '~app/components/common/BorderScreen';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Withdraw/Withdraw.styles';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import { SsvStore } from '~app/common/stores/applications/SsvWeb';
import { fromWei, toDecimalNumber } from '~root/services/conversions.service';
import { getClusterBalance } from '~root/services/cluster.service';
import { SingleOperator, SingleCluster } from '~app/model/processes.model';
import OperatorFlow from './OperatorFlow';
import ClusterFlow from './ClusterFlow';

let interval: NodeJS.Timeout;

const Withdraw = () => {
  const accountAddress = useAppSelector(getAccountAddress);
  const location = useLocation();
  const classes = useStyles();
  const stores = useStores();
  const processStore: ProcessStore = stores.Process;
  const ssvStore: SsvStore = stores.SSV;
  const myAccountStore: MyAccountStore = stores.MyAccount;
  const process: SingleOperator | SingleCluster = processStore.getProcess;
  const processItem = process?.item;
  const [processItemBalance, setProcessItemBalance] = useState(processStore.isValidatorFlow ? fromWei(processItem.balance) : processItem.balance);

  useEffect(() => {
    if (processStore.isValidatorFlow) {
      interval = setInterval(async () => {
        const balance = await getClusterBalance(processItem.operators, accountAddress, ssvStore.liquidationCollateralPeriod, ssvStore.minimumLiquidationCollateral, true);
        setProcessItemBalance(balance);
      }, 12000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
      <Grid container item style={{ gap: 32 }}>
        <NewWhiteWrapper type={processStore.isValidatorFlow ? 0 : 1} header={processStore.isValidatorFlow ? 'Cluster' : 'Operator Details'}/>
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
                </Grid>,
              ]}
          />
          {processStore.isValidatorFlow ?
            <ClusterFlow
              cluster={processItem}
              callbackAfterExecution={myAccountStore.refreshOperatorsAndClusters}
              minimumLiquidationCollateral={ssvStore.minimumLiquidationCollateral}
              liquidationCollateralPeriod={ssvStore.liquidationCollateralPeriod}
            />
            : <OperatorFlow operator={processItem} />}
        </Grid>
      </Grid>
  );
};

export default observer(Withdraw);
