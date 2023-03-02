import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from './NewWithdraw.styles';
import { formatNumberToUi } from '~lib/utils/numbers';
import ValidatorFlow from './components/ValidatorFlow';
import BorderScreen from '~app/components/common/BorderScreen';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import ProcessStore, { SingleCluster, SingleOperator } from '~app/common/stores/applications/SsvWeb/Process.store';
import OperatorFlow from '~app/components/applications/SSV/NewMyAccount/components/NewWithdraw/components/OperatorFlow';

const NewWithdraw = () => {
  const stores = useStores();
  const classes = useStyles();
  const ssvStore: SsvStore = stores.SSV;
  const walletStore: WalletStore = stores.Wallet;
  const processStore: ProcessStore = stores.Process;
  const process: SingleOperator | SingleCluster = processStore.getProcess;
  const processItem = process?.item;
  const processItemBalance = processStore.isValidatorFlow ? walletStore.fromWei(processItem.balance) : processItem.balance;

  return (
      <Grid container item style={{ gap: 32 }}>
        <NewWhiteWrapper type={processStore.isValidatorFlow ? 0 : 1} header={processStore.isValidatorFlow ? 'Cluster' : 'Operator Details'}/>
        <Grid container className={classes.ScreensWrapper} item xs={12}>
          <BorderScreen
              marginTop={0}
              withoutNavigation
              header={'Balance'}
              wrapperClass={classes.FirstSquare}
              body={[
                <Grid item container>
                  <Grid item xs={12} className={classes.currentBalance}>
                    {formatNumberToUi(ssvStore.toDecimalNumber(Number(processItemBalance)))} SSV
                  </Grid>
                  <Grid item xs={12} className={classes.currentBalanceDollar}>
                    ~$2,449.53
                  </Grid>
                </Grid>,
              ]}
          />
          {processStore.isValidatorFlow ? <ValidatorFlow/> : <OperatorFlow/>}
        </Grid>
      </Grid>
  );
};

export default observer(NewWithdraw);
