import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import ApplicationStore from '~app/common/stores/Application.store';
import HeaderSubHeader from '~app/common/components/HeaderSubHeader';
import { useStyles } from '~app/components/WalletPopUp/WalletPopUp.styles';
import AddressKeyInput from '~app/common/components/AddressKeyInput/AddressKeyInput';

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
        <Dialog PaperProps={{ className: classes.Dialog }} aria-labelledby="simple-dialog-title" open={applicationStore.walletPopUp}>
          <Grid item className={classes.Exit} onClick={closePopUp} />
          <HeaderSubHeader title={'Wallet Address'} />
          <Grid container className={classes.TextWrapper}>
            <Grid item xs={6} className={classes.SubHeader}>Connect to {walletStore?.wallet?.name}</Grid>
            <Grid item xs={6} className={classes.Change} onClick={changeWallet}>Change</Grid>
          </Grid>
          <AddressKeyInput whiteBackgroundColor withEtherScan withCopy address={walletStore.accountAddress} />
        </Dialog>
      );
};

export default observer(WalletPopUp);
