import { createContext } from 'react';
import AppStore from '~app/common/stores/App.store';
import SSVStore from '~app/common/stores/SSV.store';

const rootStore = {
    app: new AppStore(),
    wallet: new SSVStore(),
};

const rootStoreContext = createContext(rootStore);

export {
    rootStore,
};

export default rootStoreContext;
