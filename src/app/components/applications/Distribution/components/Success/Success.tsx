import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useStores } from '~app/hooks/useStores';
import Typography from '@mui/material/Typography';
import LinkText from '~app/components/common/LinkText';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import { useDistributionStore } from '~app/hooks/useDistributionStore';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import { getCurrentNetwork, networkTitle, transactionLink } from '~lib/utils/envHelper';
import ApplicationStore from '~app/common/stores/applications/Distribution/Application.store';
import DistributionStore from '~app/common/stores/applications/Distribution/Distribution.store';
import { useStyles } from '~app/components/applications/Distribution/components/Success/Success.styles';
import DistributionTestnetStore from '~app/common/stores/applications/Distribution/DistributionTestnet.store';

const Success = () => {
  const { networkId } = getCurrentNetwork();
  const stores = useStores();
  const classes = useStyles();
  const applicationStore: ApplicationStore = stores.Application;
  const distributionStore: DistributionStore | DistributionTestnetStore = useDistributionStore(networkId);

  const openMarketingSite = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'external_link',
      action: 'click',
      label: 'Learn more about the SSV network',
    });
    window.open('https://ssv.network/');
  };

  return (
    <BorderScreen
      withoutNavigation
      body={[
        <Grid container className={classes.Wrapper}>
          <HeaderSubHeader
            rewardPage
            title={'Rewards Successfully Claimed!'}
            subtitle={<span>Thank you for joining the SSV network's {networkTitle} Incentivization Program.<br />Your tokens have been transferred to your wallet.</span>}
          />
          <Grid item container className={classes.AddSsvToWallet}
            onClick={distributionStore.registerSSVTokenInMetamask.bind(distributionStore)}>
            <Grid item className={classes.MetaMask} />
            <Typography component={'span'}>Add SSV to Metamask</Typography>
          </Grid>
          <Grid className={classes.LinkWrapper}>
            <LinkText text={'View Transaction on Etherscan'}link={transactionLink(applicationStore.txHash)} />
          </Grid>
          <SecondaryButton submitFunction={openMarketingSite} text={'Learn more about the SSV network'} />
        </Grid>,
      ]}
    />
  );
};

export default observer(Success);