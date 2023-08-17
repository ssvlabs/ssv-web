import React from 'react';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { useStores } from '~app/hooks/useStores';
import { NetworkDataType, switchNetwork } from '~lib/utils/envHelper';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import { useStyles } from '~app/components/common/AppBar/components/NetworkSwitchToggle/NetworkToggle.styles';

const NetworkOption = ({ network }: { network: NetworkDataType }) => {
    const stores = useStores();
    const walletStore: WalletStore = stores.Wallet;
    const { networkId, optionLabel,  logo, apiVersion } = network;
    
    const changeNetworkHandler = async () => {
        if (walletStore.wallet) {
            await walletStore.changeNetwork(networkId);
            window.location.reload();
        } else {
            switchNetwork(networkId, apiVersion);
        }
    };

    const classes = useStyles({ logo });

    return (
        <Grid container item className={classes.Button} onClick={changeNetworkHandler}>
            <Grid className={classes.NetworkIcon} />
            <Typography className={classes.NetworkLabel}>{optionLabel}</Typography>
        </Grid>
    );
};

export default NetworkOption;