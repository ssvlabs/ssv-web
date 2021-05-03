import React from 'react';
import { observer } from 'mobx-react';
import { useStores } from '~app/hooks/useStores';
import Button from '~app/common/components/AppBar/components/Button';
import TorusIcon from './images/torus.png';
import MetaMaskIcon from './images/metamask.svg';
import AutheriumIcon from './images/autherium.png';
import WalletStore from '~app/common/stores/Wallet.store';

const ConnectWalletButton = () => {
  const stores = useStores();
  const wallet: WalletStore = stores.wallet;
  const walletImageStyle = { width: 24, height: 24, marginRight: 10, marginLeft: 0 };

  const onClick = () => {
    if (wallet.connected) {
      return wallet.disconnect();
    }
    return wallet.connect();
  };
  let icon;
  if (wallet.wallet?.name) {
    switch (wallet.wallet.name) {
      case 'MetaMask':
        icon = MetaMaskIcon;
        break;
      case 'Torus':
        icon = TorusIcon;
        break;
      case 'Authereum':
        icon = AutheriumIcon;
        break;
    }
  }

  return (
    <Button variant="outlined" color="primary" onClick={onClick} style={{ textTransform: 'none' }}>
      {wallet.connected ? (
        <>
          {icon && <img src={icon} style={walletImageStyle} alt={`Connected to ${wallet.wallet.name}`} />}
          {wallet.accountAddress.substr(0, 4)}..{wallet.accountAddress.substr(wallet.accountAddress.length - 3, 3)}
        </>
      ) : 'Connect Wallet'}
    </Button>
  );
};

export default observer(ConnectWalletButton);
