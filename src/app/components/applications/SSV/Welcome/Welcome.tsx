import React from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import config from '~app/common/config';
import { useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import { useStyles } from '~app/components/applications/SSV/Welcome/Welcome.styles';
import { useConnectWallet } from '@web3-onboard/react';

const Welcome = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const walletStore: WalletStore = stores.Wallet;
  const applicationStore: ApplicationStore = stores.Application;
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  const connectWallet = useConnectWallet();

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
          <HeaderSubHeader
            title={'Join the SSV Network'}
            subtitle={'Distribute your validator to run on the SSV network or help maintain it as one of its operators.'}
          />
          <Grid container item className={classes.LinkButtonsWrapper}>
            <Grid item className={classes.LinkButtonWrapper}>
              <SecondaryButton
                withVerifyConnection
                text={'Distribute Validator'}
                submitFunction={() => {
                  walletStore.connected && navigate(config.routes.SSV.VALIDATOR.HOME);
                }}
              />
            </Grid>
            <Grid item className={classes.LinkButtonWrapper}>
              <SecondaryButton
                withVerifyConnection
                text={'Join as Operator'}
                submitFunction={() => {
                  walletStore.connected && navigate(config.routes.SSV.OPERATOR.HOME);
                }}
              />
            </Grid>
          </Grid>
          {!walletStore.connected && false && (
            <Grid container item className={classes.OrLineWrapper}>
              <Grid item className={classes.Line} xs />
              <Grid item className={classes.Or}>OR</Grid>
              <Grid item className={classes.Line} xs />
            </Grid>
          )}
          {!walletStore.connected && false && (
            <PrimaryButton
              withVerifyConnection
              text={'Connect Wallet'}
              submitFunction={connectToWallet}
              dataTestId={'connect-to-wallet-button'}
            />
          )}
        </Grid>,
      ]}
    />
  );
};

export default observer(Welcome);
