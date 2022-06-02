import React from 'react';
import { observer } from 'mobx-react';
import { Grid, Typography } from '@material-ui/core';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/PrimaryButton';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from './ConnectWallet.styles';

const ConnectWallet = () => {
    const stores = useStores();
    const classes = useStyles();
    const walletStore: WalletStore = stores.Wallet;
    const applicationStore: ApplicationStore = stores.Application;

    const connectToWallet = () => {
        if (walletStore.connected) {
            return applicationStore.showWalletPopUp(true);
        }
        return walletStore.connect();
    };

    return (
      <BorderScreen
        blackHeader
        withoutNavigation
        header={'SSV Faucet Goerli Testnet'}
        body={[
          <Grid container>
            <Typography className={classes.SubHeader}>Connect your wallet to receive testnet SSV for testing purposes.</Typography>
            <Grid item className={classes.Warning}>
              Funds received through the SSV faucet are not real funds and hold no value.
            </Grid>
            <PrimaryButton text={'Connect Wallet'} submitFunction={connectToWallet} disable={false} withVerifyConnection={false} />
          </Grid>,
        ]}
      />
    );
};

export default observer(ConnectWallet);
