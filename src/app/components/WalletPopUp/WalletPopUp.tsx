import React from 'react';
import { observer } from 'mobx-react';
import { isMobile } from 'react-device-detect';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import LaunchIcon from '@material-ui/icons/Launch';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
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

    const serializeAddress = (address: string) => {
        if (isMobile) {
            return `${address.slice(0, 10)}...${address.slice(address.length - 10, address.length)}`;
        }
        return address;
    };

    return (
      <Dialog className={classes.dialogWrapper} aria-labelledby="simple-dialog-title" open={applicationStore.walletPopUp}>
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
            <Grid container className={`${classes.gridContainer} ${classes.gridContainerAddress}`}>
              <Grid item xs={10} md={10} lg={11}>
                <Typography className={classes.accountAddress}>{serializeAddress(walletStore.accountAddress)}</Typography>
              </Grid>
              <Grid item xs={2} md={2} lg={1}>
                <div className={classes.lunchIconWrapper}>
                  <LaunchIcon className={classes.launchIcon} onClick={openWalletAddress} />
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    );
};

export default observer(WalletPopUp);
