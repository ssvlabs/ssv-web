import React from 'react';
import { observer } from 'mobx-react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Routes from '~app/components/Routes';
import { useStores } from '~app/hooks/useStores';
import AppBar from '~app/common/components/AppBar';
import BarMessage from '~app/common/components/BarMessage';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import ContractOperator from '~app/common/stores/contract/ContractOperator.store';

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

const App = () => {
  const stores = useStores();
  const walletStore: WalletStore = stores.Wallet;
  const operatorStore: ContractOperator = stores.ContractOperator;
  React.useEffect(() => {
    operatorStore.loadOperators;
    walletStore.checkConnection();
  }, []);

  return (
    <>
      <BarMessage />
      <AppBar />
      <Routes />
      <CssBaseline />
    </>
  );
};

export default observer(App);
