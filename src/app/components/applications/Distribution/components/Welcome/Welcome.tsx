import React from 'react';
import Grid from '@mui/material/Grid';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import { useStyles } from '~app/components/applications/SSV/Welcome/Welcome.styles';
import { useConnectWallet } from '@web3-onboard/react';
import { getStoredNetwork, MAINNET_NETWORK_ID } from '~root/providers/networkInfo.provider';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { setIsShowWalletPopup } from '~app/redux/appState.slice';
import { getAccountAddress } from '~app/redux/wallet.slice';
import PrimaryButton from '~app/atomics/PrimaryButton';
import { ButtonSize } from '~app/enums/Button.enum';

const Welcome = () => {
    const classes = useStyles();
    const accountAddress = useAppSelector(getAccountAddress);
    const { networkId } = getStoredNetwork();
    const [_, connect] = useConnectWallet();
    const titleNetwork = networkId === MAINNET_NETWORK_ID ? 'Mainnet' : 'Testnet';
    const dispatch = useAppDispatch();

    const connectToWallet = async () => {
      if (!!accountAddress) {
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
            <HeaderSubHeader title={`Claim ${titleNetwork} Rewards`}
              subtitle={'Connect your wallet to check your rewards eligibility'} />
            <Grid container item className={classes.ImageWrapper} />
            <PrimaryButton
              text={'Connect Wallet'}
              onClick={connectToWallet}
             size={ButtonSize.XL}/>
          </Grid>,
        ]}
      />
    );
};

export default Welcome;
