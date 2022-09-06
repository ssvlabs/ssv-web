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
      Validator.instance = new Validator(config.links.EXPLORER_CENTER);
    }
    return Validator.instance;
  }

  static get NETWORK() {
    return 'prater';
  }

  async getOwnerAddressCost(ownerAddress: string, skipRetry?: boolean): Promise<any> {
    try {
      const url = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/validators/owned_by/${ownerAddress}/cost`;
      return await this.getData(url, skipRetry);
    } catch (e) {
      return null;
    }
  }

  async validatorsByOwnerAddress(query: string, skipRetry?: boolean): Promise<any> {
    try {
      const url = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/validators${query}&ts=${new Date().getTime()}`;
      return await this.getData(url, skipRetry);
    } catch (e) {
      return { validators: [], pagination: {} };
    }
  }

  async getValidator(publicKey: string, skipRetry?: boolean) {
    try {
      const url = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}/validators/${publicKey.replace('0x', '')}?ts=${new Date().getTime()}`;
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
