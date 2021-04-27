import React from 'react';
import { observer } from 'mobx-react';
import { useStores } from '~app/hooks/useStores';
import Button from '~app/common/components/AppBar/components/Button';

const ConnectWalletButton = () => {
  const { wallet } = useStores();

  return (
    <Button variant="outlined" color="primary" onClick={wallet.connect}>
      {wallet.connected ? 'Connected' : 'Connect Wallet'}
    </Button>
  );
};

export default observer(ConnectWalletButton);
