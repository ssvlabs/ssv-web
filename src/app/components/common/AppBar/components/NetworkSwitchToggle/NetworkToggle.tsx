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
import useWalletDisconnector from '~app/hooks/useWalletDisconnector';
import OperatorStore from '../../../../../common/stores/applications/SsvWeb/Operator.store';
import MyAccountStore from '../../../../../common/stores/applications/SsvWeb/MyAccount.store';

const NetworkToggle = ({ excludeNetworks }: { excludeNetworks : number[] }) => {
    const optionsRef = useRef(null);
    const [selectedNetworkIndex, setSelectedNetworkIndex] = useState<number>(getStoredNetworkIndex());
    const { apiVersion, networkId } = networks[selectedNetworkIndex];
    const classes = useStyles({ logo: NETWORK_VARIABLES[`${networkId}_${apiVersion}`].logo });
    const [showNetworks, setShowNetworks] = useState(false);
    const [{ wallet }] = useConnectWallet();
    const [{ connectedChain }, setChain] = useSetChain();
    const stores = useStores();
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    const operatorStore: OperatorStore = stores.Operator;
    const myAccountStore: MyAccountStore = stores.MyAccount;
    const notificationsStore: NotificationsStore = stores.Notifications;
    const dispatch = useAppDispatch();
    const { disconnectWallet } = useWalletDisconnector();

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

    // If chain has been changed in wallet
    useEffect(() => {
        const network = getStoredNetwork();
        if (connectedChain?.id && toHexString(connectedChain?.id) !== toHexString(network.networkId)) {

            let index = getNetworkInfoIndexByNetworkId(Number(connectedChain?.id));
            if (index < 0) {
                index = getNetworkInfoIndexByNetworkId(network.networkId);
                notificationsStore.showMessage(`Please change network to ${NETWORK_VARIABLES[`${network.networkId}_${network.apiVersion}`].activeLabel}`, 'error');
                if (!isWalletConnect()) {
                    setChain({ chainId: toHexString(network.networkId) });
                    changeNetwork(index);
                    setSelectedNetworkIndex(index);
                } else {

                }
            } else {
                changeNetwork(index);
                setSelectedNetworkIndex(index);
            }
        }
    }, [connectedChain]);

    const onOptionClick = async (index: number) => {
        console.warn('NetworkToggle: onOptionClick', index);
        if (index === getStoredNetworkIndex()) {
            console.warn('NetworkToggle: onOptionClick: no wallet or network is the same!');
            setShowNetworks(false);
        } else if (walletStore.wallet) {
            if (isWalletConnect()) {
                await disconnectWallet();
            } else {
                ssvStore.clearUserSyncInterval();
                myAccountStore.clearIntervals();
                operatorStore.clearSettings();
                ssvStore.clearSettings();
                resetContracts();
                changeNetwork(index);
                setSelectedNetworkIndex(index);
                setShowNetworks(false);

                dispatch(setShouldCheckCountryRestriction(index === 0));
                const network = getStoredNetwork();
                const setChainParams = { chainId: toHexString(network.networkId) };
                await setChain(setChainParams);
                initContracts({ provider: walletStore.wallet.provider, network, shouldUseRpcUrl: walletStore.wallet.label === 'WalletConnect' });
                ssvStore.initUser();
                operatorStore.initUser();
                myAccountStore.setIntervals();
            }
        }
    };

    return (
        <Grid>
          <Grid item container className={classes.NetworkToggleWrapper} onClick={() => setShowNetworks(!showNetworks)}>
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
