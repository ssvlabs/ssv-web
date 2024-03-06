import { useConnectWallet } from '@web3-onboard/react';
import { cleanLocalStorageAndCookie } from '~lib/utils/onboardHelper';
import config from '~app/common/config';
import { useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import { resetContracts } from '~root/services/contracts.service';

const useWalletDisconnector = () => {
  const [_, __, disconnect] = useConnectWallet();
  const navigate = useNavigate();
  const stores = useStores();
  const walletStore: WalletStore = stores.Wallet;

  const disconnectWallet = async () => {
    await disconnect({ label: walletStore.wallet.label });
    cleanLocalStorageAndCookie();
    await walletStore.resetUser();
    resetContracts();
    navigate(config.routes.SSV.ROOT);
  };

  return {
    disconnectWallet,
  };
};

export default useWalletDisconnector;
