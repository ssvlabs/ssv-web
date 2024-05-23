import Grid from '@mui/material/Grid';
import { useStyles } from './NameAndAddress.styles';

const NameAndAddress = ({ name }: { name: string }) => {
  const classes = useStyles();
  if (!name) {
    return null;
  }
  return (
    <Grid container item>
      <Grid item xs={12} className={`${classes.Name}`}>
        {name}
      </Grid>
    </Grid>
  );
};

export default NameAndAddress;
