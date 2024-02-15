import React from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { useConnectWallet } from '@web3-onboard/react';
import { getImage } from '~lib/utils/filePath';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import { useStyles } from './ConnectWalletButton.styles';
import { setIsShowWalletPopup } from '~app/redux/appState.slice';
import { useAppDispatch } from '~app/hooks/redux.hook';
import config from '~app/common/config';

const ConnectWalletButton = () => {
  const stores = useStores();
  const walletStore: WalletStore = stores.Wallet;
  const classes = useStyles({ walletConnected: !!walletStore.wallet });
  const [{ wallet }, connect] = useConnectWallet();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onClick = async () => {
    if (walletStore.wallet) {
      dispatch(setIsShowWalletPopup(true));
    } else {
      await connect().then(() => {
        navigate(config.routes.SSV.ROOT);
      }).catch((error) => {
        console.error('ConnectWalletButton:', error);
      });
    }
  };

  let icon;
  if (walletStore.wallet?.label) {
    switch (walletStore.wallet.label) {
      case 'Ledger':
        icon = getImage('wallets/ledger.svg');
        break;
      case 'Trezor':
        icon = getImage('wallets/trezor.svg');
        break;
        case 'WalletConnect':
        icon = getImage('wallets/walletconnect.svg');
        break;
      default:
        icon = getImage('wallets/metamask.svg');
        break;
    }
  }

  const walletDisplayName = (address: string) => `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

  return (
    <Grid item container className={classes.ConnectWalletWrapper} onClick={onClick}>
      {!walletStore.accountAddress && <Grid item>Connect Wallet</Grid>}
      {walletStore.accountAddress && (
        <Grid item container>
          <Grid item><img className={classes.WalletImage} src={icon}
                          alt={`Connected to ${walletStore.wallet.name}`}/></Grid>
          <Grid item className={classes.WalletAddress}>{walletDisplayName(walletStore.accountAddress)}</Grid>
        </Grid>
      )}
    </Grid>
  );
};
export default observer(ConnectWalletButton);
