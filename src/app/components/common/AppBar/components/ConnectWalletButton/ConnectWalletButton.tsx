import React from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { getImage } from '~lib/utils/filePath';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from './ConnectWalletButton.styles';
import { useConnectWallet } from '@web3-onboard/react';

const ConnectWalletButton = () => {
  const stores = useStores();
  const walletStore: WalletStore = stores.Wallet;
  const applicationStore: ApplicationStore = stores.Application;
  const classes = useStyles({
    walletConnected: walletStore.connected,
    whiteAppBar: applicationStore.whiteNavBarBackground,
  });
  const [_, connect] = useConnectWallet();
  const navigate = useNavigate();

  const onClick = async () => {
    if (walletStore.wallet) {
      applicationStore.showWalletPopUp(true);
    } else {
      console.log('connectWallet before');
      try {
        await connect().then(() => {
          navigate('/join');
        });
      } catch (e) {
        console.error(e);
      }
      console.log('connectWallet after');
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
