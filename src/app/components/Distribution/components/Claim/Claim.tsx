import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import TextInput from '~app/common/components/TextInput';
import InputLabel from '~app/common/components/InputLabel';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import HeaderSubHeader from '~app/common/components/HeaderSubHeader';
import TransactionPendingPopUp from '~app/components/TransactionPendingPopUp';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import PrimaryButton from '~app/common/components/Buttons/PrimaryButton/PrimaryButton';
import { useStyles } from '~app/components/Distribution/components/Claim/Claim.styles';
import DistributionStore from '~app/common/stores/applications/Distribution/Distribution.store';

const Claim = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const walletStore: WalletStore = stores.Wallet;
    const distributionStore: DistributionStore = stores.Distribution;

    const claimRewards = async () => {
        if (!distributionStore.userAddress || distributionStore.claimed) {
            await walletStore.connect();
            return;
        }
        const succeed = await distributionStore.claimRewards();
        if (succeed) history.push(config.routes.DISTRIBUTION.SUCCESS);
    };

    return (
      <BorderScreen
        body={[
          <Grid container>
            {distributionStore.txHash && <TransactionPendingPopUp txHash={distributionStore.txHash} />}
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
              wrapperClass={classes.CtaButton}
              text={!distributionStore.claimed && distributionStore.userAddress ? 'Claim SSV Reward' : 'Connect a Different Wallet'}
              submitFunction={claimRewards}
              dataTestId={'connect-to-wallet-button'}
            />
          </Grid>,
        ]}
      />
    );
};

export default observer(Claim);
