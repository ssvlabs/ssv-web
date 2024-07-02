import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '~app/atomicComponents/PrimaryButton';
import config from '~app/common/config';
import { useStyles } from '~app/components/applications/Faucet/SuccessPage/SuccessPage.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAddSSVTokenToMetamask } from '~app/hooks/useAddSSVTokenToMetamask';

const SuccessPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const requestForSSV = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(config.routes.FAUCET.ROOT);
    }, 300);
  };

  const addSSVTokenToMetamask = useAddSSVTokenToMetamask();

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
            <Grid container item className={classes.AddToMetamask} onClick={() => addSSVTokenToMetamask.mutate()}>
              <Grid className={classes.MetaMask} />
              <Typography>Add SSV to Metamask</Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12} className={classes.TextWrapper}>
            <PrimaryButton text={'Request More Funds'} onClick={requestForSSV} isLoading={isLoading} size={ButtonSize.XL} />
          </Grid>
        </Grid>
      ]}
    />
  );
};

export default SuccessPage;
