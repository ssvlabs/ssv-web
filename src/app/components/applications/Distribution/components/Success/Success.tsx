import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { SecondaryButton } from '~app/atomicComponents';
import { useStyles } from '~app/components/applications/Distribution/components/Success/Success.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import LinkText from '~app/components/common/LinkText';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppSelector } from '~app/hooks/redux.hook';
import { useAddSSVTokenToMetamask } from '~app/hooks/useAddSSVTokenToMetamask';
import { getTxHash } from '~app/redux/appState.slice';
import { getIsMainnet } from '~app/redux/wallet.slice';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { getTransactionLink } from '~root/providers/networkInfo.provider';

const Success = () => {
  const classes = useStyles();
  const txHash = useAppSelector(getTxHash);
  const isMainnet = useAppSelector(getIsMainnet);

  const openMarketingSite = () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'external_link',
      action: 'click',
      label: 'Learn more about the SSV network'
    });
    window.open('https://ssv.network/');
  };

  const addSSVTokenToMetamask = useAddSSVTokenToMetamask();

  return (
    <BorderScreen
      withoutNavigation
      body={[
        <Grid container className={classes.Wrapper}>
          <HeaderSubHeader
            rewardPage
            title={'Rewards Successfully Claimed!'}
            subtitle={
              <span>
                Thank you for joining the SSV network's {isMainnet ? 'Mainnet' : 'Testnet'} Incentivization Program.
                <br />
                Your tokens have been transferred to your wallet.
              </span>
            }
          />
          <Grid item container className={classes.AddSsvToWallet} onClick={() => addSSVTokenToMetamask.mutate()}>
            <Grid item className={classes.MetaMask} />
            <Typography component={'span'}>Add SSV to Metamask</Typography>
          </Grid>
          <Grid className={classes.LinkWrapper}>
            <LinkText text={'View Transaction on Etherscan'} link={getTransactionLink(txHash)} />
          </Grid>
          <SecondaryButton onClick={openMarketingSite} text={'Learn more about the SSV network'} size={ButtonSize.XL} />
        </Grid>
      ]}
    />
  );
};

export default Success;
