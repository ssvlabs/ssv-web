import { createContext } from 'react';
import SsvStore from '~app/common/stores/Ssv.store';
import WalletStore from '~app/common/stores/Wallet.store';
import StoresProvider from '~app/common/stores/StoresProvider';
import NotificationsStore from '~app/common/stores/Notifications.store';

// Register stores in provider
const storesProvider = StoresProvider.getInstance();
storesProvider.addStore('notifications', new NotificationsStore());
storesProvider.addStore('wallet', new WalletStore());
storesProvider.addStore('ssv', new SsvStore());

const rootStore = storesProvider.getStores();
const rootStoreContext = createContext(rootStore);

export {
    rootStore,
};

export default rootStoreContext;
