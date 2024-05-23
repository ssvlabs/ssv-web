import { useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MevRelayBadge from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/MevBadge/MevRelayBadge';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/MevBadge/MevRelays.styles';

const MevCounterBadge = ({ mevCount, mevRelaysList }: { mevCount: number | string; mevRelaysList: string[] }) => {
  const [hoveredGrid, setHoveredGrid] = useState(false);
  const timeoutRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const classes = useStyles({ hasMevRelays: Number(mevCount) > 0, popUpTop: cursorPos.y + 15 });

  const handleMouseMove = (event: any) => {
    if (hoveredGrid) {
      return;
    }
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    setCursorPos({
      x: event.clientX + scrollX,
      y: event.clientY + scrollY
    });
  };

  const handleGridHover = (e: any) => {
    if (hoveredGrid) {
      return;
    }
    handleMouseMove(e);
    setHoveredGrid(true);
  };

  const handleGridLeave = () => {
    // @ts-ignore
    clearTimeout(timeoutRef.current);
    setHoveredGrid(false);
  };

  return (
    <div>
      <Grid onMouseLeave={handleGridLeave} onMouseEnter={handleGridHover} className={classes.BadgeCounterWrapper}>
        {mevCount}
      </Grid>
      {hoveredGrid && Number(mevCount) > 0 && (
        <Grid className={classes.MevRelaysPopUp}>
          <Typography className={classes.MevRelaysTitle}>Supported MEV Relays</Typography>
          <Grid className={classes.MevRelaysContainer}>
            {mevRelaysList.map((mevRelay: string) => (
              <MevRelayBadge mevRelay={mevRelay} />
            ))}
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default MevCounterBadge;
