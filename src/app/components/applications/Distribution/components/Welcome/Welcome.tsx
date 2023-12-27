import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import { useStyles } from '~app/components/applications/SSV/Welcome/Welcome.styles';
import { useConnectWallet } from '@web3-onboard/react';
import { getStoredNetwork, NETWORKS } from '~root/providers/networkInfo.provider';

const Welcome = () => {
    const stores = useStores();
    const classes = useStyles();
    const applicationStore: ApplicationStore = stores.Application;
    const walletStore: WalletStore = stores.Wallet;
    const { networkId } = getStoredNetwork();
    const [_, connect] = useConnectWallet();
    const titleNetwork = networkId === NETWORKS.MAINNET ? 'Mainnet' : 'Testnet';

    const connectToWallet = async () => {
      if (walletStore.connected) {
          applicationStore.showWalletPopUp(true);
      } else {
        await connect();
      }
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
