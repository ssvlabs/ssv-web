import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import { useStyles } from '~app/components/Welcome/Welcome.styles';
import HeaderSubHeader from '~app/common/components/HeaderSubHeader';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import PrimaryButton from '~app/common/components/Button/PrimaryButton/PrimaryButton';

const Welcome = () => {
    const stores = useStores();
    const classes = useStyles();
    const applicationStore: ApplicationStore = stores.Application;
    const walletStore: WalletStore = stores.Wallet;
    
    const connectToWallet = () => {
        if (walletStore.connected) {
            return applicationStore.showWalletPopUp(true);
        }
        return walletStore.connect();
    };

    return (
      <BorderScreen
        withoutNavigation
        body={[
          <Grid container>
            <HeaderSubHeader title={'Claim Testnet Rewards'}
              subtitle={'Connect your wallet to check your rewards eligibility'} />
            {!walletStore.connected && false && (
            <Grid container item className={classes.OrLineWrapper}>
              <Grid item className={classes.Line} xs />
              <Grid item className={classes.Or}>OR</Grid>
              <Grid item className={classes.Line} xs />
            </Grid>
            )}
            <PrimaryButton
              text={'Connect Wallet'}
              submitFunction={connectToWallet}
              dataTestId={'connect-to-wallet-button'}
            />
          </Grid>,
        ]}
      />
    );
};

export default observer(Welcome);
