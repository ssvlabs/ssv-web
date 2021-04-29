import { createContext } from 'react';
import MessageStore from '~app/common/stores/Message.store';
import ContractStore from '~app/common/stores/Contract.store';

const message = new MessageStore();
const wallet = new ContractStore(message);

const rootStore = {
    wallet,
    message,
};

const rootStoreContext = createContext(rootStore);

export {
    rootStore,
};

export default rootStoreContext;
