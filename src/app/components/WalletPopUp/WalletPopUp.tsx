import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import ApplicationStore from '~app/common/stores/Application.store';
import { useStyles } from '~app/components/WalletPopUp/WalletPopUp.styles';
import ValidatorKeyInput from '~app/common/components/ValidatorKeyInput/ValidatorKeyInput';

const WalletPopUp = () => {
    const stores = useStores();
    const classes = useStyles();
    const applicationStore: ApplicationStore = stores.Application;
    const walletStore: WalletStore = stores.Wallet;

    const changeWallet = () => {
        applicationStore.showWalletPopUp(false);
        walletStore.onboardSdk.walletSelect();
    };

    const closePopUp = () => {
        applicationStore.showWalletPopUp(false);
    };

    return (
      <Dialog PaperProps={{ className: classes.dialog }} aria-labelledby="simple-dialog-title" open={applicationStore.walletPopUp}>
        <CloseIcon viewBox={'5 5 15 15'} fontSize={'large'} onClick={closePopUp} className={classes.exitIcon} />
        <Grid container className={classes.gridWrapper} spacing={4}>
          <Grid item xs={12}>
            <Grid container spacing={1} className={classes.gridContainer}>
              <Grid item>
                <Typography className={classes.header}>Wallet Address</Typography>
              </Grid>
              <Grid item>
                <button className={classes.connectButton} onClick={changeWallet}>Change</button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <ValidatorKeyInput link={`https://goerli.etherscan.io/address/${walletStore.accountAddress}`} validatorKey={walletStore.accountAddress} />
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    );
};

export default observer(WalletPopUp);
