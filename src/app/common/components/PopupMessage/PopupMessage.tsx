import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useStores } from '~app/hooks/useStores';
import SsvStore from '~app/common/stores/SSV.store';
import { getEtherScanUrl } from '~lib/utils/beaconcha';
import { longStringShorten } from '~lib/utils/strings';
import { useStyles } from './PopupMessage.styles';

const PopupMessage = () => {
    const classes = useStyles();
    const stores = useStores();
    const ssvStore: SsvStore = stores.SSV;

    const transactionText = () => {
        if (ssvStore.transactionStatus === 'done') {
             return 'Your transaction has succeeded';
        } if (ssvStore.transactionStatus === 'error') {
            return 'Your transaction has failed';
        }
        return 'Your transaction is pending';
    };

    return (
      <Grid container item className={classes.PopupMessageWrapper}>
        <Grid item className={ssvStore.transactionStatus === 'done' ? classes.PopupIconDone : classes.PopupIcon} />
        <Grid item className={classes.PopupMessageText}>
          {transactionText()}
        </Grid>
        <Grid item xs
          className={`${classes.PopupMessageText} ${classes.PopupExitLogo}`}
          style={{ textAlign: 'right' }}
          onClick={() => { ssvStore.setTransactionInProgress(!ssvStore.transactionInProgress, ''); }}>
          X
        </Grid>
        <Grid item container xs className={classes.TransactionWrapper}>
          <Grid item>{`0x${longStringShorten(ssvStore.transactionTx.replace('0x', ''), 4)}`}</Grid>
          <Grid item className={classes.EtherScanLink} onClick={() => { window.open(`${getEtherScanUrl()}/${ssvStore.transactionTx}`); }} />
        </Grid>
      </Grid>
    );
};

export default observer(PopupMessage);
