const localStateProvider = window.localStorage;

const getFromLocalStorageByKey = (key: string) => localStateProvider.getItem(key);

const saveInLocalStorage = (key: string, value: string) => localStateProvider.setItem(key, value);

const removeFromLocalStorageByKey = (key: string) => localStateProvider.removeItem(key);

const clearLocalStorage = () => localStateProvider.clear();

export { getFromLocalStorageByKey, saveInLocalStorage, removeFromLocalStorageByKey, clearLocalStorage };
