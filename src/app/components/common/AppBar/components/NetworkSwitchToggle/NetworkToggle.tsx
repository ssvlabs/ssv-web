import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import styled from 'styled-components';
import {
    API_VERSIONS,
    getNetworkInfoIndexByNetworkId,
    getStoredNetwork, HOLESKY_NETWORK_ID,
    MAINNET_NETWORK_ID,
} from '~root/providers/networkInfo.provider';
import { useStores } from '~app/hooks/useStores';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import { initContracts, resetContracts } from '~root/services/contracts.service';
import { getStoredNetworkIndex, networks } from '~root/providers/networkInfo.provider';
import { useStyles } from '~app/components/common/AppBar/components/NetworkSwitchToggle/NetworkToggle.styles';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { setIsShowSsvLoader, setShouldCheckCountryRestriction } from '~app/redux/appState.slice';
import useWalletDisconnector from '~app/hooks/walletDisconnector.hook';
import { toHexString } from '~lib/utils/strings';
import Spinner from '~app/components/common/Spinner';
import { getAccountAddress, getConnectedNetwork, getIsNotMetamask, setConnectedNetwork } from '~app/redux/wallet.slice';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';
import { refreshOperatorsAndClusters } from '~app/redux/account.slice';

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

const NetworkText = styled.div<{ theme: any, hasSpinner?: boolean }>`
    font-size: 16px;
    font-weight: 600;
    line-height: 1.25;
    color: ${({ theme }) => theme.colors.gray80};
    margin-right: ${({ hasSpinner }) => hasSpinner ? 10 : 0}px;
`;

const NETWORK_VARIABLES = {
    [`${MAINNET_NETWORK_ID}_${API_VERSIONS.V4}`]: {
        logo: 'dark',
        activeLabel: 'Ethereum',
        optionLabel: 'Ethereum Mainnet',
    },
    [`${HOLESKY_NETWORK_ID}_${API_VERSIONS.V4}`]: {
        logo: 'light',
        activeLabel: 'Holesky',
        optionLabel: 'Holesky Testnet',
    },
};

const NetworkOption = ({ networkId, apiVersion, onClick }: { networkId: number; apiVersion: string; onClick: any; }) => {
    const { optionLabel, logo } = NETWORK_VARIABLES[`${networkId}_${apiVersion}`];
    const classes = useStyles();

    return (
      <Grid container item className={classes.Button} onClick={onClick}>
        <NetworkIcon logo={logo} />
        <NetworkText>{optionLabel}</ NetworkText>
      </Grid>
    );
};

const NetworkToggle = ({ excludeNetworks }: { excludeNetworks : number[] }) => {
    const [showNetworks, setShowNetworks] = useState(false);
    const dispatch = useAppDispatch();
    const { apiVersion, networkId } = useAppSelector(getConnectedNetwork);
    const accountAddress = useAppSelector(getAccountAddress);
    const isNotMetamask = useAppSelector(getIsNotMetamask);
    const optionsRef = useRef(null);
    const { disconnectWallet } = useWalletDisconnector();
    const classes = useStyles({ logo: NETWORK_VARIABLES[`${networkId}_${apiVersion}`].logo });
    const [{  wallet }] = useConnectWallet();
    const [{ connectedChain, settingChain }, setChain] = useSetChain();
    const stores = useStores();
    const ssvStore: SsvStore = stores.SSV;
    const operatorStore: OperatorStore = stores.Operator;

    useEffect(() => {
        const handleClickOutside = (e: any) => {
            // @ts-ignore
            if (showNetworks && optionsRef.current && (!optionsRef.current.contains(e.target))) {
                setShowNetworks(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [optionsRef, showNetworks]);

    useEffect(() => {
        const networkInWalletChangedHandler = async () => {
            const index = getNetworkInfoIndexByNetworkId(Number(connectedChain?.id));
            if (index < 0) {
                dispatch(setMessageAndSeverity({ message: `Unsupported network. Please change network to ${NETWORK_VARIABLES[`${network.networkId}_${network.apiVersion}`].activeLabel}`, severity: 'error' }));
            } else {
                ssvStore.clearUserSyncInterval();
                operatorStore.clearSettings();
                ssvStore.clearSettings();
                resetContracts();
                dispatch(setConnectedNetwork(index));
                dispatch(setShouldCheckCountryRestriction(index === 0));
                if (wallet) {
                    initContracts({ provider: wallet.provider, network: getStoredNetwork(), shouldUseRpcUrl: isNotMetamask });
                }
                await ssvStore.initUser();
                await operatorStore.initUser();
                await dispatch(refreshOperatorsAndClusters());
            }
        };

        const network = getStoredNetwork();
        if (accountAddress && !isNotMetamask && connectedChain?.id && toHexString(connectedChain?.id) !== toHexString(network.networkId) && !settingChain) {
            dispatch(setIsShowSsvLoader(true));
            networkInWalletChangedHandler();
            dispatch(setIsShowSsvLoader(false));
        }
    }, [connectedChain, settingChain]);

    const onOptionClick = async (index: number) => {
        if (index === getStoredNetworkIndex()) {
            setShowNetworks(false);
        } else if (accountAddress) {
            if (isNotMetamask) {
                await disconnectWallet();
                setShowNetworks(false);
            } else {
                setShowNetworks(false);
                await setChain({ chainId: toHexString(networks[index].networkId) });
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
                <NetworkText hasSpinner={settingChain}>{NETWORK_VARIABLES[`${networkId}_${apiVersion}`].activeLabel}</NetworkText>
                {settingChain && <Spinner size={20} />}
              </CurrentNetworkWrapper>
            </Grid>
            {showNetworks && <Grid item className={classes.OptionsWrapper}>
              <Grid ref={optionsRef}  container item className={classes.Options}>
                {
                  networks.filter(
                    (network) => (!excludeNetworks.includes(Number(network.networkId))))
                    .map(
                      (network, index) => (
                        <NetworkOption
                          key={network.networkId}
                          networkId={network.networkId}
                          apiVersion={network.apiVersion}
                          onClick={() => onOptionClick(index)}
                        />
                      ),
                    )
                }
                </Grid>
            </Grid>}
       </Grid>
    );
};

export default observer(NetworkToggle);
