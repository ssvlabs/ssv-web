import { createContext } from 'react';
import WalletStore from '~app/common/stores/WalletStore';
import StoresProvider from '~app/common/stores/StoresProvider';
import NotificationsStore from '~app/common/stores/NotificationsStore';

// Register stores in provider
const storesProvider = StoresProvider.getInstance();
storesProvider.addStore('notifications', new NotificationsStore());
storesProvider.addStore('wallet', new WalletStore());

const rootStore = storesProvider.getStores();
const rootStoreContext = createContext(rootStore);

export {
    rootStore,
};

export default rootStoreContext;
