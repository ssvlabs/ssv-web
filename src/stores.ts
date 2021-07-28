import { createContext } from 'react';
import BaseStore from '~app/common/stores/BaseStore';

const stores = [
  'Application',
  'Notifications',
  'Wallet',
  'Upgrade',
  'contract/ContractOperator',
  'contract/ContractValidator',
];
const rootStore: Record<string, any> = BaseStore.getInstance().preloadStores(stores);
const rootStoreContext = createContext(rootStore);

export {
    rootStore,
};

export default rootStoreContext;
