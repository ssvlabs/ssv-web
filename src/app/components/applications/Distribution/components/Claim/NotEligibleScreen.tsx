import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useDisconnect } from 'wagmi';
import PrimaryButton from '~app/atomicComponents/PrimaryButton';
import { useStyles } from '~app/components/applications/Distribution/components/Claim/Claim.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import InputLabel from '~app/components/common/InputLabel';
import { Alert, AlertDescription } from '~app/components/ui/alert';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getAccountAddress, getIsMainnet } from '~app/redux/wallet.slice';

const NotEligibleScreen = () => {
  const classes = useStyles();
  const accountAddress = useAppSelector(getAccountAddress);
  const isMainnet = useAppSelector(getIsMainnet);
  const { disconnect } = useDisconnect();

  return (
    <BorderScreen
      withoutNavigation
      body={[
        <Grid container>
          <HeaderSubHeader title={`Claim ${isMainnet ? 'Mainnet' : 'Testnet'} Rewards`} />
          <InputLabel title="Recipient" />
          <Grid className={classes.RecipientWrapper}>
            <Typography className={classes.RecipientAddress}>{accountAddress}</Typography>
          </Grid>
          <Alert variant="error" className="my-3">
            <AlertDescription>Address is not eligible for any rewards</AlertDescription>
          </Alert>
          <PrimaryButton onClick={disconnect} text={'Connect a Different Wallet'} size={ButtonSize.XL} />
        </Grid>
      ]}
    />
  );
};

export default NotEligibleScreen;
