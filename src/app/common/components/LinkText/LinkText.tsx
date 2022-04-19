import React from 'react';
import { observer } from 'mobx-react';
import { useStyles } from './LinkText.styles';
import Typography from '@material-ui/core/Typography';

type MessageDivProps ={
    text: string
    link?: string
};

const LinkText = ({ text, link }: MessageDivProps) => {
    const classes = useStyles();

    const openLink = () => {
        if (link) window.open(link);
    };

    return (
      <Typography className={classes.Link} onClick={openLink}>{text}</Typography>
    );
};

export default observer(LinkText);
