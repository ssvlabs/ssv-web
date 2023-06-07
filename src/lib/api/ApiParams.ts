class ApiParams {
  static PER_PAGE: number = 8;
  static DEFAULT_PAGINATION = {
    page: 1,
    pages: 1,
    total: 0,
    per_page: ApiParams.PER_PAGE,
  };

  /**
   * Try to parse page value from the url
   */
  static getInteger(entity: string, name: string, defaultValue?: number): number {
    try {
      ApiParams.initStorage();
      const params = ApiParams.getFromStorage(entity);
      const param = parseInt(String(params[name] ?? defaultValue), 10);
      ApiParams.saveInStorage(entity, name, param);
      return param;
    } catch (e) {
      return defaultValue ?? 0;
    }
  }

  /**
   * Clean history
   */
  static cleanStorage(): void {
    window.localStorage.removeItem('params');
  }

  /**
   * Get value from storage
   * @param name
   */
  static getFromStorage(name: string): any {
    ApiParams.initStorage();
    return ApiParams.getStorage()[name];
  }

  /**
   * Save value in storage
   * @param entity
   * @param name
   * @param value
   */
  static saveInStorage(entity: string, name: string, value: any) {
    ApiParams.initStorage();
    const storage = this.getStorage();
    storage[entity] = storage[entity] || ApiParams.DEFAULT_PAGINATION;
    storage[entity][name] = value;
    try {
      window.localStorage.setItem('params', JSON.stringify(storage));
    } catch (e) {
      console.error('Unable to use localStorage');
    }
  }

  /**
   * Get all storage
   */
  static getStorage() {
    ApiParams.initStorage();
    try {
      return JSON.parse(<string>window.localStorage.getItem('params'));
    } catch (e) {
      console.error('Unable to use localStorage');
      return {};
    }
  }

  /**
   * Initialize storage
   */
  static initStorage(force: boolean = false) {
    try {
      if (!window.localStorage.getItem('params') || force) {
        window.localStorage.setItem('params', JSON.stringify({
          validators: {
            page: 1,
            perPage: ApiParams.PER_PAGE,
          },
          operators: {
            page: 1,
            perPage: ApiParams.PER_PAGE,
          },
        }));
      }
    } catch (e) {
      console.error('Unable to use localStorage');
    }
  }
}

export default ApiParams;
