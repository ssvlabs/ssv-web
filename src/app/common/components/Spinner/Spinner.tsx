import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useStyles } from './Spinner.styles';

const Spinner = () => {
    const classes = useStyles();
    return (
      <CircularProgress thickness={6} size={28} className={classes.SpinnerWrapper} />
    );
};

export default Spinner;
