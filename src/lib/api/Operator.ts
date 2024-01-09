import axios from 'axios';
import { Retryable } from 'typescript-retry-decorator';
import config from '~app/common/config';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';
import { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import { put } from '~root/services/HttpService';

type OperatorsListQuery = {
  page?: number,
  search?: string,
  type?: string[],
  perPage?: number
  ordering?: string,
  dkgEnabled?: boolean,
};

type OperatorValidatorListQuery = {
  page?: number,
  perPage?: number
  operatorId: number,
};

class Operator {
  private static instance: Operator;
  ownerAddress: string = '';
  private readonly baseUrl: string = '';

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  static get NETWORK() {
    return 'prater';
  }

  static getInstance(): Operator {
    if (!Operator.instance) {
      Operator.instance = new Operator(getStoredNetwork().api);
    }
    return Operator.instance;
  }

  /**
   * Get operators by owner Address
   */
  async getOperatorsByOwnerAddress(page: number = 1, perPage: number = 8, ownerAddress: string, skipRetry?: boolean) {
    const url = `${getStoredNetwork().api}/operators/owned_by/${ownerAddress}?page=${page}&perPage=${perPage}&withFee=true&ts=${new Date().getTime()}&ordering=id:desc`;
    try {
      this.ownerAddress = ownerAddress;
      return await this.getData(url, skipRetry);
    } catch (e) {
      return { operators: [], pagination: {} };
    }
  }

  /**
   * Get operators
   */
  async getOperators(props: OperatorsListQuery, skipRetry?: boolean) {
    const { page, perPage, type, ordering, search, dkgEnabled } = props;
    let url = `${getStoredNetwork().api}/operators?`;
    if (search) url += `search=${search}&`;
    if (ordering) url += `ordering=${ordering}&`;
    if (page) url += `page=${page}&`;
    if (perPage) url += `perPage=${perPage}&`;
    if (type?.length) url += `type=${type.join(',')}&`;
    if (dkgEnabled) url += 'has_dkg_address=true&';
    url += `ts=${new Date().getTime()}`;

    try {
      return await this.getData(url, skipRetry);
    } catch (e) {
      return { operators: [], pagination: {} };
    }
  }

  /**
   * Get operator
   */
  async getOperator(operatorId: number | string, skipRetry?: boolean) {
    const url = `${getStoredNetwork().api}/operators/${operatorId}?performances=24hours&withFee=true&ts=${new Date().getTime()}`;
    try {
      return await this.getData(url, skipRetry);
    } catch (e) {
      return null;
    }
  }

  async getOperatorByPublicKey(publicKey: string, skipRetry: boolean = true) {
    const url = `${getStoredNetwork().api}/operators/public_key/${publicKey}`;
    try {
      return await this.getData(url, skipRetry);
    } catch (e) {
      return null;
    }
  }

  async updateOperatorName(operatorId: string, signature: string, operatorName: string) {
    const url = `${getStoredNetwork().api}/operators/${operatorId}/metadata`;
    try {
      return (await axios.put(url, {
        operatorName,
        signature,
      })).data;
    } catch (e) {
      throw e;
    }
  }


  // TODO - all these should be wrapped with a try catch. On catch the response should be logged and parsed. we should have a defined interface for http.
  async updateOperatorMetadata(operatorId: string, signature: string, operatorMetadata: Record<string, any>) {
    const url = `http://localhost:3000/api/v4/holesky/operators/${operatorId}/metadata`;
    const res = await put(url, {
      ...operatorMetadata,
      signature,
    });
    return res;


    // const [err, resp] = await HttpService().put(url, {
    //   ...operatorMetadata,
    //   signature,
    // });
    // if (!err) {
    //   return resp;
    // }
    // const response = await axios.put(url, {
    //   ...operatorMetadata,
    //   signature,
    // });
  }

  async getOperatorNodes(layer: number): Promise<[]> {
    const url = `${getStoredNetwork().api}/operators/nodes/${layer}`;
    try {
      return await this.getData(url, true);
    } catch (e) {
      return [];
    }
  }

  async getOperatorAvailableLocations(): Promise<[]> {
    const url = `${getStoredNetwork().api}/operators/locations`;
    try {
      return await this.getData(url, true);
    } catch (e) {
      return [];
    }
  }

  async getOperatorsByIds(operatorIds: number[]): Promise<IOperator[]> {
    try {
      const promises = operatorIds.map(operatorId => this.getOperator(operatorId, false));
      const responses = await Promise.all(promises);
      for (let response of responses) {
        if (!response) {
          return [];
        }
      }
      return responses;
    } catch (error) {
      return [];
    }
  }


  /**
   * Get operator validators
   */
  async getOperatorValidators(props: OperatorValidatorListQuery, skipRetry?: boolean) {
    const { page, perPage, operatorId } = props;
    const url = `${getStoredNetwork().api}/validators/in_operator/${operatorId}?page=${page}&perPage=${perPage}&ts=${new Date().getTime()}`;
    try {
      return await this.getData(url, skipRetry);
    } catch (e) {
      return { validators: [], pagination: {} };
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

export default Operator;
