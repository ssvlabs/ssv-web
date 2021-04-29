import { createContext } from 'react';
import AppStore from '~app/common/stores/App.store';
import ContractStore from '~app/common/stores/Contract.store';

const rootStore = {
    app: new AppStore(),
    wallet: new ContractStore(),
};

const rootStoreContext = createContext(rootStore);

export {
    rootStore,
};

export default rootStoreContext;
