import { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import BorderScreen from '~app/components/common/BorderScreen';
import { useStyles } from '~app/components/applications/Faucet/ConnectWallet/ConnectWallet.styles';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { setIsShowWalletPopup } from '~app/redux/appState.slice';
import { currentNetworkName } from '~root/providers/networkInfo.provider';
import { getAccountAddress } from '~app/redux/wallet.slice';
import PrimaryButton from '~app/atomicComponents/PrimaryButton';
import { ButtonSize } from '~app/enums/Button.enum';
// TODO: reduce to single component for wallet connection
const ConnectWallet = () => {
  const classes = useStyles();
  const accountAddress = useAppSelector(getAccountAddress);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // if (isMainnet() && walletStore.wallet) {
    //   // TODO use useSetChain hook instead
    //     // walletStore.changeNetwork(NETWORKS.HOLESKY);
    // }
  }, []);

  const connectToWallet = () => {
    if (accountAddress) {
      dispatch(setIsShowWalletPopup(true));
    }
  };

  return (
    <BorderScreen
      blackHeader
      withoutNavigation
      header={`SSV Faucet ${currentNetworkName()} Testnet`}
      body={[
        <Grid container>
          <Typography className={classes.SubHeader}>Connect your wallet to receive testnet SSV for testing purposes.</Typography>
          <Grid item className={classes.Warning}>
            Funds received through the SSV faucet are not real funds and hold no value.
          </Grid>
          <PrimaryButton text={'Connect Wallet'} onClick={connectToWallet} size={ButtonSize.XL} />
        </Grid>
      ]}
    />
  );
};

export default ConnectWallet;
