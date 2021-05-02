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
   * Get registered store by name
   * @param name
   */
  getStore(name: string): any {
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
