import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import { useConnectWallet } from '@web3-onboard/react';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import { useStyles } from '~app/components/applications/SSV/WalletPopUp/WalletPopUp.styles';
import AddressKeyInput from '~app/components/common/AddressKeyInput/AddressKeyInput';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { getIsShowWalletPopup, setIsShowWalletPopup } from '~app/redux/appState.slice';
import useWalletDisconnector from '~app/hooks/useWalletDisconnector';

const WalletPopUp = () => {
    const classes = useStyles();
    const stores = useStores();
    const walletStore: WalletStore = stores.Wallet;
    const [_, connect] = useConnectWallet();
    const dispatch = useAppDispatch();
    const isShowWalletPopup = useAppSelector(getIsShowWalletPopup);
    const { disconnectWallet } = useWalletDisconnector();

    const changeWallet = async () => {
        if (walletStore.wallet) {
            await disconnectWallet();
        }
        dispatch(setIsShowWalletPopup(false));
        await connect();
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
