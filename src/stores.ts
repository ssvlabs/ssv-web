import { createContext } from 'react';
import AppStore from '~app/App.store';
import SSVStore from '~app/common/stores/SSVStore';
import ValidatorsStore from '~app/components/Validators/Validators.store';

const rootStore = {
    app: new AppStore(),
    validators: new ValidatorsStore(),
    wallet: new SSVStore(),
};

const rootStoreContext = createContext(rootStore);

export {
    rootStore,
};

export default rootStoreContext;
