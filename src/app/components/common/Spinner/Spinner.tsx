
import CircularProgress from '@mui/material/CircularProgress';
import { useStyles } from './Spinner.styles';

const Spinner = ({ errorSpinner, size = 28 }: { errorSpinner?: boolean; size?: number }) => {
    const classes = useStyles({ errorSpinner });
    return (
      <CircularProgress thickness={6} size={size} className={classes.SpinnerWrapper} />
    );
};

export default Spinner;
