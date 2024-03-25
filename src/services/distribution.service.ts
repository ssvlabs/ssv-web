import config from '~app/common/config';
import { IMerkleData } from '~app/model/merkleTree.model';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';
import { getRequest } from '~root/services/httpApi.service';
import { ethers } from 'ethers';
import { EIP1193Provider } from '@web3-onboard/core';
import { AlertColor } from '@mui/material/Alert';

type NotificationHandler =  ({ message, severity }: { message: string; severity: AlertColor }) => void;

const registerSSVTokenInMetamask = async ({ provider, notificationHandler }: { provider: EIP1193Provider; notificationHandler: NotificationHandler }) => {
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
    notificationHandler({ message: 'Added SSV token to the wallet!', severity: 'success' });
  } catch (error: any) {
    console.error('Can not add SSV token to wallet', error);
    notificationHandler({ message: `Failed to add SSV token to the wallet: ${error.message}`, severity: 'error' });
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
