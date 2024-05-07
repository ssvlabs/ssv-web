
import Grid from '@mui/material/Grid';
import config from '~app/common/config';
import { useNavigate } from 'react-router-dom';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import { useStyles } from '~app/components/applications/SSV/Welcome/Welcome.styles';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getAccountAddress } from '~app/redux/wallet.slice';

const Welcome = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const accountAddress = useAppSelector(getAccountAddress);

  return (
    <BorderScreen
      withoutNavigation
      body={[
        <Grid container>
          <HeaderSubHeader
            title={'Join the SSV Network'}
            subtitle={'Distribute your validator to run on the SSV network or help maintain it as one of its operators.'}
          />
          <Grid container item className={classes.LinkButtonsWrapper}>
            <Grid item className={classes.LinkButtonWrapper}>
              <SecondaryButton
                children={'Distribute Validator'}
                disable={!accountAddress}
                submitFunction={() => { accountAddress && navigate(config.routes.SSV.VALIDATOR.HOME); }}
              />
            </Grid>
            <Grid item className={classes.LinkButtonWrapper}>
              <SecondaryButton
                children={'Join as Operator'}
                disable={!accountAddress}
                submitFunction={() => { accountAddress && navigate(config.routes.SSV.OPERATOR.HOME); }}
              />
            </Grid>
          </Grid>
        </Grid>,
      ]}
    />
  );
};

export default Welcome;
