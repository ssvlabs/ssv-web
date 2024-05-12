import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import { useStyles } from '~app/components/common/AppBar/components/NetworkSwitchToggle/NetworkToggle.styles';
import Spinner from '~app/components/common/Spinner';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { useEthersProvider } from '~app/hooks/useEthersProvider';
import { useStores } from '~app/hooks/useStores';
import useWalletDisconnector from '~app/hooks/walletDisconnector.hook';
import { setIsShowSsvLoader, setShouldCheckCountryRestriction } from '~app/redux/appState.slice';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';
import { getConnectedNetwork, getIsNotMetamask, setConnectedNetwork } from '~app/redux/wallet.slice';
import {
  API_VERSIONS,
  HOLESKY_NETWORK_ID,
  MAINNET_NETWORK_ID,
  getNetworkInfoIndexByNetworkId,
  getStoredNetwork,
  getStoredNetworkIndex,
  networks
} from '~root/providers/networkInfo.provider';
import { initContracts, resetContracts } from '~root/services/contracts.service';

const CurrentNetworkWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const NetworkIcon = styled.div<{ logo: string }>`
  width: 24px;
  height: 24px;
  margin-right: 10px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(/images/networks/${({ logo }) => logo}.svg);
`;

const NetworkText = styled.div<{ theme: any; hasSpinner?: boolean }>`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: ${({ theme }) => theme.colors.gray80};
  margin-right: ${({ hasSpinner }) => (hasSpinner ? 10 : 0)}px;
`;

const NETWORK_VARIABLES = {
  [`${MAINNET_NETWORK_ID}_${API_VERSIONS.V4}`]: {
    logo: 'dark',
    activeLabel: 'Ethereum',
    optionLabel: 'Ethereum Mainnet'
  },
  [`${HOLESKY_NETWORK_ID}_${API_VERSIONS.V4}`]: {
    logo: 'light',
    activeLabel: 'Holesky',
    optionLabel: 'Holesky Testnet'
  }
};

const NetworkOption = ({ networkId, apiVersion, onClick }: { networkId: number; apiVersion: string; onClick: any }) => {
  const { optionLabel, logo } = NETWORK_VARIABLES[`${networkId}_${apiVersion}`];
  const classes = useStyles();

  return (
    <Grid container item className={classes.Button} onClick={onClick}>
      <NetworkIcon logo={logo} />
      <NetworkText>{optionLabel}</NetworkText>
    </Grid>
  );
};

