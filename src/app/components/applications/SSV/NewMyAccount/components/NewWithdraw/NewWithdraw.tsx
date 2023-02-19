import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from './NewWithdraw.styles';
import { formatNumberToUi } from '~lib/utils/numbers';
import ValidatorFlow from './components/ValidatorFlow';
import BorderScreen from '~app/components/common/BorderScreen';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import ProcessStore, { SingleOperatorProcess } from '~app/common/stores/applications/SsvWeb/Process.store';
import OperatorFlow from '~app/components/applications/SSV/NewMyAccount/components/NewWithdraw/components/OperatorFlow';

const NewWithdraw = () => {
  const stores = useStores();
  const classes = useStyles();
  const ssvStore: SsvStore = stores.SSV;
  const processStore: ProcessStore = stores.Process;
  const process: SingleOperatorProcess = processStore.getProcess;
  const processItem = process?.item;

  return (
      <Grid container item style={{ gap: 32 }}>
        <NewWhiteWrapper type={1} header={'Operator Details'}/>
        <Grid container className={classes.ScreensWrapper} item xs={12}>
          <BorderScreen
              marginTop={0}
              withoutNavigation
              header={'Balance'}
              wrapperClass={classes.FirstSquare}
              body={[
                (
                    <Grid item container>
                      <Grid item xs={12} className={classes.currentBalance}>
                        {formatNumberToUi(ssvStore.toDecimalNumber(Number(processItem.balance)))} SSV
                      </Grid>
                      <Grid item xs={12} className={classes.currentBalanceDollar}>
                        ~$2,449.53
                      </Grid>
                    </Grid>
                ),
              ]}
          />
          {processStore.isValidatorFlow ? <ValidatorFlow/> : <OperatorFlow/>}
        </Grid>
      </Grid>
  );
};

export default observer(NewWithdraw);
