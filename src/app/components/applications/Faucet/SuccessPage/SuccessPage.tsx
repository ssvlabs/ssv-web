import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import { useStyles } from '~app/components/applications/Faucet/SuccessPage/SuccessPage.styles';
import { useAppDispatch } from '~app/hooks/redux.hook';
import { setIsLoading } from '~app/redux/appState.slice';
import { registerSSVTokenInMetamask } from '~root/services/distribution.service';
import WalletStore from '~app/common/stores/applications/Faucet/Wallet.store';
import { useStores } from '~app/hooks/useStores';

const SuccessPage = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
  const stores = useStores();
  const walletStore: WalletStore = stores.Wallet;

    const requestForSSV = () => {
      dispatch(setIsLoading(true));
        setTimeout(() => {
          dispatch(setIsLoading(false));
            navigate(config.routes.FAUCET.ROOT);
        }, 300);
    };

    return (
      <BorderScreen
        blackHeader
        withoutNavigation
        header={'SSV Faucet Goerli Testnet'}
        body={[
          <Grid container className={classes.Wrapper}>
            <Grid container item xs={12} className={classes.TextWrapper}>
              <Typography>Testnet SSV was successfully sent to your wallet - you can now go back to fund your account.</Typography>
              <Typography>Please note that funds might take a few minutes to arrive.</Typography>
            </Grid>
            <Grid container item xs={12} className={classes.TextWrapper}>
              <Typography>Can&apos;t find your tokens?</Typography>
              <Grid container item className={classes.AddToMetamask} onClick={() => walletStore?.wallet && registerSSVTokenInMetamask({ provider: walletStore.wallet.provider })}>
                <Grid className={classes.MetaMask} />
                <Typography>Add SSV to Metamask</Typography>
              </Grid>
            </Grid>
            <Grid container item xs={12} className={classes.TextWrapper}>
              <PrimaryButton
                disable={false}
                children={'Request More Funds'}
                withVerifyConnection={false}
                submitFunction={requestForSSV}
              />
            </Grid>
          </Grid>,
        ]}
      />
    );
};

export default observer(SuccessPage);
