import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import PrimaryButton from '~app/atomicComponents/PrimaryButton';
import { useStyles } from '~app/components/applications/Faucet/ConnectWallet/ConnectWallet.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import { Alert, AlertDescription } from '~app/components/ui/alert';
import { ButtonSize } from '~app/enums/Button.enum';
import { currentNetworkName } from '~root/providers/networkInfo.provider';

const ConnectWallet = () => {
  const classes = useStyles();
  const { openConnectModal } = useConnectModal();

  return (
    <BorderScreen
      blackHeader
      withoutNavigation
      header={`SSV Faucet ${currentNetworkName()} Testnet`}
      body={[
        <Grid container className="flex flex-col gap-6">
          <Typography className={classes.SubHeader}>Connect your wallet to receive testnet SSV for testing purposes.</Typography>
          <Alert variant="warning">
            <AlertDescription>Funds received through the SSV faucet are not real funds and hold no value.</AlertDescription>
          </Alert>
          <PrimaryButton text={'Connect Wallet'} onClick={openConnectModal} size={ButtonSize.XL} />
        </Grid>
      ]}
    />
  );
};

export default ConnectWallet;
