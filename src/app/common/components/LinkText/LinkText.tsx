import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { useStyles } from './LinkText.styles';
import Typography from '@material-ui/core/Typography';

type MessageDivProps ={
    text: string
    link?: string
    routePush?: boolean;
    withoutUnderline?: boolean
};

const LinkText = ({ text, link, routePush, withoutUnderline }: MessageDivProps) => {
    const history = useHistory();
    const classes = useStyles({ withoutUnderline });

    const openLink = () => {
        if (link) {
            if (routePush) {
                history.push(link);
            } else {
                window.open(link);
            }
        }
    };

    return (
      <Typography className={classes.Link} onClick={openLink}>{text}</Typography>
    );
};

export default observer(LinkText);
