
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { useStyles } from '~app/components/common/LinkText/LinkText.styles';

type MessageDivProps = {
  style?: any;
  text: string;
  link?: string;
  onClick?: any;
  textSize?: number;
  className?: string,
  routePush?: boolean;
  withoutUnderline?: boolean
};

const LinkText = ({ textSize, style, text, onClick, link, className, routePush, withoutUnderline }: MessageDivProps) => {
  const navigate = useNavigate();
  const classes = useStyles({ textSize, withoutUnderline });

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
    }
    if (typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <Typography component="div" style={style} className={className ?? classes.Link} onClick={openLink}>{text}</Typography>
  );
};

export default observer(LinkText);
