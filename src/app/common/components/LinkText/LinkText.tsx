import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useStyles } from './LinkText.styles';

type MessageDivProps ={
    text: string
    link: string
};

const LinkText = ({ text, link }: MessageDivProps) => {
    const classes = useStyles();

    const openLink = () => {
        window.open(link);
    };

    return (
      <Grid item className={classes.Link} onClick={openLink}>{text}</Grid>
    );
};

export default observer(LinkText);
