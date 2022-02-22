import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import TextInput from '~app/common/components/TextInput';
import InputLabel from '~app/common/components/InputLabel';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import HeaderSubHeader from '~app/common/components/HeaderSubHeader';
import DistributionStore from '~app/common/stores/Distribution.store';
import TransactionPendingPopUp from '~app/components/TransactionPendingPopUp';
import PrimaryButton from '~app/common/components/PrimaryButton/PrimaryButton';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import { useStyles } from '~app/components/Distribution/components/Claim/Claim.styles';

const Claim = () => {
    const stores = useStores();
    const classes = useStyles();
    const { history } = useUserFlow();
    const walletStore: WalletStore = stores.Wallet;
    const distributionStore: DistributionStore = stores.Distribution;

    const claimRewards = async () => {
        if (!distributionStore.userAddress) return;
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
            {!distributionStore.userAddress && (
            <Grid container item className={classes.ErrorMessage}>
              Address is not eligible for any rewards
            </Grid>
            )}
            {distributionStore.userAddress && (
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
              disable={!distributionStore.userAddress}
              wrapperClass={classes.CtaButton}
              text={distributionStore.userAddress ? 'Claim SSV Reward' : 'Connect a Different Wallet'}
              onClick={claimRewards}
              dataTestId={'connect-to-wallet-button'}
            />
          </Grid>,
        ]}
      />
    );
};

export default observer(Claim);
