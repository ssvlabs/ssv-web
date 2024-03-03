import { getStoredNetwork } from '~root/providers/networkInfo.provider';
import { getRequest } from '~root/services/httpApi.service';

const getEventByTxHash = async (txHash: string) => {
  try {
    const url = `${getStoredNetwork().api}/events/${txHash}`;
    return await getRequest(url, false);
  } catch (e) {
    return null;
  }
};

export { getEventByTxHash };
