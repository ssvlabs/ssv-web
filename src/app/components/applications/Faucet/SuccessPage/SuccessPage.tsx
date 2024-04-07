import React from 'react';
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
import { AlertColor } from '@mui/material/Alert';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';
import { useConnectWallet } from '@web3-onboard/react';

const SuccessPage = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
  const [{  wallet }] = useConnectWallet();

    const requestForSSV = () => {
      dispatch(setIsLoading(true));
        setTimeout(() => {
          dispatch(setIsLoading(false));
            navigate(config.routes.FAUCET.ROOT);
        }, 300);
    };

  const notificationHandler = ({ message, severity }: { message: string; severity: AlertColor }) => {
    dispatch(setMessageAndSeverity({ message, severity }));
  };

    return (
      <BorderScreen
        blackHeader
        withoutNavigation
        header={'SSV Faucet Holesky Testnet'}
        body={[
          <Grid container className={classes.Wrapper}>
            <Grid container item xs={12} className={classes.TextWrapper}>
              <Typography>Testnet SSV was successfully sent to your wallet - you can now go back to fund your account.</Typography>
              <Typography>Please note that funds might take a few minutes to arrive.</Typography>
            </Grid>
            <Grid container item xs={12} className={classes.TextWrapper}>
              <Typography>Can&apos;t find your tokens?</Typography>
              <Grid container item className={classes.AddToMetamask} onClick={() => wallet && registerSSVTokenInMetamask({ provider: wallet.provider, notificationHandler })}>
                <Grid className={classes.MetaMask} />
                <Typography>Add SSV to Metamask</Typography>
              </Grid>
            </Grid>
            <Grid container item xs={12} className={classes.TextWrapper}>
              <PrimaryButton disable={false} children={'Request More Funds'} submitFunction={requestForSSV} />
            </Grid>
          </Grid>,
        ]}
      />
    );
};

export default SuccessPage;
