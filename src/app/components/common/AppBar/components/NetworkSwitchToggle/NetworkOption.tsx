import React from 'react';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { changeCurrentNetwork, NetworkDataType } from '~lib/utils/envHelper';
import { useStyles } from '~app/components/common/AppBar/components/NetworkSwitchToggle/NetworkToggle.styles';

const NetworkOption = ({ network }: { network: NetworkDataType }) => {
    const { networkId, optionLabel, apiVersion, logo } = network;
    const changeNetworkHandler = () => {
        changeCurrentNetwork(networkId, apiVersion);
    };

    const classes = useStyles({ logo });

    return (
        <Grid container item className={classes.Button} onClick={changeNetworkHandler}>
            <Grid className={classes.NetworkIcon} />
            <Typography>{optionLabel}</Typography>
        </Grid>
    );
};

export default NetworkOption;