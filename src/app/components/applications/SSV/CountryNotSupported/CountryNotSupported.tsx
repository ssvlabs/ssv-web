
import Grid from '@mui/material/Grid';
import LinkText from '~app/components/common/LinkText';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import { useStyles } from '~app/components/applications/SSV/CountryNotSupported/CountryNotSupported.styles';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getStrategyName, getRestrictedUserGeo } from '~app/redux/appState.slice';

const CountryNotSupported = () => {
  const classes = useStyles();
  const restrictedUserGeo = useAppSelector(getRestrictedUserGeo);
  const strategyName = useAppSelector(getStrategyName);

  const openMarketingSite = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'external_link',
      action: 'click',
      label: 'Learn more about the SSV network',
    });
    window.open('https://ssv.network/');
  };
  const websiteUrl = strategyName === 'distribution' ? 'claim.ssv.network' : 'app.ssv.network';

  return (
    <BorderScreen
      blackHeader
      withoutNavigation
      body={[
        <Grid container>
          <HeaderSubHeader
            rewardPage
            title={'Website not available'}
            subtitle={(
              <span>
                We noticed you are located in {restrictedUserGeo}.<br />
                Please note that the website <LinkText text={websiteUrl} link={`https://${websiteUrl}`} /> is not available in your country.</span>
            )}
          />
          <Grid container item className={classes.ImageWrapper} />
          <SecondaryButton noCamelCase submitFunction={openMarketingSite} children={'Learn more about the SSV network'} />
        </Grid>,
      ]}
    />
  );
};

export default CountryNotSupported;
