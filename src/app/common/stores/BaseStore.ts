/**
 * Base store provides singe source of true
 * for keeping all stores instances in one place
 */
class BaseStore {
  protected static stores: Record<string, any> = {};
  protected static instance: BaseStore | null = null;

  /**
   * Return stores registry to use it in provider and context
   */
  getStores() {
    return BaseStore.stores;
  }

  /**
   * Capitalize store name to match the class name in folder
   * @param name
   */
  capitalize(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  /**
   * Get registered store by name
   * @param name
   */
  getStore(name: string): any {
    if (!BaseStore.stores[name]) {
      const StoreClass: any = require(`~app/common/stores/${this.capitalize(name)}.store`).default;
      BaseStore.stores[name] = new StoreClass();
    }
    return BaseStore.stores[name];
  }

  /**
   * Bunch stores loading
   * @param stores
   */
  preloadStores(stores: string[]): Record<string, any> {
    stores.map((store: string) => {
      return this.getStore(store);
    });
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
