import config from '~app/common/config';
import { getRequest } from '~root/services/httpApi.service';
import { web3 } from 'ssv-keys/dist/tsc/src/lib/helpers/web3.helper';

const getAccountData = async (publicKey: string) => {
  try {
    const url = `${String(config.links.SSV_API_ENDPOINT)}/accounts/${web3.utils.toChecksumAddress(publicKey)}`;
    return await getRequest(url);
  } catch (e) {
    return null;
  }
};

export { getAccountData };
