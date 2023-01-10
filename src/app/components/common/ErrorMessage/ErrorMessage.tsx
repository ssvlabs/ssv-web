import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useStyles } from './ErrorMessage.styles';

type MessageDivProps = {
  text: any
  extendClasses?: any
};

const ErrorMessage = ({ text, extendClasses }: MessageDivProps) => {
  const classes = useStyles();
  return (
      <Grid className={`${classes.Wrapper} ${extendClasses}`}>
        {text}
      </Grid>
  );
};

export default observer(ErrorMessage);
