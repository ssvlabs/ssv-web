import Grid from '@mui/material/Grid';
import { MEV_RELAYS_LOGOS } from '~lib/utils/operatorMetadataHelper';
import { useStyles } from '~app/components/common/MevRelayCard/MevRelayCard.styles';

const MevRelayCard = ({ mevRelay }: { mevRelay: string }) => {
  const classes = useStyles({ mevRelayLogo: MEV_RELAYS_LOGOS[mevRelay] });

  return (
    <Grid container className={`${classes.PopUpWrapper}`}>
      <Grid item className={classes.FullImage} />
      <Grid item className={classes.Line} />
      <Grid item>
        <Grid item container style={{ alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
          <Grid className={classes.MevRelayCardText}>{mevRelay}</Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MevRelayCard;
