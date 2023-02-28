import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from './OperatorBox.styles';
import Status from '~app/components/common/Status';
import { formatNumberToUi } from '~lib/utils/numbers';
import ToolTip from '~app/components/common/ToolTip/ToolTip';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import OperatorDetails
  from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';

const OperatorBox = ({ operator }: { operator: any }) => {
  const stores = useStores();
  const classes = useStyles();
  const walletStore: WalletStore = stores.Wallet;
  if (operator === null) return <Grid item className={classes.OperatorBox}/>;

  return (
      <Grid item className={classes.OperatorBox}>
        <Grid className={classes.FirstSectionOperatorBox}>
          <OperatorDetails operator={operator}/>
        </Grid>
        <Grid container item className={classes.SecondSectionOperatorBox}>
          <Grid item container className={classes.ColumnWrapper}>
            <Grid item>
              <Grid container style={{ gap: 6, alignItems: 'center' }}>
                Status
                <ToolTip
                    text={'Is the operator performing duties for the majority of its validators for the last 2 epochs.'}/>
              </Grid>
            </Grid>
            <Grid item>30D Perform.</Grid>
            <Grid item>Yearly Fee</Grid>
          </Grid>
          <Grid item container className={classes.ColumnWrapper}>
            <Status item={operator}/>
            <Grid item className={classes.BoldText}>{operator.performance['30d'] ?? 0}%</Grid>
            <Grid item
                  className={classes.BoldText}>{formatNumberToUi(walletStore.fromWei(operator.fee) * config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR)} SSV</Grid>
          </Grid>
        </Grid>
      </Grid>
  );
};

export default observer(OperatorBox);
