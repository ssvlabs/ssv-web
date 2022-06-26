import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import FaucetStore from '~app/common/stores/applications/Faucet/Faucet.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from '~app/components/applications/Faucet/SuccessPage/SuccessPage.styles';

const SuccessPage = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const faucetStore: FaucetStore = stores.Faucet;
    const applicationStore: ApplicationStore = stores.Application;
    
    const requestForSSV = () => {
        applicationStore.setIsLoading(true);
        setTimeout(() => {
            applicationStore.setIsLoading(false);
            history.push(config.routes.FAUCET.DEPLETED);
        }, 2000);
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
              <Grid container item className={classes.AddToMetamask} onClick={faucetStore.registerSSVTokenInMetamask}>
                <Grid className={classes.MetaMask} />
                <Typography>Add SSV to Metamask</Typography>
              </Grid>
            </Grid>
            <Grid container item xs={12} className={classes.TextWrapper}>
              <PrimaryButton
                disable={false}
                text={'Request More Funds'}
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
