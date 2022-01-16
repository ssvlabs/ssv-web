import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import { useStores } from '~app/hooks/useStores';
import Header from '~app/common/components/Header';
import ApplicationStore from '~app/common/stores/Application.store';
import ValidatorKeyInput from '~app/common/components/ValidatorKeyInput/ValidatorKeyInput';
import { useStyles } from '~app/components/TransactionPendingPopUp/TransactionPendingPopUp.styles';

type TransactionPendingPopUpParams = {
    txHash: string
};

const TransactionPendingPopUp = ({ txHash }: TransactionPendingPopUpParams) => {
    const stores = useStores();
    const classes = useStyles();
    const applicationStore: ApplicationStore = stores.Application;

    return (
      <Dialog aria-labelledby="simple-dialog-title" open={applicationStore.transactionPendingPopUp}>
        <Grid className={classes.gridWrapper} wrap={'wrap'} container alignItems={'center'} spacing={1}>
          <Grid className={classes.gridContainer} item>
            <Header title={'Sending transaction'} subtitle={''} />
            <Header title={''} subtitle={'Your transaction is pending on the blockchain - please wait'} />
            <Header title={''} subtitle={'while it`s being confirmed'} />
          </Grid>
          <Grid item container className={classes.loaderWrapper} spacing={1}>
            <div className={classes.loader} />
            <div className={classes.loader} />
            <div className={classes.loader} />
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <div className={classes.validatorText}>TRANSACTION HASH</div>
            </Grid>
            <Grid item xs={12}>
              <ValidatorKeyInput validatorKey={txHash} />
            </Grid>
          </Grid>
          <Grid className={classes.linkHref} item>
            <a href={`https://goerli.etherscan.io/tx/${txHash}`} target={'_blank'}>view on etherscan</a>
          </Grid>
        </Grid>
      </Dialog>
    );
};

export default observer(TransactionPendingPopUp);
