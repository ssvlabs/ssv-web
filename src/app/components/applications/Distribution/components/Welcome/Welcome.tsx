import Grid from '@mui/material/Grid';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useChainId } from 'wagmi';
import PrimaryButton from '~app/atomicComponents/PrimaryButton';
import { useStyles } from '~app/components/applications/SSV/Welcome/Welcome.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { setIsShowWalletPopup } from '~app/redux/appState.slice';
import { getAccountAddress } from '~app/redux/wallet.slice';
import { MAINNET_NETWORK_ID } from '~root/providers/networkInfo.provider';

const Welcome = () => {
  const classes = useStyles();
  const accountAddress = useAppSelector(getAccountAddress);
  const chainId = useChainId();
  const { openConnectModal } = useConnectModal();
  const titleNetwork = chainId === MAINNET_NETWORK_ID ? 'Mainnet' : 'Testnet';
  const dispatch = useAppDispatch();

  const connectToWallet = async () => {
    if (!!accountAddress) {
      dispatch(setIsShowWalletPopup(true));
    } else {
      return openConnectModal?.();
    }
  };

  return (
    <BorderScreen
      withoutNavigation
      body={[
        <Grid container>
          <HeaderSubHeader title={`Claim ${titleNetwork} Rewards`} subtitle={'Connect your wallet to check your rewards eligibility'} />
          <Grid container item className={classes.ImageWrapper} />
          <PrimaryButton text={'Connect Wallet'} onClick={connectToWallet} size={ButtonSize.XL} />
        </Grid>
      ]}
    />
  );
};

export default Welcome;
