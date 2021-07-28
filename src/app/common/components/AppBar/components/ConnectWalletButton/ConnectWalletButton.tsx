import React from 'react';
import { observer } from 'mobx-react';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import Button from '~app/common/components/AppBar/components/Button';
import ApplicationStore from '~app/common/stores/Application.store';

type ConnectWalletButtonProps = {
  buttonComponent?: any;
  buttonText?: string;
};

const ConnectWalletButton = (props: ConnectWalletButtonProps) => {
  const { buttonComponent, buttonText } = props;
  const stores = useStores();
  const walletStore: WalletStore = stores.Wallet;
  const applicationStore: ApplicationStore = stores.Application;
  const walletImageStyle = { width: 24, height: 24, marginRight: 5, marginLeft: 0 };

  const onClick = () => {
    if (walletStore.connected) {
      return applicationStore.showWalletPopUp(true);
    }
    return walletStore.connect();
  };

  let icon;
  if (walletStore.wallet?.name) {
    switch (walletStore.wallet.name) {
      case 'MetaMask':
        icon = '/images/metamask.svg';
        break;
      case 'Ledger':
        icon = '/images/metamask.svg';
        break;
      case 'Trezor':
        icon = '/images/metamask.svg';
        break;
    }
  }

  const walletDisplayName = (address: string) => {
    if (!address) {
      return '';
    }
    return `${address.substr(0, 6)}...${address.substr(address.length - 4, 4)}`;
  };

  const ConnectButton = buttonComponent ?? Button;

  return (
    <ConnectButton color="inherit" onClick={onClick}>
      {walletStore.connected ? (
        <>
          {icon && <img src={icon} style={walletImageStyle} alt={`Connected to ${walletStore.wallet.name}`} />}
          {walletDisplayName(walletStore.accountAddress)}
        </>
      ) : buttonText ?? 'Connect Wallet'}
    </ConnectButton>
  );
};
export default observer(ConnectWalletButton);
