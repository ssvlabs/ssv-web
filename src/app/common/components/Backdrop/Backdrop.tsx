import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop as MaterialBackdrop } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function Backdrop() {
  const classes = useStyles();

  return (
    <MaterialBackdrop className={classes.backdrop} open>
      <CircularProgress color="inherit" />
    </MaterialBackdrop>
  );
}
