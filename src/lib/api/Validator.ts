import axios from 'axios';
import { Retryable } from 'typescript-retry-decorator';
import config from '~app/common/config';

class Validator {
  private static instance: Validator;
  private readonly baseUrl: string = '';

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  static getInstance(): Validator {
    if (!Validator.instance) {
      Validator.instance = new Validator(config.links.SSV_API_ENDPOINT);
    }
    return Validator.instance;
  }

  static get NETWORK() {
    return 'prater';
  }

  async getOwnerAddressCost(ownerAddress: string, skipRetry?: boolean): Promise<any> {
    try {
      const url = `${config.links.SSV_API_ENDPOINT}/validators/owned_by/${ownerAddress}/cost`;
      return await this.getData(url, skipRetry);
    } catch (e) {
      return null;
    }
  }

  async clustersByOwnerAddress(query: string, skipRetry?: boolean): Promise<any> {
    try {
      const url = `${String(config.links.SSV_API_ENDPOINT)}/clusters/owner/${query}&operatorDetails=operatorDetails&ts=${new Date().getTime()}`;
      return await this.getData(url, skipRetry);
    } catch (e) {
      return { clusters: [], pagination: {} };
    }
  }

  async validatorsByClusterHash(ownerAddress: string, clusterHash: string, skipRetry?: boolean): Promise<any> {
    try {
      const url = `${String(config.links.SSV_API_ENDPOINT)}/validators/?ownerAddress=${ownerAddress}&search=${clusterHash}&ts=${new Date().getTime()}`;
      return await this.getData(url, skipRetry);
    } catch (e) {
      return { clusters: [], pagination: {} };
    }
  }

  async getClusterData(clusterHash: string): Promise<any> {
    try {
      const url = `${String(config.links.SSV_API_ENDPOINT)}/clusters/${clusterHash}`;
      return await this.getData(url, true);
    } catch (e) {
      return null;
    }
  }

  async getValidator(publicKey: string, skipRetry?: boolean) {
    try {
      const url = `${String(config.links.SSV_API_ENDPOINT)}/validators/${publicKey.replace('0x', '')}?ts=${new Date().getTime()}`;
      return await this.getData(url, skipRetry);
    } catch (e) {
      return null;
    }
  }

  /**
   * Retry few times to get the data
   * @param url
   * @param skipRetry
   */
  @Retryable(config.retry.default)
  async getData(url: string, skipRetry?: boolean) {
    try {
      return (await axios.get(url)).data;
    } catch (e) {
      if (skipRetry) {
        return null;
      }
      throw e;
    }
  }
}

export default Validator;
