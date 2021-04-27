import { createContext } from 'react';
import AppStore from '~app/App.store';
import ValidatorsStore from '~app/components/Validators/Validators.store';

const rootStore = {
    app: new AppStore(),
    validators: new ValidatorsStore(),
};

const rootStoreContext = createContext(rootStore);

export {
    rootStore,
};

export default rootStoreContext;