const NetworkToggle = ({ excludeNetworks }: { excludeNetworks: number[] }) => {
  const chainId = useChainId();

  const [showNetworks, setShowNetworks] = useState(false);
  const dispatch = useAppDispatch();
  const { apiVersion, networkId } = useAppSelector(getConnectedNetwork);
  const { address: accountAddress } = useAccount();
  const isNotMetamask = useAppSelector(getIsNotMetamask);
  const optionsRef = useRef(null);
  const { disconnectWallet } = useWalletDisconnector();
  const classes = useStyles({ logo: NETWORK_VARIABLES[`${networkId}_${apiVersion}`].logo });
  const stores = useStores();
  const ssvStore: SsvStore = stores.SSV;
  const operatorStore: OperatorStore = stores.Operator;
  const myAccountStore: MyAccountStore = stores.MyAccount;

  const provider = useEthersProvider();

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      // @ts-ignore
      if (showNetworks && optionsRef.current && !optionsRef.current.contains(e.target)) {
        setShowNetworks(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [optionsRef, showNetworks]);

  const switcher = useSwitchChain({
    mutation: {
      onSuccess: async () => {
        setShowNetworks(false);
        const network = getStoredNetwork();
        const networkInWalletChangedHandler = async () => {
          const index = getNetworkInfoIndexByNetworkId(Number(chainId));
          if (index < 0) {
            dispatch(
              setMessageAndSeverity({
                message: `Unsupported network. Please change network to ${NETWORK_VARIABLES[`${network.networkId}_${network.apiVersion}`].activeLabel}`,
                severity: 'error'
              })
            );
          } else {
            ssvStore.clearUserSyncInterval();
            operatorStore.clearSettings();
            ssvStore.clearSettings();
            resetContracts();
            dispatch(setConnectedNetwork(index));
            dispatch(setShouldCheckCountryRestriction(index === 0));
            if (accountAddress) {
              initContracts({ provider: provider as any, network, shouldUseRpcUrl: isNotMetamask });
            }
            await ssvStore.initUser();
            await operatorStore.initUser();
            await myAccountStore.refreshOperatorsAndClusters();
          }
        };
        dispatch(setIsShowSsvLoader(true));
        await networkInWalletChangedHandler();
        dispatch(setIsShowSsvLoader(true));
      }
    }
  });

  //   useEffect(() => {
  //     const networkInWalletChangedHandler = async () => {
  //       const index = getNetworkInfoIndexByNetworkId(Number(chainId));
  //       if (index < 0) {
  //         dispatch(
  //           setMessageAndSeverity({
  //             message: `Unsupported network. Please change network to ${NETWORK_VARIABLES[`${network.networkId}_${network.apiVersion}`].activeLabel}`,
  //             severity: 'error'
  //           })
  //         );
  //       } else {
  //         ssvStore.clearUserSyncInterval();
  //         operatorStore.clearSettings();
  //         ssvStore.clearSettings();
  //         resetContracts();
  //         dispatch(setConnectedNetwork(index));
  //         dispatch(setShouldCheckCountryRestriction(index === 0));
  //         if (wallet) {
  //           initContracts({ provider: provider as any, network: getStoredNetwork(), shouldUseRpcUrl: isNotMetamask });
  //         }
  //         await ssvStore.initUser();
  //         await operatorStore.initUser();
  //         await myAccountStore.refreshOperatorsAndClusters();
  //       }
  //     };

  //     const network = getStoredNetwork();
  //     if (accountAddress && !isNotMetamask && chainId && toHexString(chainId) !== toHexString(network.networkId) && !switcher.isPending) {
  //       dispatch(setIsShowSsvLoader(true));
  //       networkInWalletChangedHandler();
  //       dispatch(setIsShowSsvLoader(false));
  //     }
  //   }, [chainId, switcher.isPending, provider]);

  const onOptionClick = async (chainId: number) => {
    const index = getNetworkInfoIndexByNetworkId(chainId);
    if (index === getStoredNetworkIndex()) {
      setShowNetworks(false);
    } else if (accountAddress) {
      if (isNotMetamask) {
        await disconnectWallet();
        setShowNetworks(false);
      } else {
        setShowNetworks(false);
        await switcher.switchChainAsync({ chainId });
      }
    } else {
      dispatch(setShouldCheckCountryRestriction(index === 0));
      dispatch(setConnectedNetwork(index));
      setShowNetworks(false);
    }
  };

  return (
    <Grid>
      <Grid item container className={classes.NetworkToggleWrapper} onClick={() => setShowNetworks(!showNetworks)}>
        <CurrentNetworkWrapper>
          <NetworkIcon logo={NETWORK_VARIABLES[`${networkId}_${apiVersion}`].logo} />
          <NetworkText hasSpinner={switcher.isPending}>{NETWORK_VARIABLES[`${networkId}_${apiVersion}`].activeLabel}</NetworkText>
          {switcher.isPending && <Spinner size={20} />}
        </CurrentNetworkWrapper>
      </Grid>
      {showNetworks && (
        <Grid item className={classes.OptionsWrapper}>
          <Grid ref={optionsRef} container item className={classes.Options}>
            {networks
              .filter((network) => !excludeNetworks.includes(Number(network.networkId)))
              .map((network) => (
                <NetworkOption key={network.networkId} networkId={network.networkId} apiVersion={network.apiVersion} onClick={() => onOptionClick(network.networkId)} />
              ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default observer(NetworkToggle);
