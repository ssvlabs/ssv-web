import React from 'react';
import { Grid } from '@mui/material';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import TextInput from '~app/components/common/TextInput';
import InputLabel from '~app/components/common/InputLabel';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import { useStyles } from '~app/components/applications/Distribution/components/Claim/Claim.styles';
import DistributionStore from '~app/common/stores/applications/Distribution/Distribution.store';

const Claim = () => {
    const stores = useStores();
    const classes = useStyles();
    const navigate = useNavigate();
    const walletStore: WalletStore = stores.Wallet;
    const distributionStore: DistributionStore = stores.Distribution;

    const claimRewards = async () => {
        if (!distributionStore.userAddress || distributionStore.claimed) {
            await walletStore.connect();
            return;
        }
        const succeed = await distributionStore.claimRewards();
        if (succeed) navigate(config.routes.DISTRIBUTION.SUCCESS);
    };

    return (
      <BorderScreen
        withoutNavigation
        body={[
          <Grid container>
            <HeaderSubHeader
              title={distributionStore.userAddress ? 'Congrats, you are eligible for the following rewards!' : 'Claim Testnet Rewards'}
              subtitle={distributionStore.userAddress ? 'Thank you for participating in the ssv.network testnet!' : ''}
            />
            <InputLabel title="Recipient" />
            <TextInput
              disable
              data-testid="new-operator-address"
              value={walletStore.accountAddress}
            />
            {(!distributionStore.userAddress || distributionStore.claimed) && (
            <Grid container item className={classes.ErrorMessage}>
                {distributionStore.claimed ? 'Rewards already claimed for this address' : 'Address is not eligible for any rewards'}
            </Grid>
            )}
            {distributionStore.userAddress && !distributionStore.claimed && (
              <Grid container item className={classes.EligibleWrapper}>
                <InputLabel title="Eligible Reward" />
                <Grid container className={classes.Eligible}>
                  <Grid item className={classes.EligibleAmount}>{distributionStore.userRewardAmount}</Grid>
                  <Grid item className={classes.CompanyIcon} />
                  <Grid item className={classes.EligibleAmount}>SSV</Grid>
                </Grid>
              </Grid>
            )}
            <PrimaryButton
              submitFunction={claimRewards}
              wrapperClass={classes.CtaButton}
              dataTestId={'connect-to-wallet-button'}
              text={!distributionStore.claimed && distributionStore.userAddress ? 'Claim SSV Reward' : 'Connect a Different Wallet'}
            />
          </Grid>,
        ]}
      />
    );
};

export default observer(Claim);
