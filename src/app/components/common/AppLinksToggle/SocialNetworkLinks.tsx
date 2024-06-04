import Grid from '@mui/material/Grid';
import config from '~app/common/config';
import { useStyles } from '~app/components/common/AppLinksToggle/AppLinksToggle.styles';
import SocialNetworkLogo from '~app/components/common/AppLinksToggle/SocialNetworkLogo';

const SOCIAL_NETWORKS = {
  DISCORD: 'discord',
  TWITTER: 'twitter',
  SSV_WEB_SITE: 'ssv_web_site'
};

const SOCIAL_NETWORK_LINKS = {
  [SOCIAL_NETWORKS.DISCORD]: config.links.DISCORD_LINK,
  [SOCIAL_NETWORKS.TWITTER]: config.links.TWITTER_LINK,
  [SOCIAL_NETWORKS.SSV_WEB_SITE]: config.links.SSV_WEB_SITE
};

const SocialNetworkLinks = () => {
  const classes = useStyles({});

  return (
    <Grid container item className={classes.SocialNetworksWrapper}>
      {Object.values(SOCIAL_NETWORKS).map((networkName: string) => (
        <SocialNetworkLogo
          logo={networkName}
          link={SOCIAL_NETWORK_LINKS[networkName]}
        />
      ))}
    </Grid>
  );
};

export default SocialNetworkLinks;
