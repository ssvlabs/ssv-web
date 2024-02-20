import axios from 'axios';
import { action, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import ApiParams from '~lib/api/ApiParams';
import Validator from '~lib/api/Validator';
import { ENV } from '~lib/utils/envHelper';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import { formatNumberFromBeaconcha, formatNumberToUi } from '~lib/utils/numbers';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ClusterStore from '~app/common/stores/applications/SsvWeb/Cluster.store';

const INTERVAL_TIME = 30000;

class MyAccountStore extends BaseStore {
  // GLOBAL
  operatorsInterval: any = null;
  validatorsInterval: any = null;
  lastUpdateOperators: number | undefined;
  lastUpdateValidators: number | undefined;

  // OPERATOR
  ownerAddressOperators: any = [];
  ownerAddressOperatorsPagination: any = ApiParams.DEFAULT_PAGINATION;

  // VALIDATOR
  ownerAddressClusters: any = [];
  ownerAddressClustersPagination: any = ApiParams.DEFAULT_PAGINATION;

  // BEACONCHAIN
  beaconChaBalances: any = {};
  beaconChaPerformances: any = {};

  constructor() {
    // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
    super();

    makeObservable(this, {
      setIntervals: action.bound,
      getValidator: action.bound,
      clearIntervals: action.bound,
      beaconChaBalances: observable,
      operatorsInterval: observable,
      validatorsInterval: observable,
      lastUpdateOperators: observable,
      lastUpdateValidators: observable,
      getOperatorRevenue: action.bound,
      ownerAddressOperators: observable,
      getOperatorsRevenue: action.bound,
      beaconChaPerformances: observable,
      ownerAddressClusters: observable,
      getOwnerAddressClusters: action.bound,
      getOwnerAddressOperators: action.bound,
      ownerAddressOperatorsPagination: observable,
      ownerAddressClustersPagination: observable,
    });
  }

  clearIntervals() {
    clearInterval(this.operatorsInterval);
    clearInterval(this.validatorsInterval);
    this.ownerAddressOperators = [];
    this.ownerAddressClusters = [];
    this.ownerAddressOperatorsPagination = ApiParams.DEFAULT_PAGINATION;
    this.ownerAddressClustersPagination = ApiParams.DEFAULT_PAGINATION;
  }

  /**
   * Returns true if entity exists in account, false otherwise
   * @param entity
   * @param identifierName
   * @param currentValue
   */
  async checkEntityInAccount(entity: string, identifierName: string, currentValue: any): Promise<boolean> {
    try {
      let method: any;
      switch (entity) {
        case 'cluster':
          method = 'getOwnerAddressClusters';
          break;
        case 'operator':
          method = 'getOwnerAddressOperators';
          break;
        default:
          // @ts-ignore
          throw new Error(`MyAccountStore::checkEntityInAccount: "${entity}" entity is not supported`);
      }
      // @ts-ignore
      const entities: any = await this[method]({});
      return (entities || []).filter((e: any) => {
        return currentValue === e[identifierName];
      }).length > 0;
    } catch (e) {
      console.error('MyAccountStore::checkEntityInAccount Error:', e);
      return false;
    }
  }

  /**
   * Returns true if entity has been changed, otherwise returns false
   * @param getter
   * @param valueBefore
   */
  async checkEntityChangedInAccount(getter: any, valueBefore: any): Promise<boolean> {
    try {
      const valueAfter = await getter();
      return JSON.stringify(valueBefore) !== JSON.stringify(valueAfter);
    } catch (e) {
      console.error('MyAccountStore::checkEntityChangedInAccount', e);
      return false;
    }
  }

  /**
   * Do some delay in a flow
   * @param ms
   */
  async delay(ms?: number) {
    return new Promise((r) => setTimeout(() => r(true), ms || 1000));
  }

  setIntervals() {
    this.validatorsInterval = setInterval(() => {
      // @ts-ignore
      const diffTime = Date.now() - this.lastUpdateValidators;
      if (Math.floor((diffTime / 1000) % 60) < INTERVAL_TIME) return;
      this.getOwnerAddressClusters({});
    }, INTERVAL_TIME);

    this.operatorsInterval = setInterval(() => {
      // @ts-ignore
      const diffTime = Date.now() - this.lastUpdateOperators;
      if (Math.floor((diffTime / 1000) % 60) < INTERVAL_TIME) return;
      this.getOwnerAddressOperators({});
    }, INTERVAL_TIME);
  }

  async getOwnerAddressOperators({ forcePage, forcePerPage }: { forcePage?: number, forcePerPage?: number }): Promise<void> {
    const { page, per_page } = this.ownerAddressOperatorsPagination;
    const walletStore: WalletStore = this.getStore('Wallet');
    if (!walletStore.accountAddress) return;
    const response = await Operator.getInstance().getOperatorsByOwnerAddress(forcePage ?? page, forcePerPage ?? per_page, walletStore.accountAddress);
    this.ownerAddressOperatorsPagination = response.pagination;
    this.ownerAddressOperators = await this.getOperatorsRevenue(response.operators);
    this.lastUpdateOperators = Date.now();
    return this.ownerAddressOperators;
  }

  async getOperatorRevenue(operator: any) {
    const operatorStore: OperatorStore = this.getStore('Operator');
    // eslint-disable-next-line no-param-reassign
    operator.revenue = await operatorStore.getOperatorRevenue(operator.id);
    return operator;
  }

  async getOperatorsRevenue(operatorsList: any) {
    return Promise.all(operatorsList.map((operator: any) => this.getOperatorRevenue(operator)));
  }

  async getValidator(publicKey: string, skipRetry?: boolean): Promise<any> {
    const validator = await Validator.getInstance().getValidator(publicKey, skipRetry);
    const validatorPublicKey = `0x${validator.public_key}`;
    const validatorBalance = formatNumberFromBeaconcha(this.beaconChaBalances[validatorPublicKey]?.balance);
    // eslint-disable-next-line no-await-in-loop
    const performance7days = this.beaconChaPerformances[validator.public_key] ? formatNumberFromBeaconcha(this.beaconChaPerformances[validator.public_key].performance7d) : 0;
    // @ts-ignore
    const apr = formatNumberToUi(((performance7days / 32) * 100) * config.GLOBAL_VARIABLE.NUMBERS_OF_WEEKS_IN_YEAR);
    return {
      apr,
      status: validator.status,
      balance: validatorBalance,
      operators: validator.operators,
      public_key: validator.public_key,
    };
  }

  async getOwnerAddressClusters({ forcePage, forcePerPage }: { forcePage?: number, forcePerPage?: number, reFetchBeaconData?: boolean }): Promise<any[]> {
    const walletStore: WalletStore = this.getStore('Wallet');
    const clusterStore: ClusterStore = this.getStore('Cluster');
    if (!walletStore.accountAddress) return [];
    const { page, per_page } = this.ownerAddressClustersPagination;
    const query = `${walletStore.accountAddress}?page=${forcePage ?? page}&perPage=${(forcePerPage ?? per_page)}`;
    const response = await Validator.getInstance().clustersByOwnerAddress(query, true);
    if (!response) return [];
    // @ts-ignore
    this.ownerAddressClustersPagination = response.pagination;
    this.ownerAddressClusters = await Promise.all(response?.clusters.map((cluster: any) => clusterStore.extendClusterEntity(cluster))) || [];
    this.ownerAddressClusters = this.ownerAddressClusters.filter((cluster: any) => cluster.validatorCount > 0 || !cluster.isLiquidated);
    return this.ownerAddressClusters;
  }

  async getValidatorsBalances(publicKeys: string[]): Promise<void> {
    try {
      const balanceUrl = `${ENV().BEACONCHA_URL}/api/v1/validator/${publicKeys.join(',')}`;
      const response: any = (await axios.get(balanceUrl, { timeout: 2000 })).data;
      let responseData = response.data;
      if (!Array.isArray(responseData)) {
        responseData = [responseData];
      }
      this.beaconChaBalances = responseData.reduce((obj: any, item: { pubkey: any; value: any; }) => ({
        ...obj,
        [item.pubkey]: item,
      }), {});
    } catch (e) {
      console.log('[ERROR]: fetch balances from beacon failed');
    }
  }

  getValidatorPerformance = async (publicKey: string): Promise<void> => {
    const url = `${ENV().BEACONCHA_URL}/api/v1/validator/${publicKey}/performance`;
    try {
      const performance = (await axios.get(url)).data;
      this.beaconChaPerformances[publicKey] = performance.data;
    } catch (e: any) {
      console.log('[ERROR]: fetch performances from beacon failed');
    }
  };
}

export default MyAccountStore;
