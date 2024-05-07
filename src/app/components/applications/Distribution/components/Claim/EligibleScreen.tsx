
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import InputLabel from '~app/components/common/InputLabel';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import { useDistributionStore } from '~app/hooks/useDistributionStore';
import DistributionStore from '~app/common/stores/applications/Distribution/Distribution.store';
import { useStyles } from '~app/components/applications/Distribution/components/Claim/Claim.styles';
import DistributionTestnetStore from '~app/common/stores/applications/Distribution/DistributionTestnet.store';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getAccountAddress } from '~app/redux/wallet.slice';
import PrimaryButton from '~app/atomicComponents/PrimaryButton';
import { ButtonSize } from '~app/enums/Button.enum';

const EligibleScreen = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const accountAddress = useAppSelector(getAccountAddress);
  const { networkId } = getStoredNetwork();
  const distributionStore: DistributionStore | DistributionTestnetStore = useDistributionStore(networkId);

  const claimRewards = async () => {
    if (!distributionStore.userAddress || distributionStore.claimed) {
      return;
    }
    const succeed = await distributionStore.claimRewards();
    if (succeed) navigate(config.routes.DISTRIBUTION.SUCCESS);
  };

  const claimedCondition = Number(distributionStore.userRewardAmount) !== 0;

  return (
    <BorderScreen
      withoutNavigation
      body={[
        <Grid container>
          <HeaderSubHeader
            title={'Congrats, you are eligible for the following rewards!'}
          />
          <InputLabel title="Recipient"/>
          <Grid className={classes.RecipientWrapper}>
            <Typography className={classes.RecipientAddress}>{accountAddress}</Typography>
          </Grid>
          {(distributionStore instanceof DistributionStore) && distributionStore.userEligibleRewards &&
            <Grid className={classes.RewardWrapper}>
              <Typography className={classes.RewardTitle}>Eligible Rewards</Typography>
              <Typography className={classes.RewardAmount}>{distributionStore.userEligibleRewards} SSV</Typography>
            </Grid>}
          {(distributionStore instanceof DistributionStore) && distributionStore.claimedRewards &&
            <Grid className={classes.RewardWrapper}>
              <Typography className={classes.RewardTitle}>Claimed Rewards</Typography>
              <Typography className={classes.RewardAmount}>{distributionStore.claimedRewards} SSV</Typography>
            </Grid>}
          <Grid container item className={classes.EligibleWrapper}>
            <InputLabel title="Eligible Reward"/>
            <Grid container className={classes.Eligible}>
              <Grid item className={classes.EligibleAmount}>{distributionStore.userRewardAmount}</Grid>
              <Grid item className={classes.CompanyIcon}/>
              <Grid item className={classes.EligibleAmount}>SSV</Grid>
            </Grid>
          </Grid>
          <PrimaryButton
            isDisabled={!claimedCondition}
            onClick={claimRewards}
            text={claimedCondition ? 'Claim SSV Reward' : 'All Rewards Claimed'}
            size={ButtonSize.XL}/>
        </Grid>,
      ]}
    />
  );
};

export default observer(EligibleScreen);
