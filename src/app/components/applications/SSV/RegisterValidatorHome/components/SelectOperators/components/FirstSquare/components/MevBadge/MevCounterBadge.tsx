import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MevRelayBadge from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/MevBadge/MevRelayBadge';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/MevBadge/MevRelays.styles';
import { Tooltip } from '~app/components/ui/tooltip';

const MevCounterBadge = ({ mevCount, mevRelaysList }: { mevCount: number | string; mevRelaysList: string[] }) => {
  const classes = useStyles({
    hasMevRelays: Number(mevCount) > 0
  });

  return (
    <Tooltip
      asChild
      delayDuration={250}
      className="bg-white text-gray-900"
      content={
        Number(mevCount) > 0 && (
          <div>
            <Typography className={classes.MevRelaysTitle}>Supported MEV Relays</Typography>
            <Grid className={classes.MevRelaysContainer}>
              {mevRelaysList.map((mevRelay: string) => (
                <MevRelayBadge mevRelay={mevRelay} />
              ))}
            </Grid>
          </div>
        )
      }
    >
      <Grid className={classes.BadgeCounterWrapper}>{mevCount}</Grid>
    </Tooltip>
  );
};

export default MevCounterBadge;
