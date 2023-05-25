import React, { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { getCurrentNetwork, NetworkDataType, NETWORKS_DATA } from '~lib/utils/envHelper';
import NetworkOption from '~app/components/common/AppBar/components/NetworkSwitchToggle/NetworkOption';
import { useStyles } from '~app/components/common/AppBar/components/NetworkSwitchToggle/NetworkToggle.styles';

const NetworkToggle = () => {
    const optionsRef = useRef(null);
    const [currentNetwork] = useState(getCurrentNetwork());
    const classes = useStyles({ networkId: currentNetwork.networkId });
    const [showNetworks, setShowNetworks] = useState(false);

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

    return (
        <Grid>
        <Grid item container className={classes.NetworkToggleWrapper} onClick={switchShowNetworks}>
        <Grid item className={classes.NetworkIcon} />
          <Typography className={classes.NetworkLabel}>{currentNetwork.activeLabel}</Typography>
        </Grid>
            {showNetworks && <Grid item className={classes.OptionsWrapper}>
                <Grid ref={optionsRef}  container item className={classes.Options}>
                    {NETWORKS_DATA.map((network: NetworkDataType) => <NetworkOption key={network.networkId} networkId={network.networkId} optionLabel={network.optionLabel}
                    />)}
                </Grid>
            </Grid>
            }
</Grid>
    );
};

export default NetworkToggle;