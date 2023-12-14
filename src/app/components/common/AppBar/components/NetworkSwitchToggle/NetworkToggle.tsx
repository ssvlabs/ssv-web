import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import { getCurrentNetwork, NetworkDataType, NETWORKS_DATA } from '~lib/utils/envHelper';
import NetworkOption from '~app/components/common/AppBar/components/NetworkSwitchToggle/NetworkOption';
import { useStyles } from '~app/components/common/AppBar/components/NetworkSwitchToggle/NetworkToggle.styles';

const NetworkToggle = ({ excludeNetworks }: { excludeNetworks : number[] }) => {
    const optionsRef = useRef(null);
    const [currentNetwork] = useState(getCurrentNetwork());
    const classes = useStyles({ logo: currentNetwork.logo });
    const [showNetworks, setShowNetworks] = useState(false);
    const stores = useStores();
    const walletStore: WalletStore = stores.Wallet;

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

    const onOptionClick = async ({ networkId, apiVersion }: any) => {
      // await walletStore.onboardSdk.setChain({ chainId: `${networkId}` }).then(() => {
        walletStore.onNetworkChangeCallback(networkId, apiVersion);
      // });
    };

    return (
        <Grid>
          <Grid item container className={classes.NetworkToggleWrapper} onClick={switchShowNetworks}>
            <Grid item className={classes.NetworkIcon} />
              <Typography className={classes.NetworkLabel}>{currentNetwork.activeLabel}</Typography>
            </Grid>
            {showNetworks && <Grid item className={classes.OptionsWrapper}>
              <Grid ref={optionsRef}  container item className={classes.Options}>
                {
                  NETWORKS_DATA.filter(
                    (network: NetworkDataType) => (!excludeNetworks.includes(Number(network.networkId))))
                    .map(
                      (network: NetworkDataType) => (
                        <NetworkOption
                          key={network.networkId}
                          network={network}
                          onClick={() => onOptionClick(network)}
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
