import CircularProgress from '@mui/material/CircularProgress';
import { useStyles } from './Spinner.styles';

const Spinner = ({
  errorSpinner,
  size = 28,
  isWhite
}: {
  errorSpinner?: boolean;
  isWhite?: boolean;
  size?: number;
}) => {
  const classes = useStyles({ errorSpinner, isWhite });
  return (
    <CircularProgress
      thickness={6}
      size={size}
      className={classes.SpinnerWrapper}
    />
  );
};

export default Spinner;
