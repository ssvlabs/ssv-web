import config from '~app/common/config';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStores } from '~app/hooks/useStores';
import { IMerkleData } from '~app/model/merkleTree.model';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';
import { getRequest } from '~root/services/httpApi.service';
import { ethers } from 'ethers';
import { EIP1193Provider } from '@web3-onboard/core';

const registerSSVTokenInMetamask = async ({ provider }: { provider: EIP1193Provider }) => {
  const stores = useStores();
  const notificationsStore: NotificationsStore = stores.Notifications;
  const wrappedProvider = new ethers.providers.Web3Provider(provider, 'any');
  try {
    await wrappedProvider.send('wallet_watchAsset', [{
      type: 'ERC20',
      options: {
        address: config.CONTRACTS.SSV_TOKEN.ADDRESS,
        symbol: 'SSV',
        decimals: 18,
      },
    }]);
    notificationsStore.showMessage('Can not add SSV to wallet!', 'error');
  } catch (error: any) {
    console.error('Can not add SSV token to wallet', error);
    notificationsStore.showMessage(`Can not add SSV to wallet: ${error.message}`, 'error');
  }
};

const fetchMerkleTreeStructure = async (): Promise<IMerkleData | null> => {
  const { api } = getStoredNetwork();
  const merkleTreeUrl = `${api}/incentivization/merkle-tree`;
  try {
    return await getRequest(merkleTreeUrl, true);
  }
  catch (error) {
    console.log('Failed to check reward eligibility');
    return null;
  }
};

export { registerSSVTokenInMetamask, fetchMerkleTreeStructure };
