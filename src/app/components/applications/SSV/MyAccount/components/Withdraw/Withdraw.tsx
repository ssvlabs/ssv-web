import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import BorderScreen from '~app/components/common/BorderScreen';
import ClusterStore from '~app/common/stores/applications/SsvWeb/Cluster.store';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Withdraw/Withdraw.styles';
import ProcessStore, { SingleCluster, SingleOperator } from '~app/common/stores/applications/SsvWeb/Process.store';
import OperatorFlow from '~app/components/applications/SSV/MyAccount/components/Withdraw/components/OperatorFlow';
import ValidatorFlow from '~app/components/applications/SSV/MyAccount/components/Withdraw/components/ValidatorFlow';
import { fromWei, toDecimalNumber } from '~root/services/conversions.service';

const Withdraw = () => {
  const stores = useStores();
  const classes = useStyles();
  const clusterStore: ClusterStore = stores.Cluster;
  const processStore: ProcessStore = stores.Process;
  const process: SingleOperator | SingleCluster = processStore.getProcess;
  const processItem = process?.item;
  const processItemBalance = processStore.isValidatorFlow ? fromWei(processItem.balance) : processItem.balance;

  useEffect(() => {
    if (processStore.isValidatorFlow) {
      const interval = setInterval(async () => {
        // Call your function here
        processItem.balance = await clusterStore.getClusterBalance(processItem.operators);
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
                    {formatNumberToUi(toDecimalNumber(Number(processItemBalance)))} SSV
                  </Grid>
                  <Grid item xs={12} className={classes.currentBalanceDollar}>
                    {/* ~$2,449.53 */}
                  </Grid>
                </Grid>,
              ]}
          />
          {processStore.isValidatorFlow ? <ValidatorFlow /> : <OperatorFlow />}
        </Grid>
      </Grid>
  );
};

export default observer(Withdraw);
