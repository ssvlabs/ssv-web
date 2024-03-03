import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import BorderScreen from '~app/components/common/BorderScreen';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Withdraw/Withdraw.styles';
import ProcessStore, { SingleCluster, SingleOperator } from '~app/common/stores/applications/SsvWeb/Process.store';
import OperatorFlow from '~app/components/applications/SSV/MyAccount/components/Withdraw/components/OperatorFlow';
import ValidatorFlow from '~app/components/applications/SSV/MyAccount/components/Withdraw/components/ValidatorFlow';
import { fromWei, toDecimalNumber } from '~root/services/conversions.service';
import { SsvStore, WalletStore } from '~app/common/stores/applications/SsvWeb';
import { getClusterBalance } from '~root/services/cluster.service';

let interval: NodeJS.Timeout;

const Withdraw = () => {
  const stores = useStores();
  const classes = useStyles();
  const processStore: ProcessStore = stores.Process;
  const walletStore: WalletStore = stores.Wallet;
  const ssvStore: SsvStore = stores.SSV;
  const process: SingleOperator | SingleCluster = processStore.getProcess;
  const processItem = process?.item;
  const [processItemBalance, setProcessItemBalance] = useState(processStore.isValidatorFlow ? fromWei(processItem.balance) : processItem.balance);

  useEffect(() => {
    if (processStore.isValidatorFlow) {
      interval = setInterval(async () => {
        const balance = await getClusterBalance(processItem.operators, walletStore.accountAddress, ssvStore.liquidationCollateralPeriod, ssvStore.minimumLiquidationCollateral, true);
        setProcessItemBalance(balance);
      }, 2000);
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
          {processStore.isValidatorFlow ? <ValidatorFlow /> : <OperatorFlow />}
        </Grid>
      </Grid>
  );
};

export default observer(Withdraw);
