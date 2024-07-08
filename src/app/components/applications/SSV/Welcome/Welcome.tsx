import Grid from '@mui/material/Grid';
import config from '~app/common/config';
import { useNavigate } from 'react-router-dom';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import { useStyles } from '~app/components/applications/SSV/Welcome/Welcome.styles';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getAccountAddress } from '~app/redux/wallet.slice';
import { SecondaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';
import styled from 'styled-components';
import { WalletButton } from '~app/components/common/AppBar/components/ConnectWalletButton/ConnectWalletButton.tsx';

const WelcomeImage = styled.div`
  width: 420px;
  height: 274px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(/images/robot_rocket.svg);
  margin: auto auto 32px;
`;

const Welcome = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const accountAddress = useAppSelector(getAccountAddress);

  if (!accountAddress) {
    return (
      <BorderScreen
        withoutNavigation
        body={[
          <Grid container>
            <HeaderSubHeader title={'Welcome to SSV Network'} subtitle={'Connect your wallet to run distributed validators, or join as an operator.'} />
            <WelcomeImage />
            <WalletButton dontShowConnectedStatus />
          </Grid>
        ]}
      />
    );
  }

  return (
    <BorderScreen
      withoutNavigation
      body={[
        <Grid container>
          <HeaderSubHeader title={'Join the SSV Network'} subtitle={'Distribute your validator to run on the SSV network or help maintain it as one of its operators.'} />
          <Grid container item className={classes.LinkButtonsWrapper}>
            <Grid item className={classes.LinkButtonWrapper}>
              <SecondaryButton
                text={'Distribute Validator'}
                isDisabled={!accountAddress}
                onClick={() => {
                  accountAddress && navigate(config.routes.SSV.VALIDATOR.HOME);
                }}
                size={ButtonSize.XL}
              />
            </Grid>
            <Grid item className={classes.LinkButtonWrapper}>
              <SecondaryButton
                text={'Join as Operator'}
                isDisabled={!accountAddress}
                onClick={() => {
                  accountAddress && navigate(config.routes.SSV.OPERATOR.HOME);
                }}
                size={ButtonSize.XL}
              />
            </Grid>
          </Grid>
        </Grid>
      ]}
    />
  );
};

export default Welcome;
