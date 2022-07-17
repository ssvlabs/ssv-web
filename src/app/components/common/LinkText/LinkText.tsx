import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { useStyles } from './LinkText.styles';
import Typography from '@material-ui/core/Typography';

type MessageDivProps ={
    text: string;
    link?: string;
    onClick?: any;
    routePush?: boolean;
    withoutUnderline?: boolean
};

const LinkText = ({ text, onClick, link, routePush, withoutUnderline }: MessageDivProps) => {
    const history = useHistory();
    const classes = useStyles({ withoutUnderline });

    const openLink = () => {
        if (link) {
            if (routePush) {
                history.push(link);
            } else {
                window.open(link);
            }
            if (typeof onClick === 'function') {
                onClick();
            }
        }
    };

    return (
      <Typography className={classes.Link} onClick={openLink}>{text}</Typography>
    );
};

export default observer(LinkText);
