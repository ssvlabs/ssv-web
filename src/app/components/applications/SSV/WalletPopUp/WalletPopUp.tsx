import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import { useStyles } from '~app/components/applications/SSV/WalletPopUp/WalletPopUp.styles';
import AddressKeyInput from '~app/components/common/AddressKeyInput/AddressKeyInput';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import useWalletDisconnector from '~app/hooks/walletDisconnector.hook';
import { getIsShowWalletPopup, setIsShowConnectWallet, setIsShowWalletPopup } from '~app/redux/appState.slice';
import { getAccountAddress } from '~app/redux/wallet.slice';

const WalletPopUp = () => {
  const classes = useStyles();
  const accountAddress = useAppSelector(getAccountAddress);
  const dispatch = useAppDispatch();
  const isShowWalletPopup = useAppSelector(getIsShowWalletPopup);
  const { disconnectWallet } = useWalletDisconnector();

  const changeWallet = async () => {
    if (accountAddress) {
      await disconnectWallet();
    }
    dispatch(setIsShowWalletPopup(false));
    dispatch(setIsShowConnectWallet(true));
  };

  const closePopUp = () => {
    dispatch(setIsShowWalletPopup(false));
  };

  return (
    <Dialog PaperProps={{ className: classes.Dialog }} aria-labelledby="simple-dialog-title" open={isShowWalletPopup}>
      <Grid item className={classes.Exit} onClick={closePopUp} />
      <HeaderSubHeader title={'Wallet Address'} />
      <Grid container className={classes.TextWrapper}>
        <Grid item xs={12} className={classes.Change} onClick={changeWallet}>
          Change
        </Grid>
      </Grid>
      <AddressKeyInput whiteBackgroundColor withEtherScan withCopy address={accountAddress} />
    </Dialog>
  );
};

export default WalletPopUp;
