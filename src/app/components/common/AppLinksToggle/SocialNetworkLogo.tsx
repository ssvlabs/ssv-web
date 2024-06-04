import Grid from '@mui/material/Grid';
import { useStyles } from '~app/components/common/AppLinksToggle/AppLinksToggle.styles';

const SocialNetworkLogo = ({ logo, link }: { logo: string; link: string }) => {
  const classes = useStyles({ logo });

  const onClickHandler = () => {
    window.open(link, '_blank');
  };

  return (
    <Grid onClick={onClickHandler} className={classes.SocialNetworkLogo} />
  );
};

export default SocialNetworkLogo;
