import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from './OperatorBox.styles';
import Status from '~app/components/common/Status';
import { formatNumberToUi } from '~lib/utils/numbers';
import ToolTip from '~app/components/common/ToolTip/ToolTip';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import OperatorDetails
  from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import UpdateFeeState
  from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/UpdateFeeState';

const OperatorBox = ({ operator }: { operator: any }) => {
  const stores = useStores();
  const ssvStore: SsvStore = stores.SSV;
  const isDeleted = operator.is_deleted;
  const classes = useStyles({ isDeleted });
  const walletStore: WalletStore = stores.Wallet;
  if (operator === null) return <Grid item className={classes.OperatorBox}/>;

  return (
      <Grid item className={classes.OperatorBox}>
        <UpdateFeeState />
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
            <Grid className={classes.YearlyFeeWrapper}>
              <Grid item>Yearly Fee</Grid>
                <Grid className={classes.UpdateFeeIndicator}/>
              </Grid>
          </Grid>
          <Grid item container className={classes.ColumnWrapper}>
            <Status item={operator}/>
            <Grid item className={classes.BoldText}>{isDeleted ? '-' : `${operator.performance['30d'].toFixed(2) ?? 0  }%`}</Grid>
            <Grid item
                  className={classes.BoldText}>{isDeleted ? '-' : `${formatNumberToUi(ssvStore.getFeeForYear(walletStore.fromWei(operator.fee)))} SSV`}</Grid>
          </Grid>
        </Grid>
      </Grid>
  );
};

export default observer(OperatorBox);
