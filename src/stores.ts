import { createContext } from 'react';
import AppStore from '~app/App.store';
import WalletStore from '~app/common/stores/Wallet.store';
import ValidatorsStore from '~app/components/Validators/Validators.store';

const rootStore = {
    app: new AppStore(),
    validators: new ValidatorsStore(),
    wallet: new WalletStore(),
};

const rootStoreContext = createContext(rootStore);

export {
    rootStore,
};

export default rootStoreContext;
