import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import { useNavigate } from 'react-router-dom';
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { cleanLocalStorageAndCookie } from '~lib/utils/onboardHelper';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import { useStyles } from '~app/components/applications/SSV/WalletPopUp/WalletPopUp.styles';
import AddressKeyInput from '~app/components/common/AddressKeyInput/AddressKeyInput';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { getIsShowWalletPopup, setIsShowWalletPopup } from '~app/redux/appState.slice';

const WalletPopUp = () => {
    const stores = useStores();
    const classes = useStyles();
    const walletStore: WalletStore = stores.Wallet;
    const navigate = useNavigate();
    const [{ wallet }, connect, disconnect] = useConnectWallet();
    const [{ connectedChain }] = useSetChain();
    const dispatch = useAppDispatch();
    const isShowWalletPopup = useAppSelector(getIsShowWalletPopup);

    const changeWallet = async () => {
        cleanLocalStorageAndCookie();
        if (wallet) {
            await disconnect({ label: wallet.label });
            navigate(config.routes.SSV.ROOT);
            await walletStore.initWallet(null, null);
        }
        dispatch(setIsShowWalletPopup(false));
        await connect();
        await walletStore.initWallet(wallet, connectedChain);
    };

    const closePopUp = () => {
        dispatch(setIsShowWalletPopup(false));
    };

      return (
        <Dialog PaperProps={{ className: classes.Dialog }} aria-labelledby="simple-dialog-title" open={isShowWalletPopup}>
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
