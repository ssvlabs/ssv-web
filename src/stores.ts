import { createContext } from 'react';
import BaseStore from '~app/common/stores/BaseStore';

const rootStore = BaseStore.getInstance().getStores();
const rootStoreContext = createContext(rootStore);

export { rootStore };

export default rootStoreContext;
