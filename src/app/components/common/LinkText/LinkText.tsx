import React from 'react';
import { observer } from 'mobx-react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStyles } from './LinkText.styles';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';

type MessageDivProps = {
  style?: any;
  text: string;
  link?: string;
  onClick?: any;
  className?: string,
  routePush?: boolean;
  withoutUnderline?: boolean
};

const LinkText = ({ style, text, onClick, link, className, routePush, withoutUnderline }: MessageDivProps) => {
  const navigate = useNavigate();
  const classes = useStyles({ withoutUnderline });

  const openLink = () => {
    if (link) {
      if (routePush) {
        navigate(link);
      } else {
        GoogleTagManager.getInstance().sendEvent({
          category: 'external_link',
          action: 'click',
          label: text,
        });
        window.open(link);
      }
      if (typeof onClick === 'function') {
        onClick();
      }
    }
  };

  return (
    <Typography style={style} className={className ?? classes.Link} onClick={openLink}>{text}</Typography>
  );
};

export default observer(LinkText);
