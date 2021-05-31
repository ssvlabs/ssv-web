import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import { useStores } from '~app/hooks/useStores';
import ClearIcon from '@material-ui/icons/Clear';
import LaunchIcon from '@material-ui/icons/Launch';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import config from '~app/common/config';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import ApplicationStore from '~app/common/stores/Application.store';
import { useStyles } from '~app/components/WalletPopUp/WalletPopUp.styles';

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

    const openWalletAddress = () => {
        window.open(`${config.links.ETHER_SCAN_LINK}${walletStore.accountAddress}`);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(walletStore.accountAddress);
    };

    return (
      <Dialog aria-labelledby="simple-dialog-title" open={applicationStore.walletPopUp}>
        <Grid wrap={'wrap'} container alignItems={'center'} item zeroMinWidth spacing={0}>
          <Grid item xs={12}>
            <ClearIcon onClick={closePopUp} className={classes.exitIcon} />
          </Grid>
        </Grid>
        <Grid className={classes.gridWrapper}>
          <Grid wrap={'wrap'} container alignItems={'center'} item zeroMinWidth spacing={0} className={classes.gridContainer}>
            <Grid>
              <Typography variant={'h6'}>Wallet Address</Typography>
            </Grid>
            <Grid item>
              <button className={classes.connectButton} onClick={changeWallet}>Change</button>
            </Grid>
          </Grid>
          <Grid container alignItems={'center'} spacing={2} className={classes.gridContainerAddress}>
            <Grid item xs>
              <Typography noWrap variant={'body2'}>{walletStore.accountAddress}</Typography>
            </Grid>
            <Grid item>
              <FileCopyIcon className={classes.cursor} onClick={copyToClipboard} />
            </Grid>
            <Grid item>
              <LaunchIcon className={classes.cursor} onClick={openWalletAddress} />
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    );
};

export default observer(WalletPopUp);
