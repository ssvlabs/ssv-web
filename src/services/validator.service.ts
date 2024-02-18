import axios from 'axios';
import config from '~app/common/config';
import { retryWithDelay } from '~app/decorators/retriable.decorator';

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

const getOwnerAddressCost = async (ownerAddress: string, skipRetry?: boolean): Promise<any> => {
  try {
    const url = `${config.links.SSV_API_ENDPOINT}/validators/owned_by/${ownerAddress}/cost`;
    return await getData(url, skipRetry);
  } catch (e) {
    return null;
  }
};

const clustersByOwnerAddress = async (query: string, skipRetry?: boolean): Promise<any> => {
  try {
    const url = `${String(config.links.SSV_API_ENDPOINT)}/clusters/owner/${query}&operatorDetails=operatorDetails&ts=${new Date().getTime()}`;
    return await getData(url, skipRetry);
  } catch (e) {
    return { clusters: [], pagination: {} };
  }
};

const validatorsByClusterHash = async (page: number, ownerAddress: string, clusterHash: string, skipRetry?: boolean): Promise<any> => {
  try {
    const url = `${String(config.links.SSV_API_ENDPOINT)}/validators/?&search=${clusterHash}&page=${page}&perPage=7&ts=${new Date().getTime()}`;
    return await getData(url, skipRetry);
  } catch (e) {
    return { clusters: [], pagination: {} };
  }
};

const clusterByHash = async (clusterHash: string): Promise<any> => {
  try {
    const url = `${String(config.links.SSV_API_ENDPOINT)}/clusters/${clusterHash}`;
    return await getData(url, true);
  } catch (e) {
    return { clusters: [], pagination: {} };
  }
};

const getClusterData = async (clusterHash: string): Promise<any> => {
  try {
    const url = `${String(config.links.SSV_API_ENDPOINT)}/clusters/${clusterHash}`;
    return await getData(url, true);
  } catch (e) {
    return null;
  }
};

const getValidator = async (publicKey: string, skipRetry?: boolean) => {
  try {
    const url = `${String(config.links.SSV_API_ENDPOINT)}/validators/${publicKey.replace('0x', '')}?ts=${new Date().getTime()}`;
    return await getData(url, skipRetry);
  } catch (e) {
    return null;
  }
};

export { getOwnerAddressCost, clustersByOwnerAddress, validatorsByClusterHash, clusterByHash, getClusterData, getValidator };
