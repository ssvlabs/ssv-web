import { ethers } from 'ethers';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useAccountEffect } from 'wagmi';
import config from '~app/common/config';
import { MyAccountStore, OperatorStore, SsvStore } from '~app/common/stores/applications/SsvWeb';
import { METAMASK_LABEL } from '~app/constants/constants';
import { setIsShowSsvLoader } from '~app/redux/appState.slice';
import { setStrategyRedirect } from '~app/redux/navigation.slice';
import { checkIfWalletIsContractAction, resetWallet, setConnectedNetwork, setWallet } from '~app/redux/wallet.slice';
import { store } from '~app/store';
import { removeFromLocalStorageByKey } from '~root/providers/localStorage.provider';
import { getNetworkInfoIndexByNetworkId, getStoredNetwork } from '~root/providers/networkInfo.provider';
import { cleanLocalStorageAndCookie } from '~root/providers/onboardSettings.provider';
import { initContracts, resetContracts } from '~root/services/contracts.service';
import notifyService from '~root/services/notify.service';
import { isChainSupported } from '~root/wagmi/config';
import { useAppDispatch } from './redux.hook';
import { useEthersProvider } from './useEthersProvider';
import { useStores } from './useStores';

type InitProps = {
  walletAddress: string;
  connectorName: string;
  chainId: number;
  provider: ethers.providers.JsonRpcProvider;
};

export const useContractInitiator = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const account = useAccount();
  const provider = useEthersProvider();

  const stores = useStores();
  const ssvStore: SsvStore = stores.SSV;
  const operatorStore: OperatorStore = stores.Operator;
  const myAccountStore: MyAccountStore = stores.MyAccount;

  const reset = () => {
    cleanLocalStorageAndCookie();

    ssvStore.clearUserSyncInterval();
    dispatch(resetWallet());
    ssvStore.clearSettings();
    operatorStore.clearSettings();
    removeFromLocalStorageByKey('params');
    store.dispatch(setStrategyRedirect(config.routes.SSV.ROOT));

    resetContracts();
    navigate(config.routes.SSV.ROOT);
  };

  useAccountEffect({
    onDisconnect: reset
  });

  const initiateWallet = async ({ walletAddress, chainId, connectorName, provider }: InitProps) => {
    dispatch(setIsShowSsvLoader(true));
    dispatch(setWallet({ label: connectorName, address: walletAddress }));
    walletAddress && (await dispatch(checkIfWalletIsContractAction(provider)));
    notifyService.init(chainId.toString());
    const index = getNetworkInfoIndexByNetworkId(Number(chainId));
    dispatch(setConnectedNetwork(index));
    initContracts({ provider: provider as any, network: getStoredNetwork(), shouldUseRpcUrl: connectorName !== METAMASK_LABEL });
    await ssvStore.initUser();
    await operatorStore.initUser();
    await myAccountStore.getOwnerAddressOperators({});
    await myAccountStore.getOwnerAddressClusters({});
    if (myAccountStore.ownerAddressClusters?.length) {
      dispatch(setStrategyRedirect(config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD));
    } else if (myAccountStore.ownerAddressOperators?.length) {
      dispatch(setStrategyRedirect(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD));
    } else {
      dispatch(setStrategyRedirect(config.routes.SSV.ROOT));
    }
    await operatorStore.updateOperatorValidatorsLimit();
    dispatch(setIsShowSsvLoader(false));
  };

  useEffect(() => {
    if (provider && account.isConnected && account.chainId) {
      console.count('initiating wallet');
      reset();
      if (isChainSupported(account.chainId)) {
        dispatch(setIsShowSsvLoader(true));
        initiateWallet({
          chainId: account.chainId!,
          connectorName: account.connector?.name ?? '',
          provider: provider as ethers.providers.JsonRpcProvider,
          walletAddress: account.address as string
        });
      }
    }
  }, [account.address, account.chainId, account.connector?.name, account.isConnected, provider]);
};
