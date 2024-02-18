import axios from 'axios';
import { retryWithDelay } from '~app/decorators/retriable.decorator';
import config from '~app/common/config';
import { web3 } from 'ssv-keys/dist/tsc/src/lib/helpers/web3.helper';

const getData = async (url: string, skipRetry?: boolean) => {
  try {
    return (await axios.get(url)).data;
  } catch (e) {
    if (skipRetry) {
      return null;
    }
    return await retryWithDelay({ caller: async () => (await axios.get(url)).data, ...config.retry.default });
  }
};

const getAccountData = async (publicKey: string) => {
  try {
    const url = `${String(config.links.SSV_API_ENDPOINT)}/accounts/${web3.utils.toChecksumAddress(publicKey)}`;
    return await getData(url);
  } catch (e) {
    return null;
  }
};

export { getAccountData };
