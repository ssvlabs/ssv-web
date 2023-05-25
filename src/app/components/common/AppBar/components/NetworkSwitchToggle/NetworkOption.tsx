import React from 'react';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { changeCurrentNetwork } from '~lib/utils/envHelper';
import { useStyles } from '~app/components/common/AppBar/components/NetworkSwitchToggle/NetworkToggle.styles';

type NetworkOptionProps = {
    networkId: number;
    optionLabel: string;
};

const NetworkOption = ({ networkId, optionLabel }: NetworkOptionProps) => {
    const changeNetworkHandler = () => {
        changeCurrentNetwork(networkId);
    };

    const classes = useStyles({ networkId });

    return (
        <Grid container item className={classes.Button} onClick={changeNetworkHandler}>
            <Grid className={classes.NetworkIcon} />
            <Typography>{optionLabel}</Typography>
        </Grid>
    );
};

export default NetworkOption;