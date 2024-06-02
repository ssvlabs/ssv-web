import { useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import MevRelayCard from '~app/components/common/MevRelayCard';
import { MEV_RELAYS_LOGOS } from '~lib/utils/operatorMetadataHelper';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/MevBadge/MevRelays.styles';

const MevIcon = ({ mevRelay, hasMevRelay }: { mevRelay: string; hasMevRelay: boolean | undefined }) => {
  const classes = useStyles({ mevIcon: MEV_RELAYS_LOGOS[mevRelay], hasMevRelay });
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
    <div style={{ position: 'relative' }}>
      <Grid onMouseLeave={handleGridLeave} onMouseEnter={() => handleGridHover()} className={classes.MevIconWrapper}>
        <Grid className={classes.MevIcon} />
      </Grid>
      {hoveredGrid && <MevRelayCard mevRelay={mevRelay} />}
    </div>
  );
};

export default MevIcon;
