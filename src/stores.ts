import { createContext } from 'react';
import WalletStore from '~app/common/stores/Wallet.store';
import StoresProvider from '~app/common/stores/StoresProvider';
import NotificationsStore from '~app/common/stores/Notifications.store';
import ValidatorStore from '~app/common/stores/Validator.store';

// Register stores in provider
const storesProvider = StoresProvider.getInstance();
storesProvider.addStore('notifications', new NotificationsStore());
storesProvider.addStore('wallet', new WalletStore());
storesProvider.addStore('validator', new ValidatorStore());

const rootStore = storesProvider.getStores();
const rootStoreContext = createContext(rootStore);

export {
    rootStore,
};

export default rootStoreContext;
