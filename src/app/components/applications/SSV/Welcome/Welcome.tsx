import React from 'react';
import Grid from '@mui/material/Grid';
import config from '~app/common/config';
import { useNavigate } from 'react-router-dom';
import { useConnectWallet } from '@web3-onboard/react';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import { useStyles } from '~app/components/applications/SSV/Welcome/Welcome.styles';
import { useAppDispatch } from '~app/hooks/redux.hook';
import { setIsShowWalletPopup } from '~app/redux/appState.slice';

const Welcome = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const walletStore: WalletStore = stores.Wallet;
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  const [_, connect] = useConnectWallet();
  const dispatch = useAppDispatch();
  const connectToWallet = async () => {
    if (!!walletStore.wallet) {
      dispatch(setIsShowWalletPopup(true));
    } else {
      await connect();
    }
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
                children={'Distribute Validator'}  
                disable={!walletStore.wallet}     
                submitFunction={() => {
                  walletStore.wallet && navigate(config.routes.SSV.VALIDATOR.HOME);
                }}
              />
            </Grid>
            <Grid item className={classes.LinkButtonWrapper}>
              <SecondaryButton
                withVerifyConnection
                children={'Join as Operator'}
                disable={!walletStore.wallet}
                submitFunction={() => {
                  walletStore.wallet && navigate(config.routes.SSV.OPERATOR.HOME);
                }}
              />
            </Grid>
          </Grid>
          {!walletStore.wallet && false && (
            <Grid container item className={classes.OrLineWrapper}>
              <Grid item className={classes.Line} xs />
              <Grid item className={classes.Or}>OR</Grid>
              <Grid item className={classes.Line} xs />
            </Grid>
          )}
          {!walletStore.wallet && false && (
            <PrimaryButton
              withVerifyConnection
              children={'Connect Wallet'}
              submitFunction={connectToWallet}
              dataTestId={'connect-to-wallet-button'}
            />
          )}
        </Grid>,
      ]}
    />
  );
};

export default Welcome;
