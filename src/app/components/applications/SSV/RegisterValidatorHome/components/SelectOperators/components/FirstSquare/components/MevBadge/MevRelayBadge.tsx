import React from 'react';
import Grid from '@mui/material/Grid';
import { MEV_RELAYS_LOGOS } from '~lib/utils/operatorMetadataHelper';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/MevBadge/MevRelays.styles';


const MevRelayBadge = ({ mevRelay }: { mevRelay: string }) => {
    const classes = useStyles({ mevRelayLogo: MEV_RELAYS_LOGOS[mevRelay] });

    return (
        <Grid className={classes.MevRelayBadge}>
            <Grid className={classes.MevRelayLogo}/>
            {mevRelay}
        </Grid>
    );
};

export default MevRelayBadge;