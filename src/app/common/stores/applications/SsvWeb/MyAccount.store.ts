import axios from 'axios';
import { action, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
// import Validator from '~lib/api/Validator';
import ApiParams from '~lib/api/ApiParams';
import Validator from '~lib/api/Validator';
import BaseStore from '~app/common/stores/BaseStore';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import SSVStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import { formatNumberFromBeaconcha, formatNumberToUi } from '~lib/utils/numbers';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';

const INTERVAL_TIME = 12000;

class MyAccountStore extends BaseStore {
  static CHECK_UPDATES_MAX_ITERATIONS = 60;

  // GLOBAL
  forceBigList: boolean = false;
  operatorsInterval: any = null;
  validatorsInterval: any = null;
  lastUpdateOperators: number | undefined;
  lastUpdateValidators: number | undefined;

  // OPERATOR
  ownerAddressOperators: any = [];
  ownerAddressOperatorsPagination: any = ApiParams.DEFAULT_PAGINATION;

  // VALIDATOR
  ownerAddressValidators: any = [];
  ownerAddressValidatorsPagination: any = ApiParams.DEFAULT_PAGINATION;

  // BEACONCHAIN
  beaconChaBalances: any = {};
  beaconChaPerformances: any = {};

  constructor() {
    // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
    super();

    makeObservable(this, {
      forceBigList: observable,
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
      ownerAddressValidators: observable,
      getOwnerAddressOperators: action.bound,
      getOwnerAddressValidators: action.bound,
      ownerAddressOperatorsPagination: observable,
      ownerAddressValidatorsPagination: observable,
    });
  }

  clearIntervals() {
    clearInterval(this.operatorsInterval);
    clearInterval(this.validatorsInterval);
    this.ownerAddressOperators = [];
    this.ownerAddressValidators = [];
    this.ownerAddressOperatorsPagination = ApiParams.DEFAULT_PAGINATION;
    this.ownerAddressValidatorsPagination = ApiParams.DEFAULT_PAGINATION;
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
        case 'validator':
          method = 'getOwnerAddressValidators';
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
      this.getOwnerAddressValidators({});
    }, INTERVAL_TIME);

    this.operatorsInterval = setInterval(() => {
      // @ts-ignore
      const diffTime = Date.now() - this.lastUpdateOperators;
      if (Math.floor((diffTime / 1000) % 60) < INTERVAL_TIME) return;
      this.getOwnerAddressOperators({});
    }, INTERVAL_TIME);
  }

  async getOwnerAddressOperators(
    {
                                     forcePage,
                                     forcePerPage,
                                   }: { forcePage?: number, forcePerPage?: number },
  ): Promise<void> {
    const { page, perPage } = this.ownerAddressOperatorsPagination;
    const walletStore: WalletStore = this.getStore('Wallet');
    if (!walletStore.accountAddress) return;
    const response = await Operator.getInstance().getOperatorsByOwnerAddress(forcePage ?? page, this.forceBigList ? 10 : forcePerPage ?? perPage, walletStore.accountAddress);
    response.pagination.perPage = response.pagination.per_page;
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

  async getOwnerAddressValidators(
    {
                                      forcePage,
                                      forcePerPage,
                                      reFetchBeaconData,
                                    }: { forcePage?: number, forcePerPage?: number, reFetchBeaconData?: boolean },
  ): Promise<any[]> {
    const walletStore: WalletStore = this.getStore('Wallet');
    if (!walletStore.accountAddress) return [];
    const ssvStore: SSVStore = this.getStore('SSV');
    const { page, perPage } = this.ownerAddressValidatorsPagination;
    const query = `?search=${walletStore.accountAddress}&ordering=public_key:asc&page=${forcePage ?? page}&perPage=${this.forceBigList ? 10 : (forcePerPage ?? perPage)}&operators=true`;
    const response = await Validator.getInstance().validatorsByOwnerAddress(query, true);
    const responseValidators = response?.validators || [];

    if (reFetchBeaconData) {
      const validatorsPublicKey = responseValidators.map(({ public_key }: { public_key: string }) => public_key);
      await this.getValidatorsBalances(validatorsPublicKey);
      // eslint-disable-next-line no-restricted-syntax
      for (const publicKey of validatorsPublicKey) {
        // eslint-disable-next-line no-await-in-loop
        await this.getValidatorPerformance(publicKey);
      }
    }
    const extendedValidators = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const validator of responseValidators) {
      const validatorPublicKey = `0x${validator.public_key}`;
      const validatorBalance = formatNumberFromBeaconcha(this.beaconChaBalances[validatorPublicKey]?.balance);
      // eslint-disable-next-line no-await-in-loop
      const performance7days = this.beaconChaPerformances[validator.public_key] ? formatNumberFromBeaconcha(this.beaconChaPerformances[validator.public_key]?.performance7d) : 0;
      // @ts-ignore
      const apr = formatNumberToUi(((performance7days / 32) * 100) * config.GLOBAL_VARIABLE.NUMBERS_OF_WEEKS_IN_YEAR);
      extendedValidators.push({
        public_key: validator.public_key,
        status: validator.status,
        balance: validatorBalance,
        apr,
      });
    }

    if (!response) {
      return this.ownerAddressValidators;
    }

    ssvStore.setUserState('validator');
    response.pagination.perPage = response?.pagination?.per_page;
    this.ownerAddressValidatorsPagination = response.pagination;
    this.ownerAddressValidators = extendedValidators;
    this.lastUpdateValidators = Date.now();
    return this.ownerAddressValidators;
  }

  async getValidatorsBalances(publicKeys: string[]): Promise<void> {
    try {
      const balanceUrl = `${getBaseBeaconchaUrl()}/api/v1/validator/${publicKeys.join(',')}`;
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
    const url = `${getBaseBeaconchaUrl()}/api/v1/validator/${publicKey}/performance`;
    try {
      const performance = (await axios.get(url)).data;
      this.beaconChaPerformances[publicKey] = performance.data;
    } catch (e: any) {
      console.log('[ERROR]: fetch performances from beacon failed');
    }
  };
}

export default MyAccountStore;
