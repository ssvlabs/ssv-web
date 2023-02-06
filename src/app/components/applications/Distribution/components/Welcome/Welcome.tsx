import React from 'react';
import { Grid } from '@mui/material';
import { observer } from 'mobx-react';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import { useStyles } from '~app/components/applications/SSV/Welcome/Welcome.styles';

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
            <Grid container item className={classes.ImageWrapper} />
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
