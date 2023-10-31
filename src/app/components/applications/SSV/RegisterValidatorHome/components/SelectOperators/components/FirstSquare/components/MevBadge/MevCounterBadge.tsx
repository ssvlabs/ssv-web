import React, { useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import MevRelayBadge from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/MevBadge/MevRelayBadge';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/MevBadge/MevRelays.styles';

const MevCounterBadge = ({ mevCount, mevRelaysList }: { mevCount: number | string, mevRelaysList: string[] }) => {
    const classes = useStyles({ hasMevRelays: mevCount > 0 });
    const [hoveredGrid, setHoveredGrid] = useState(false);
    const timeoutRef = useRef(null);

    const handleGridHover = () => {
        // @ts-ignore
        timeoutRef.current = setTimeout(() => {
            // @ts-ignore
            setHoveredGrid(true);
        }, 300);
    };

    const handleGridLeave = () => {
        // @ts-ignore
        clearTimeout(timeoutRef.current);
        setHoveredGrid(false);
    };

    return (
        <div>
            <Grid onMouseLeave={handleGridLeave}
                  onMouseEnter={() => handleGridHover()}
                  className={classes.BadgeCounterWrapper}>
                {mevCount}
            </Grid>
            {hoveredGrid && mevCount > 0 && (
                <Grid className={classes.MevRelaysPopUp}>
                    Supported MEV Relays
                    <Grid className={classes.MevRelaysContainer}>
                        {mevRelaysList.map((mevRelay: string) => <MevRelayBadge mevRelay={mevRelay} />)}
                    </Grid>
                </Grid>
            )}
        </div>

    );
};

export default MevCounterBadge;