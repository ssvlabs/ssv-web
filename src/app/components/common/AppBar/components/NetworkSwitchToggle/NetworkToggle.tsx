import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { useSetChain } from '@web3-onboard/react';
import styled from 'styled-components';
import {
    API_VERSIONS,
    getNetworkInfoIndexByNetworkId,
    getStoredNetwork, GOERLI_NETWORK_ID, HOLESKY_NETWORK_ID,
    MAINNET_NETWORK_ID,
} from '~root/providers/networkInfo.provider';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import { initContracts, resetContracts } from '~root/services/contracts.service';
import { changeNetwork, getStoredNetworkIndex, networks } from '~root/providers/networkInfo.provider';
import { useStyles } from '~app/components/common/AppBar/components/NetworkSwitchToggle/NetworkToggle.styles';
import { useAppDispatch } from '~app/hooks/redux.hook';
import { setShouldCheckCountryRestriction } from '~app/redux/appState.slice';
import useWalletDisconnector from '~app/hooks/useWalletDisconnector';
import { toHexString } from '~lib/utils/strings';
import Spinner from '~app/components/common/Spinner';

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
    [`${GOERLI_NETWORK_ID}_${API_VERSIONS.V4}`]: {
        logo: 'light',
        activeLabel: 'Goerli',
        optionLabel: 'Goerli Testnet',
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
    const optionsRef = useRef(null);
    const [selectedNetworkIndex, setSelectedNetworkIndex] = useState<number>(getStoredNetworkIndex());
    const { apiVersion, networkId } = networks[selectedNetworkIndex];
    const classes = useStyles({ logo: NETWORK_VARIABLES[`${networkId}_${apiVersion}`].logo });
    const [showNetworks, setShowNetworks] = useState(false);
    const [{ connectedChain, settingChain }, setChain] = useSetChain();
    const stores = useStores();
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    const operatorStore: OperatorStore = stores.Operator;
    const myAccountStore: MyAccountStore = stores.MyAccount;
    const notificationsStore: NotificationsStore = stores.Notifications;
    const dispatch = useAppDispatch();
    const { disconnectWallet } = useWalletDisconnector();

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
                notificationsStore.showMessage(`Unsupported network. Please change network to ${NETWORK_VARIABLES[`${network.networkId}_${network.apiVersion}`].activeLabel}`, 'error');
            } else {
                ssvStore.clearUserSyncInterval();
                myAccountStore.clearIntervals();
                operatorStore.clearSettings();
                ssvStore.clearSettings();
                resetContracts();
                changeNetwork(index);
                setSelectedNetworkIndex(index);

                dispatch(setShouldCheckCountryRestriction(index === 0));
                initContracts({ provider: walletStore.wallet.provider, network: getStoredNetwork(), shouldUseRpcUrl: walletStore.wallet.label === 'WalletConnect' });
                await ssvStore.initUser();
                await operatorStore.initUser();
                myAccountStore.setIntervals();
            }
        };

        const network = getStoredNetwork();
        if (walletStore.wallet && !walletStore.isNotMetamask && connectedChain?.id && toHexString(connectedChain?.id) !== toHexString(network.networkId) && !settingChain) {
            networkInWalletChangedHandler();
        }
    }, [connectedChain, settingChain]);

    const onOptionClick = async (index: number) => {
        if (index === getStoredNetworkIndex()) {
            setShowNetworks(false);
        } else if (walletStore.wallet) {
            if (walletStore.isNotMetamask) {
                await disconnectWallet();
                setShowNetworks(false);
            } else {
                setShowNetworks(false);
                await setChain({ chainId: toHexString(networks[index].networkId) });
            }
        } else {
            dispatch(setShouldCheckCountryRestriction(index === 0));
            changeNetwork(index);
            setSelectedNetworkIndex(index);
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
