import React from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from './OperatorSuccessPage.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import OperatorId from '~app/components/applications/SSV/MyAccount/components/Operator/common/OperatorId';
import LinkText from '~app/components/common/LinkText/LinkText';

const SetOperatorFee = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  // const walletStore: WalletStore = stores.Wallet;
  const operatorStore: OperatorStore = stores.Operator;
  const applicationStore: ApplicationStore = stores.Application;

  const moveToMyAccount = async () => {
    applicationStore.setIsLoading(true);
    setTimeout(() => {
      applicationStore.setIsLoading(false);
      navigate(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
    }, 5000);
  };

  return (
      <BorderScreen
          withoutNavigation
          body={[
            <Grid className={classes.Wrapper}>
              <Grid item className={classes.BackgroundImage}/>
              <HeaderSubHeader
                  marginBottom={13}
                  title={'Welcome to the SSV Network!'}
                  subtitle={'Congrats, your operator is live and is now part of the SSV network!'}
              />
              <Grid container item style={{ marginBottom: 16 }}>
                <Typography className={classes.Text}>Your network identifier is the following:</Typography>
              </Grid>
              <Grid>
                <OperatorId successPage id={operatorStore.newOperatorKeys.id}/>
              </Grid>
            </Grid>,
            <Grid className={classes.Wrapper}>
              <Typography className={classes.GreyHeader}>Things that will help you out:</Typography>
              <Grid container className={classes.BoxesWrapper}>
                <Grid className={classes.BoxWrapper}>
                  <LinkText text={'Submit detailed information'} link={'https://docs.ssv.network/run-a-node/operator-node'} /> about you
                  operator node on file drive to increase your chances of being selected by validators
                </Grid>
                <Grid className={classes.BoxWrapper}>
                  <LinkText text={'Learn more about how to monitor your node'} link={'https://docs.ssv.network/run-a-node/operator-node'} /> by reading our documentation. Monitoring your node is important for ensuring its uptime and performance
                </Grid>
              </Grid>
              <Typography className={classes.Text} style={{ marginTop: 24, marginBottom: 24 }}>To manage your operator enter your account dashboard.</Typography>
              <PrimaryButton disable={false} text={'Manage Operator'} submitFunction={moveToMyAccount}/>
            </Grid>,
          ]}
      />
  );
};

export default observer(SetOperatorFee);
