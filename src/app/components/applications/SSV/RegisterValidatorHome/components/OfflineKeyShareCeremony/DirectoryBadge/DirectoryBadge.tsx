
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
  useStyles,
} from '~app/components/applications/SSV/RegisterValidatorHome/components/OfflineKeyShareCeremony/DirectoryBadge/DirectoryBadge.styles';

const DirectoryBadge = ({ directoryPath }: { directoryPath: string }) => {
  const classes = useStyles();

  return (
    <Grid className={classes.BadgeWrapper}>
      <Grid className={classes.Wrapper}>
        <Grid className={classes.FolderIcon}/>
        <Typography className={classes.Text}>{directoryPath}</Typography>
      </Grid>
    </Grid>
  );
};

export default DirectoryBadge;