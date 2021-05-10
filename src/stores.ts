import { createContext } from 'react';
import BaseStore from '~app/common/stores/BaseStore';

const baseStore = BaseStore.getInstance();
const rootStore: Record<string, any> = baseStore.preloadStores([
  'notifications',
  'wallet',
  'ssv',
]);
const rootStoreContext = createContext(rootStore);

export {
    rootStore,
};

export default rootStoreContext;
