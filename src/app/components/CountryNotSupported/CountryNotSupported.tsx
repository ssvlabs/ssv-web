import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/common/components/LinkText';
import HeaderSubHeader from '~app/common/components/HeaderSubHeader';
import SecondaryButton from '~app/common/components/Button/SecondaryButton';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import { useStyles } from '~app/components/CountryNotSupported/CountryNotSupported.styles';
import ApplicationStore from '~app/common/stores/Abstracts/Application';

const CountryNotSupported = () => {
    const stores = useStores();
    const classes = useStyles();
    const applicationStore: ApplicationStore = stores.Application;

    const openMarketingSite = () => {
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
