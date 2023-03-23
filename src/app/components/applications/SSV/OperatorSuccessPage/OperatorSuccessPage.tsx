import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from './OperatorSuccessPage.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import OperatorId from '~app/components/applications/SSV/NewMyAccount/components/OperatorId';
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
      navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD);
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
                  subtitle={'Congrats, your operator is now part of the SSV network!'}
              />
              <Grid container item style={{ marginBottom: 16 }}>
                <Typography className={classes.Text}>Your network identifier is:</Typography>
              </Grid>
              <Grid>
                <OperatorId successPage id={operatorStore.newOperatorKeys.id}/>
              </Grid>
            </Grid>,
            <Grid className={classes.Wrapper}>
              <Typography className={classes.GreyHeader}>Things that will help you out:</Typography>
              <Grid container className={classes.BoxesWrapper}>
                <Grid className={classes.BoxWrapper} xs={12}>
                  <LinkText text={'Provide metadata'} link={'https://docs.ssv.network/run-a-node/operator-node'} /> to increase your operator discoverability and
                  chances of attracting other stakers.
                </Grid>
                <Grid className={classes.BoxWrapper} xs={12}>
                  <LinkText text={'Monitor your node'} link={'https://docs.ssv.network/run-a-node/operator-node'} /> to improve your operator performance and uptime.
                </Grid>
              </Grid>
              <PrimaryButton disable={false} text={'Manage Operator'} submitFunction={moveToMyAccount}/>
            </Grid>,
          ]}
      />
  );
};

export default observer(SetOperatorFee);
