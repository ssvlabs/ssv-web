import { ethers } from 'ethers';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useAccountEffect } from 'wagmi';
import config from '~app/common/config';
import { METAMASK_LABEL } from '~app/constants/constants';
import { useAppDispatch } from '~app/hooks/redux.hook';
import { useEthersSignerProvider } from '~app/hooks/useEthersSigner';
import { fetchClusters, fetchOperators, reset as resetAccount } from '~app/redux/account.slice';
import { setIsShowSsvLoader } from '~app/redux/appState.slice';
import { setStrategyRedirect } from '~app/redux/navigation.slice';
import { fetchAndSetNetworkFeeAndLiquidationCollateral } from '~app/redux/network.slice';
import { checkIfWalletIsContractAction, resetWallet, setConnectedNetwork, setWallet } from '~app/redux/wallet.slice';
import { store } from '~app/store';
import { removeFromLocalStorageByKey } from '~root/providers/localStorage.provider';
import { getNetworkInfoIndexByNetworkId, getStoredNetwork } from '~root/providers/networkInfo.provider';
import { initContracts, resetContracts } from '~root/services/contracts.service';
import notifyService from '~root/services/notify.service';
import { isChainSupported } from '~root/wagmi/config';
import { clearAllSettings, fetchAndSetFeeIncreaseAndPeriods, fetchAndSetMaxOperatorFee, fetchAndSetOperatorValidatorsLimit } from '~app/redux/operator.slice.ts';
import { useDebounce } from 'react-use';

type InitProps = {
  walletAddress: string;
  connectorName: string;
  chainId: number;
  provider: ethers.providers.Web3Provider;
};

export const useWalletConnectivity = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const account = useAccount();
  const provider = useEthersSignerProvider();

  const reset = () => {
    dispatch(resetWallet());
    dispatch(clearAllSettings());
    dispatch(resetAccount());
    removeFromLocalStorageByKey('params');

    resetContracts();
    if (import.meta.env.VITE_CLAIM_PAGE) {
      dispatch(setStrategyRedirect(config.routes.DISTRIBUTION.ROOT));
      navigate(config.routes.DISTRIBUTION.ROOT);
      return;
    }
    if (import.meta.env.VITE_FAUCET_PAGE) {
      dispatch(setStrategyRedirect(config.routes.FAUCET.ROOT));
      navigate(config.routes.FAUCET.ROOT);
      return;
    }
    store.dispatch(setStrategyRedirect(config.routes.SSV.ROOT));
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
    initContracts({
      provider: provider,
      network: getStoredNetwork(),
      shouldUseRpcUrl: connectorName !== METAMASK_LABEL
    });
    if (import.meta.env.VITE_CLAIM_PAGE) {
      dispatch(setStrategyRedirect(config.routes.DISTRIBUTION.ROOT));
      return dispatch(setIsShowSsvLoader(false));
    }
    if (import.meta.env.VITE_FAUCET_PAGE) {
      dispatch(setStrategyRedirect(config.routes.FAUCET.ROOT));
      return dispatch(setIsShowSsvLoader(false));
    }

    await Promise.all([await dispatch(fetchAndSetNetworkFeeAndLiquidationCollateral()), await dispatch(fetchAndSetFeeIncreaseAndPeriods())]);
    const [accountClusters, accountOperators] = await Promise.all([dispatch(fetchClusters({})), dispatch(fetchOperators({}))]);

    if (accountClusters.payload?.clusters.length) {
      dispatch(setStrategyRedirect(config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD));
      // @ts-expect-error payload is not typed
    } else if (accountOperators.payload?.operators.length) {
      dispatch(setStrategyRedirect(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD));
    } else {
      dispatch(setStrategyRedirect(config.routes.SSV.ROOT));
    }

    await Promise.all([await dispatch(fetchAndSetMaxOperatorFee()), await dispatch(fetchAndSetOperatorValidatorsLimit())]);
    dispatch(setIsShowSsvLoader(false));
  };

  useDebounce(
    () => {
      if (provider && account.isConnected && account.chainId) {
        reset();
        if (isChainSupported(account.chainId)) {
          initiateWallet({
            chainId: account.chainId!,
            connectorName: account.connector?.name ?? '',
            provider: provider,
            walletAddress: account.address as string
          });
        } else {
          dispatch(setIsShowSsvLoader(false));
        }
      }
    },
    500,
    [account.address, account.chainId, account.connector?.name, account.isConnected, provider]
  );

  useEffect(() => {
    if (account.status === 'disconnected') dispatch(setIsShowSsvLoader(false));
  }, [account.status, dispatch]);
};
