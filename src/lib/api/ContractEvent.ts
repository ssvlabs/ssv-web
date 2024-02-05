import axios from 'axios';
import { Retryable } from 'typescript-retry-decorator';
import config from '~app/common/config';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';

class ContractEvent {
  private static instance: ContractEvent;
  private readonly baseUrl: string = '';

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  static getInstance(): ContractEvent {
    if (!ContractEvent.instance) {
      ContractEvent.instance = new ContractEvent(getStoredNetwork().api);
    }
    return ContractEvent.instance;
  }

  async getEventByTxHash(txHash: string) {
    try {
      const url = `${getStoredNetwork().api}/events/${txHash}`;
      return await this.getData(url, false);
    } catch (e) {
      return null;
    }
  }

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

export default ContractEvent;
