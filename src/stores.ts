import { createContext } from 'react';
import BaseStore from '~app/common/stores/BaseStore';

const stores = [
  'SSV',
  'Event',
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
  'Application',
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
