import { distributionStore } from './applications/Distribution/Distribution.store';
import { distributionTestnetStore } from './applications/Distribution/DistributionTestnet.store';
import { myAccountStore } from './applications/SsvWeb/MyAccount.store';
import { operatorStore } from './applications/SsvWeb/Operator.store';
import { operatorMetadataStore } from './applications/SsvWeb/OperatorMetadata.store';
import { processStore } from './applications/SsvWeb/Process.store';
import { ssvStore } from './applications/SsvWeb/SSV.store';
import { validatorStore } from './applications/SsvWeb/Validator.store';

const _stores = {
  SSV: ssvStore,
  Process: processStore,
  Operator: operatorStore,
  Validator: validatorStore,
  MyAccount: myAccountStore,
  Distribution: distributionStore,
  OperatorMetadata: operatorMetadataStore,
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
   * Capitalize store name to match the class name in folder
   * @param name
   */
  capitalize(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  applicationStrategy(): string {
    if (import.meta.env.VITE_FAUCET_PAGE) {
      return 'Faucet';
    }
    if (import.meta.env.VITE_CLAIM_PAGE) {
      return 'Distribution';
    }
    return 'SsvWeb';
  }

  /**
   * Get registered store by name, and if it was not registered before, register it on the fly.
   *
   * Store names should be consistent, example:
   *  contract/ContractValidator.store.ts -> this.getStore('contracts/ContractValidator')
   *  contract/ContractOperator.store.ts  -> this.getStore('contracts/ContractValidator')
   *  foo/FooBar.store.ts                 -> this.getStore('foo/FooBar')
   *
   * In case when useStores() hook is used, you can get store as following, regardless of folder prefix:
   *  const stores = useStores();
   *  const contractValidator: ContractValidator = stores.ContractValidator;
   *  const fooBar: FooBar = stores.FooBar;
   *
   * @param name
   */
  getStore(name: keyof typeof _stores): any {
    return _stores[name];
  }

  /**
   * Bunch stores loading
   * @param stores
   */
  preloadStores(): Record<string, any> {
    return this.getStores();
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
