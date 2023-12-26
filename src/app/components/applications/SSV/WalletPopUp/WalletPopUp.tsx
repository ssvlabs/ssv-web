import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import { useNavigate } from 'react-router-dom';
import { useConnectWallet } from '@web3-onboard/react';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import { useStyles } from '~app/components/applications/SSV/WalletPopUp/WalletPopUp.styles';
import AddressKeyInput from '~app/components/common/AddressKeyInput/AddressKeyInput';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';

const WalletPopUp = () => {
    const stores = useStores();
    const classes = useStyles();
    const applicationStore: ApplicationStore = stores.Application;
    const walletStore: WalletStore = stores.Wallet;
    const navigate = useNavigate();
    const [{ wallet }, connect, disconnect] = useConnectWallet();

    const changeWallet = async () => {
        // cleanLocalStorage();
        if (wallet) {
            await disconnect({ label: wallet.label });
            await walletStore.initWallet(null, null);
        }
        applicationStore.showWalletPopUp(false);
        // await walletStore.initWallet(null, null);
        await connect().catch((error) => {
            console.error('connect error', error);
        }).then(() => {
            navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD);
        });
    };

    const closePopUp = () => {
        applicationStore.showWalletPopUp(false);
    };

      return (
        <Dialog PaperProps={{ className: classes.Dialog }} aria-labelledby="simple-dialog-title" open={applicationStore.walletPopUp}>
          <Grid item className={classes.Exit} onClick={closePopUp} />
          <HeaderSubHeader title={'Wallet Address'} />
          <Grid container className={classes.TextWrapper}>
            <Grid item xs={12} className={classes.Change} onClick={changeWallet}>Change</Grid>
          </Grid>
          <AddressKeyInput whiteBackgroundColor withEtherScan withCopy address={walletStore.accountAddress} />
        </Dialog>
      );
};

export default observer(WalletPopUp);
