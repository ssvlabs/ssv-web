import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import { useEffect } from 'react';
import { cleanLocalStorageAndCookie } from '~lib/utils/onboardHelper';
import config from '~app/common/config';
import { useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import { resetContracts } from '~root/services/contracts.service';

const useWalletDisconnector = () => {
  const [{ wallet }, connect, disconnect] = useConnectWallet();
  const [{ connectedChain }] = useSetChain();
  const navigate = useNavigate();
  const stores = useStores();
  const walletStore: WalletStore = stores.Wallet;

  // useEffect(() => {
  //   if (walletStore.wallet) {
  //     cleanLocalStorageAndCookie();
  //     disconnect({ label: walletStore.wallet.label });
  //     walletStore.initWallet(null, null);
  //     navigate(config.routes.SSV.ROOT);
  //   } else {
  //     walletStore.initWallet(wallet, connectedChain);
  //   }
  // }, [walletStore.wallet]);

  const disconnectWallet = async () => {
    cleanLocalStorageAndCookie();
    await disconnect({ label: walletStore.wallet.label });
    await walletStore.resetUser();
    resetContracts();
    navigate(config.routes.SSV.ROOT);
  };


  return {
    disconnectWallet,
  };
};

export default useWalletDisconnector;
