import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import BorderScreen from '~app/components/common/BorderScreen';
import { getCurrentNetwork, NETWORKS } from '~lib/utils/envHelper';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import { useStyles } from '~app/components/applications/SSV/Welcome/Welcome.styles';
import { useConnectWallet } from '@web3-onboard/react';

const Welcome = () => {
    const stores = useStores();
    const classes = useStyles();
    const applicationStore: ApplicationStore = stores.Application;
    const walletStore: WalletStore = stores.Wallet;
    const { networkId } = getCurrentNetwork();
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  const connectWallet = useConnectWallet();
    const titleNetwork = networkId === NETWORKS.MAINNET ? 'Mainnet' : 'Testnet';

    const connectToWallet = () => {
      if (walletStore.connected) {
          return applicationStore.showWalletPopUp(true);
      }
      console.log('connectWallet before');
      connectWallet[1]();
      console.log('connectWallet after');
      // return walletStore.connect();
    };

    return (
      <BorderScreen
        withoutNavigation
        body={[
          <Grid container>
            <HeaderSubHeader title={`Claim ${titleNetwork} Rewards`}
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
