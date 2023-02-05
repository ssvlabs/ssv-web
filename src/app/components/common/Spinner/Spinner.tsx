import React from 'react';
import { CircularProgress } from '@mui/material';
import { useStyles } from './Spinner.styles';

const Spinner = ({ errorSpinner }: { errorSpinner?: boolean }) => {
    const classes = useStyles({ errorSpinner });
    return (
      <CircularProgress thickness={6} size={28} className={classes.SpinnerWrapper} />
    );
};

export default Spinner;
