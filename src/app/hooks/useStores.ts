import { useContext } from 'react';
import rootStore from '~root/stores';

export const useStores = () => useContext(rootStore);
