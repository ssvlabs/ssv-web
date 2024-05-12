import { useNavigate } from 'react-router-dom';
import { useAccountEffect, useDisconnect } from 'wagmi';
import config from '~app/common/config';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { useStores } from '~app/hooks/useStores';
import { setStrategyRedirect } from '~app/redux/navigation.slice';
import { getWalletLabel, resetWallet } from '~app/redux/wallet.slice';
import { store } from '~app/store';
import { removeFromLocalStorageByKey } from '~root/providers/localStorage.provider';
import { cleanLocalStorageAndCookie } from '~root/providers/onboardSettings.provider';
import { resetContracts } from '~root/services/contracts.service';
import OperatorStore from '../common/stores/applications/SsvWeb/Operator.store';
import SsvStore from '../common/stores/applications/SsvWeb/SSV.store';

const useWalletDisconnector = () => {
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const label = useAppSelector(getWalletLabel);

  const stores = useStores();
  const ssvStore: SsvStore = stores.SSV;
  const operatorStore: OperatorStore = stores.Operator;

  const resetWalletAndStores = async () => {
    ssvStore.clearUserSyncInterval();
    dispatch(resetWallet());
    ssvStore.clearSettings();
    operatorStore.clearSettings();
    removeFromLocalStorageByKey('params');
    store.dispatch(setStrategyRedirect(config.routes.SSV.ROOT));
  };

  const disconnectWallet = async () => {
    label && (await disconnect(/* { label } */));
    cleanLocalStorageAndCookie();
    await resetWalletAndStores();
    resetContracts();
    navigate(config.routes.SSV.ROOT);
  };

  useAccountEffect({
    onConnect: () => {
      console.log('connected');
    },
    onDisconnect: disconnectWallet
  });

  return {
    resetWalletAndStores,
    disconnectWallet
  };
};

export default useWalletDisconnector;
