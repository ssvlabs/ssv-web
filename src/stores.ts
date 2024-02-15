import { createContext } from 'react';
import BaseStore from '~app/common/stores/BaseStore';

const stores = [
  'SSV',
  'Wallet',
  'Faucet',
  'Process',
  'Cluster',
  'Account',
  'Checkbox',
  'Operator',
  'Validator',
  'MyAccount',
  'Migration',
  'Distribution',
  'Notifications',
  'OperatorMetadata',
  'DistributionTestnet',
];
const rootStore: Record<string, any> = BaseStore.getInstance().preloadStores(stores);
const rootStoreContext = createContext(rootStore);

export {
  rootStore,
};

export default rootStoreContext;
