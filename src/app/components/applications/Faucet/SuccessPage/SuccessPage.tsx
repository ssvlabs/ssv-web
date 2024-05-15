import { AlertColor } from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useConnectWallet } from '@web3-onboard/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '~app/atomicComponents/PrimaryButton';
import config from '~app/common/config';
import { useStyles } from '~app/components/applications/Faucet/SuccessPage/SuccessPage.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppDispatch } from '~app/hooks/redux.hook';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';
import { registerSSVTokenInMetamask } from '~root/services/distribution.service';

const SuccessPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [{ wallet }] = useConnectWallet();

  const requestForSSV = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
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
            <Typography>Testnet SSV was successfully sent to your wallet - you can now go back to fund your
              account.</Typography>
            <Typography>Please note that funds might take a few minutes to arrive.</Typography>
          </Grid>
          <Grid container item xs={12} className={classes.TextWrapper}>
            <Typography>Can&apos;t find your tokens?</Typography>
            <Grid container item className={classes.AddToMetamask} onClick={() => wallet && registerSSVTokenInMetamask({
              provider: wallet.provider,
              notificationHandler,
            })}>
              <Grid className={classes.MetaMask}/>
              <Typography>Add SSV to Metamask</Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12} className={classes.TextWrapper}>
            <PrimaryButton text={'Request More Funds'} onClick={requestForSSV} isLoading={isLoading} size={ButtonSize.XL}/>
          </Grid>
        </Grid>,
      ]}
    />
  );
};

export default SuccessPage;
