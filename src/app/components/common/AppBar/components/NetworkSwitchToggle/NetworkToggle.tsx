import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import useOnboard from '~app/hooks/useOnboard';
import { useNavigate } from 'react-router-dom';
import { useConnectWallet } from '@web3-onboard/react';
import {
    getNetworkInfoIndexByNetworkId,
    getStoredNetwork,
    NETWORK_VARIABLES,
    toHexString,
} from '~root/providers/networkInfo.provider';
import { useStores } from '~app/hooks/useStores';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import { changeNetwork, getStoredNetworkIndex, networks } from '~root/providers/networkInfo.provider';
import NetworkOption from '~app/components/common/AppBar/components/NetworkSwitchToggle/NetworkOption';
import { useStyles } from '~app/components/common/AppBar/components/NetworkSwitchToggle/NetworkToggle.styles';
import { initContracts, resetContracts } from '~root/services/contracts.service';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';

const NetworkToggle = ({ excludeNetworks }: { excludeNetworks : number[] }) => {
    const optionsRef = useRef(null);
    const [selectedNetworkIndex, setSelectedNetworkIndex] = useState<number>(getStoredNetworkIndex());
    const { apiVersion, networkId } = networks[selectedNetworkIndex];
    const classes = useStyles({ logo: NETWORK_VARIABLES[`${networkId}_${apiVersion}`].logo });
    const [showNetworks, setShowNetworks] = useState(false);
    const { wallet, disconnectWallet, useSetChain, isWalletConnect } = useOnboard();
    const [_, connect] = useConnectWallet();
    const [{ connectedChain }, setChain] = useSetChain();
    const stores = useStores();
    const navigate = useNavigate();
    const ssvStore: SsvStore = stores.SSV;

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
            const index = getNetworkInfoIndexByNetworkId(Number(connectedChain?.id));
            changeNetwork(index);
            setSelectedNetworkIndex(index);

            // if (wallet?.provider) {
            //     initContracts({ provider: wallet.provider, network  });
            // }

            // TODO: add listener to react on wallet changes outside of application
            // if (notIncludeMainnet && networkId !== undefined && !inNetworks(networkId, testNets)) {
            //   this.wrongNetwork = true;
            //   this.notificationsStore.showMessage('Please change network to Holesky', 'error');
            // }
        }
    }, [connectedChain?.id]);

    const onOptionClick = async (index: number) => {
        console.warn('NetworkToggle: onOptionClick', index);
        // Don't react for the same index
        if (index === getStoredNetworkIndex()) {
            console.warn('NetworkToggle: onOptionClick: no wallet or network is the same!');
            setShowNetworks(false);
            return;
        }

        // Change network in local storage
        ssvStore.clearUserSyncInterval();
        resetContracts();
        changeNetwork(index);
        setSelectedNetworkIndex(index);
        setShowNetworks(false);

        // If no wallet - end of the logic
        if (!wallet) {
            console.warn('NetworkToggle: onOptionClick: no wallet or network is the same!');
            return;
        }

        // In wallet connect mode - disconnect and connect again
        if (isWalletConnect()) {
            await disconnectWallet();
            const result = await connect();
            if (!result) {
                console.error('NetworkToggle: Error connecting wallet');
            }
            return;
        }

        // Set chain works only in not wallet connect mode
        const network = getStoredNetwork();
        const setChainResult = await setChain({ chainId: toHexString(network.networkId) });
        if (!setChainResult) {
            console.error('NetworkToggle: Error setting chain');
        }

        // changeNetwork(getNetworkInfoIndexByNetworkId(Number(network.networkId)));
        // navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD);
        navigate('/join');
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

export default NetworkToggle;
