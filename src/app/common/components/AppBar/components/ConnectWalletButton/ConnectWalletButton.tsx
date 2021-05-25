import React from 'react';
import { observer } from 'mobx-react';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import Button from '~app/common/components/AppBar/components/Button';

const ConnectWalletButton = () => {
  const stores = useStores();
  const walletStore: WalletStore = stores.Wallet;
  const walletImageStyle = { width: 24, height: 24, marginRight: 10, marginLeft: 0 };

  const disconnectWalletWithPrompt = () => {
    walletStore.disconnect().then(() => walletStore.connect());
  };
  const onClick = () => {
    if (walletStore.connected) {
      return disconnectWalletWithPrompt();
    }
    return walletStore.connect();
  };
  let icon;
  if (walletStore.wallet?.name) {
    switch (walletStore.wallet.name) {
      case 'MetaMask':
        icon = '/images/metamask.svg';
        break;
      case 'Torus':
        icon = '/images/torus.png';
        break;
      case 'Authereum':
        icon = '/images/autherium.png';
        break;
    }
  }
  const walletDisplayName = (address: string) => {
    if (!address) {
      return '';
    }
    return `${address.substr(0, 6)}...${address.substr(address.length - 4, 4)}`;
  };
  return (
    <Button variant="outlined" color="primary" onClick={onClick} style={{ textTransform: 'none' }}>
      {walletStore.connected ? (
        <>
          {icon && <img src={icon} style={walletImageStyle} alt={`Connected to ${walletStore.wallet.name}`} />}
          {walletDisplayName(walletStore.accountAddress)}
        </>
      ) : 'Connect Wallet'}
    </Button>
  );
};

export default observer(ConnectWalletButton);
