import { useConnectWallet } from '@web3-onboard/react';
import { cleanLocalStorageAndCookie } from '~root/providers/onboardSettings.provider';
import config from '~app/common/config';
import { useNavigate } from 'react-router-dom';
import { resetContracts } from '~root/services/contracts.service';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { getWalletLabel, resetWallet } from '~app/redux/wallet.slice';
import { removeFromLocalStorageByKey } from '~root/providers/localStorage.provider';
import { store } from '~app/store';
import { setStrategyRedirect } from '~app/redux/navigation.slice';
import { useStores } from '~app/hooks/useStores';
import OperatorStore from '../common/stores/applications/SsvWeb/Operator.store';

const useWalletDisconnector = () => {
  const [,, disconnect] = useConnectWallet();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const label = useAppSelector(getWalletLabel);

  const stores = useStores();
  const operatorStore: OperatorStore = stores.Operator;

  const resetWalletAndStores = async () => {
    dispatch(resetWallet());
    operatorStore.clearSettings();
    removeFromLocalStorageByKey('params');
    store.dispatch(setStrategyRedirect(config.routes.SSV.ROOT));
  };

  const disconnectWallet = async () => {
    label && await disconnect({ label });
    cleanLocalStorageAndCookie();
    await resetWalletAndStores();
    resetContracts();
    navigate(config.routes.SSV.ROOT);
  };

  return {
    resetWalletAndStores,
    disconnectWallet,
  };
};

export default useWalletDisconnector;
