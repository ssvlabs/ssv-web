// eslint-disable-next-line max-classes-per-file
import React from 'react';

/**
 * Flexible way to work with stores from another stores
 */
class StoresProvider {
  protected stores: Record<string, any> = {};
  protected static instance: StoresProvider | null = null;

  /**
   * Add store to registry
   * @param name
   * @param store
   */
  addStore(name: string, store: any) {
    this.stores[name] = store;
  }

  /**
   * Return stores registry to use it in provider and context
   */
  getStores() {
    return this.stores;
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
    if (!this.stores[name]) {
      this.stores[name] = React.lazy(() => import(`~app/common/stores/${this.capitalize(name)}.store`));
    }
    return this.stores[name] ?? null;
  }

  /**
   * Singleton guarantees single source of stores for all usages
   */
  static getInstance() {
    if (!StoresProvider.instance) {
      StoresProvider.instance = new StoresProvider();
    }
    return StoresProvider.instance;
  }
}

export default StoresProvider;
