import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import {
    getNetworkInfoIndexByNetworkId,
    getStoredNetwork,
    NETWORK_VARIABLES,
    toHexString,
} from '~root/providers/networkInfo.provider';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import { initContracts, resetContracts } from '~root/services/contracts.service';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { changeNetwork, getStoredNetworkIndex, networks } from '~root/providers/networkInfo.provider';
import NetworkOption from '~app/components/common/AppBar/components/NetworkSwitchToggle/NetworkOption';
import { useStyles } from '~app/components/common/AppBar/components/NetworkSwitchToggle/NetworkToggle.styles';
import { useAppDispatch } from '~app/hooks/redux.hook';
import { setShouldCheckCountryRestriction } from '~app/redux/appState.slice';

const NetworkToggle = ({ excludeNetworks }: { excludeNetworks : number[] }) => {
    const optionsRef = useRef(null);
    const [selectedNetworkIndex, setSelectedNetworkIndex] = useState<number>(getStoredNetworkIndex());
    const { apiVersion, networkId } = networks[selectedNetworkIndex];
    const classes = useStyles({ logo: NETWORK_VARIABLES[`${networkId}_${apiVersion}`].logo });
    const [showNetworks, setShowNetworks] = useState(false);
    const [{ wallet }, connect, disconnect] = useConnectWallet();
    const [{ connectedChain }, setChain] = useSetChain();
    const stores = useStores();
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    const notificationsStore: NotificationsStore = stores.Notifications;
    const dispatch = useAppDispatch();

    const disconnectWallet = async () => {
        if (wallet) {
            await disconnect({ label: wallet.label });
        }
        await walletStore.initWallet(null, null);
    };

    const isWalletConnect = () => wallet?.label === 'WalletConnect';

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

    const switchShowNetworks = () => {
        showNetworks ? setShowNetworks(false) : setShowNetworks(true);
    };

    // If chain has been changed in wallet
    useEffect(() => {
        const network = getStoredNetwork();
        if (connectedChain?.id && toHexString(connectedChain?.id) !== toHexString(network.networkId)) {
            ssvStore.clearUserSyncInterval();
            resetContracts();
            let index = getNetworkInfoIndexByNetworkId(Number(connectedChain?.id));
            if (index < 0) {
                index = getNetworkInfoIndexByNetworkId(network.networkId);
                notificationsStore.showMessage(`Please change network to ${NETWORK_VARIABLES[`${network.networkId}_${network.apiVersion}`].activeLabel}`, 'error');
                if (!isWalletConnect()) {
                    setChain({ chainId: toHexString(network.networkId) });
                    changeNetwork(index);
                    setSelectedNetworkIndex(index);
                } else {
                    disconnectWallet();
                    walletStore.initWallet(null, null);
                }
            } else {
                changeNetwork(index);
                setSelectedNetworkIndex(index);
            }
        }
        if (wallet?.provider) {
            walletStore.initWallet(wallet, connectedChain);
        } else {
            resetContracts();
            walletStore.initWallet(null, null);
        }
    }, [wallet, connectedChain]);

    const onOptionClick = async (index: number) => {
        console.warn('NetworkToggle: onOptionClick', index);
        // Don't react for the same index
        if (index === getStoredNetworkIndex()) {
            console.warn('NetworkToggle: onOptionClick: no wallet or network is the same!');
            setShowNetworks(false);
            return;
        }

        dispatch(setShouldCheckCountryRestriction(index === 0));
        // Change network in local storage
        ssvStore.clearUserSyncInterval();
        resetContracts();
        changeNetwork(index);
        setSelectedNetworkIndex(index);
        setShowNetworks(false);

        // In wallet connect mode - disconnect and connect again
        if (isWalletConnect()) {
            await disconnectWallet();
            walletStore.initWallet(null, null);
            await connect();
            return;
        }

        if (walletStore.wallet) {
            // Set chain works only in not wallet connect mode
            const network = getStoredNetwork();
            const setChainParams = { chainId: toHexString(network.networkId) };
            console.warn('NetworkToggle: onOptionClick: setChainParams', setChainParams);
            const setChainResult = await setChain(setChainParams);
            ssvStore.initUser();
            initContracts({ network });
            if (!setChainResult) {
                console.error('NetworkToggle: Error setting chain');
            }
        }
    };

    return (
        <Grid>
          <Grid item container className={classes.NetworkToggleWrapper} onClick={switchShowNetworks}>
            <Grid item className={classes.NetworkIcon} />
              <Typography className={classes.NetworkLabel}>{NETWORK_VARIABLES[`${networkId}_${apiVersion}`].activeLabel}</Typography>
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
