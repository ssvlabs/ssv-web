import React from 'react';
import { observer } from 'mobx-react';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Wallet.store';
import Button from '~app/common/components/AppBar/components/Button';

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
    return `${address.substr(0, 4)}..${address.substr(address.length - 3, 3)}`;
  };
  return (
    <Button variant="outlined" color="primary" onClick={onClick} style={{ textTransform: 'none' }}>
      {wallet.connected ? (
        <>
          {icon && <img src={icon} style={walletImageStyle} alt={`Connected to ${wallet.wallet.name}`} />}
          {walletDisplayName(wallet.accountAddress)}
        </>
      ) : 'Connect Wallet'}
    </Button>
  );
};

export default observer(ConnectWalletButton);
