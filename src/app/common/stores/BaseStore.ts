import { distributionStore } from './applications/Distribution/Distribution.store';
import { distributionTestnetStore } from './applications/Distribution/DistributionTestnet.store';
import { validatorStore } from './applications/SsvWeb/Validator.store';

const _stores = {
  Validator: validatorStore,
  Distribution: distributionStore,
  DistributionTestnet: distributionTestnetStore
} as const;

/**
 * Base store provides singe source of true
 * for keeping all stores instances in one place
 */
class BaseStore {
  // protected static stores: Record<string, any> = {};
  protected static instance: BaseStore | null = null;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() {}

  /**
   * Return stores registry to use it in provider and context
   */
  getStores(): typeof _stores {
    return _stores;
  }

  /**
   * Singleton guarantees single source of stores for all usages
   */
  static getInstance() {
    if (!BaseStore.instance) {
      BaseStore.instance = new BaseStore();
    }
    return BaseStore.instance;
  }
}

export default BaseStore;
