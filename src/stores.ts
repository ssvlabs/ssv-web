import { createContext } from 'react';
import BaseStore from '~app/common/stores/BaseStore';

const stores = [
    'SSV',
    'Wallet',
    'Event',
    'Faucet',
    'Operator',
    'MyAccount',
    'Validator',
    'Application',
    'Distribution',
    'Notifications',
];
const rootStore: Record<string, any> = BaseStore.getInstance().preloadStores(stores);
const rootStoreContext = createContext(rootStore);

export {
    rootStore,
};

export default rootStoreContext;
