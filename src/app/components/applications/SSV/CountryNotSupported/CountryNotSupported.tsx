import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import { useStyles } from '~app/components/applications/SSV/CountryNotSupported/CountryNotSupported.styles';

const CountryNotSupported = () => {
  const stores = useStores();
  const classes = useStyles();
  const applicationStore: ApplicationStore = stores.Application;

  const openMarketingSite = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'external_link',
      action: 'click',
      label: 'Learn more about the SSV network',
    });
    window.open('https://ssv.network/');
  };
  const websiteUrl = applicationStore.strategyName === 'distribution' ? 'claim.ssv.network' : 'app.prater.ssv.network';

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
                We noticed you are located in {applicationStore.userGeo}.<br />
                Please note that the website <LinkText text={websiteUrl} link={`https://${websiteUrl}`} /> is not available in your country.</span>
            )}
          />
          <Grid container item className={classes.ImageWrapper} />
          <SecondaryButton noCamelCase submitFunction={openMarketingSite} text={'Learn more about the SSV network'} />
        </Grid>,
      ]}
    />
  );
};

export default observer(CountryNotSupported);
