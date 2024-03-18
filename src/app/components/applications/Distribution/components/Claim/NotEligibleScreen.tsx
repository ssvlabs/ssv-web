import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStores } from '~app/hooks/useStores';
import InputLabel from '~app/components/common/InputLabel';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import { useStyles } from '~app/components/applications/Distribution/components/Claim/Claim.styles';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsMainnet } from '~app/redux/wallet.slice';

const NotEligibleScreen = () => {
  const stores = useStores();
  const classes = useStyles();
  const walletStore: WalletStore = stores.Wallet;
  const isMainnet = useAppSelector(getIsMainnet);

  const claimRewards = async () => {
      // await walletStore.connect();
      return;
  };

  return (
    <BorderScreen
      withoutNavigation
      body={[
        <Grid container>
          <HeaderSubHeader
            title={`Claim ${isMainnet ? 'Mainnet' : 'Testnet'} Rewards`}
          />
          <InputLabel title="Recipient" />
          <Grid className={classes.RecipientWrapper}>
            <Typography className={classes.RecipientAddress}>
              {walletStore.accountAddress}
            </Typography>
          </Grid>
            <Grid container item className={classes.ErrorMessage}>
              Address is not eligible for any rewards
            </Grid>
          <PrimaryButton
            submitFunction={claimRewards}
            wrapperClass={classes.CtaButton}
            dataTestId={'connect-to-wallet-button'}
            children={'Connect a Different Wallet'}
          />
        </Grid>,
      ]}
    />
  );
};

export default observer(NotEligibleScreen);
