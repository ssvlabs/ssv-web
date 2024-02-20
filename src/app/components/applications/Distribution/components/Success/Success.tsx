import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LinkText from '~app/components/common/LinkText';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import { useDistributionStore } from '~app/hooks/useDistributionStore';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import { networkTitle, transactionLink } from '~lib/utils/envHelper';
import DistributionStore from '~app/common/stores/applications/Distribution/Distribution.store';
import { useStyles } from '~app/components/applications/Distribution/components/Success/Success.styles';
import DistributionTestnetStore from '~app/common/stores/applications/Distribution/DistributionTestnet.store';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getTxHash } from '~app/redux/appState.slice';

const Success = () => {
  const { networkId } = getStoredNetwork();
  const classes = useStyles();
  const distributionStore: DistributionStore | DistributionTestnetStore = useDistributionStore(networkId);
  const txHash = useAppSelector(getTxHash);

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
            <LinkText text={'View Transaction on Etherscan'} link={transactionLink(txHash)} />
          </Grid>
          <SecondaryButton submitFunction={openMarketingSite} children={'Learn more about the SSV network'} />
        </Grid>,
      ]}
    />
  );
};

export default Success;
