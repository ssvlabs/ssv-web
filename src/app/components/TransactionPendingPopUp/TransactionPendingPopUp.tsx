import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { useStores } from '~app/hooks/useStores';
import ApplicationStore from '~app/common/stores/Application.store';
import NotificationsStore from '~app/common/stores/Notifications.store';
import { useStyles } from '~app/components/TransactionPendingPopUp/TransactionPendingPopUp.styles';

type TransactionPendingPopUpParams = {
    txHash: string
};

const TransactionPendingPopUp = ({ txHash }: TransactionPendingPopUpParams) => {
    const stores = useStores();
    const classes = useStyles();
    const notificationsStore: NotificationsStore = stores.Notifications;
    const applicationStore: ApplicationStore = stores.Application;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(txHash);
        notificationsStore.showMessage('Copied to clipboard.', 'success');
    };

    return (
      <Dialog aria-labelledby="simple-dialog-title" open={applicationStore.transactionPandingPopUp}>
        <Grid className={classes.gridWrapper} wrap={'wrap'} container alignItems={'center'}>
          <Grid className={classes.gridContainer} item>
            <Typography className={classes.title} variant="h5" data-testid="header-title">Sending transaction</Typography>
            <Typography className={classes.subTitle} variant="subtitle1">Your transaction is pending on the blockchain - please wait</Typography>
            <Typography className={classes.subTitle} variant="subtitle1">while it`s being confirmed</Typography>
          </Grid>
          <Grid container className={classes.loaderWrapper} spacing={1}>
            <div className={classes.loader} />
            <div className={classes.loader} />
            <div className={classes.loader} />
          </Grid>
          <Grid className={classes.gridContainer} item>
            <Typography className={classes.subTitle} variant="subtitle1">Transaction Hash</Typography>
          </Grid>
          <Grid className={classes.transactionContainer} container spacing={1} alignItems={'center'}>
            <Grid item xs zeroMinWidth>
              <Typography className={classes.transactionText} noWrap>{txHash}</Typography>
            </Grid>
            <Grid item>
              <FileCopyIcon className={classes.copyImage} onClick={copyToClipboard} />
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
