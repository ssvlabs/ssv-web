import { getStoredNetwork } from '~root/providers/networkInfo.provider';
import translations from '../app/common/config/translations';
import { getRequest, postRequest } from '~root/services/httpApi.service';

const getAmountToTransfer = async () => {
  const { faucetApi } = getStoredNetwork();
  const faucetUrl = `${faucetApi}/config`;
  const response = await getRequest(faucetUrl, true);
  if (response && response.length > 0) {
    // TODO refactor whole function
    // applicationStore.strategyRedirect = response[0].transactions_capacity > 0 ? config.routes.FAUCET.ROOT : config.routes.FAUCET.DEPLETED;
    return response[0].amount_to_transfer;
  }
  console.log('[ERROR]: fail to fetch faucet config');
  return 0;
};

const requestSsvFromFaucet = async ({ address }: { address: string }) => {
  const { faucetApi, networkId, apiVersion } = getStoredNetwork();
  try {
    await postRequest(faucetApi, { owner_address: address, networkId: networkId, version: apiVersion }, true);
    return { status: true };
  } catch (e: any) {
    return {
      status: false,
      type: e.response.data.error.message === translations.FAUCET.REACHED_MAX_TRANSACTIONS ? translations.FAUCET.REACHED_MAX_TRANSACTIONS : translations.FAUCET.FAUCET_DEPLETED
    };
  }
};

export { getAmountToTransfer, requestSsvFromFaucet };
