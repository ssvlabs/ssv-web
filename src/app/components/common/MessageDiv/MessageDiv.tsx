import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useStyles } from './ErrorMessage.styles';

type MessageDivProps = {
    text: string
};

const MessageDiv = ({ text }: MessageDivProps) => {
    const classes = useStyles();
    return (
      <Grid className={classes.Wrapper}>
        {text}
      </Grid>
    );
};

export default observer(MessageDiv);
