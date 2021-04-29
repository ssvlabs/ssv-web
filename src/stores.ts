import { createContext } from 'react';
import AppStore from '~app/common/stores/App.store';
import ContractStore from '~app/common/stores/Contract.store';
import ValidatorStore from '~app/common/stores/Validator.store';

const rootStore = {
    app: new AppStore(),
    wallet: new ContractStore(),
    validator: new ValidatorStore(),
};

const rootStoreContext = createContext(rootStore);

export {
    rootStore,
};

export default rootStoreContext;
