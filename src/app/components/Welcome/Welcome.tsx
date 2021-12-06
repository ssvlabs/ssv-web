import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import PrimaryButton from '~app/common/components/PrimaryButton';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import { useStyles } from '~app/components/Welcome/Welcome.styles';
import ApplicationStore from '~app/common/stores/Application.store';
import SecondaryButton from '~app/common/components/SecondaryButton';
import HeaderSubHeader from '~app/common/components/HeaderSubHeader';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';

const Welcome = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
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
        body={[
          <Grid container>
            <HeaderSubHeader title={'Join the SSV Network'}
              subtitle={'Run your validator on the decentralized infrastructure of Ethereum staking or help maintain it as one of its operators'}
            />
            <Grid container item justify={'space-evenly'}>
              <Grid item className={classes.LinkButtonWrapper}>
                <SecondaryButton text={'Run Validator'} onClick={() => { history.push(config.routes.VALIDATOR.HOME); }} />
              </Grid>
              <Grid item className={classes.LinkButtonWrapper}>
                <SecondaryButton text={'Join as Operator'} onClick={() => { history.push(config.routes.OPERATOR.HOME); }} />
              </Grid>
            </Grid>
            {!walletStore.connected && (
              <Grid container item className={classes.OrLineWrapper}>
                <Grid item className={classes.Line} />
                <Grid item className={classes.Or}>OR</Grid>
                <Grid item className={classes.Line} />
              </Grid>
              )}
            {!walletStore.connected && (
              <PrimaryButton
                text={'Connect Wallet'}
                onClick={connectToWallet}
                dataTestId={'connect-to-wallet-button'}
              />
              )}
          </Grid>,
            ]}
        />
    );
};

export default observer(Welcome);
