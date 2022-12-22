import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import SecondaryButton from '~app/components/common/Button/SecondaryButton/SecondaryButton';
import { useStyles } from '~app/components/applications/SSV/RegisterOperatorHome/RegisterOperatorHome.styles';

const RegisterOperatorHome = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <BorderScreen
      body={[
        <Grid container>
          <HeaderSubHeader title={'Join the SSV Network Operators'}
            subtitle={'To join the network of operators you must run an SSV node. Setup your node, generate operator keys and register to the network.'}
              />
          <Grid container item justify={'space-evenly'}>
            <Grid container item className={classes.LinkButtonWrapper}>
              <Grid item xs={12}>
                <SecondaryButton text={'Run SSV Node'} submitFunction={() => {
                      GoogleTagManager.getInstance().sendEvent({
                        category: 'external_link',
                        action: 'click',
                        label: 'Run SSV Node',
                      });
                      window.open('https://docs.ssv.network/run-a-node/operator-node/installation');
                    }} />
              </Grid>
              <Grid item xs={12} className={classes.UnderButtonText}>
                See our developer documentation
              </Grid>
            </Grid>
            <Grid container item className={classes.LinkButtonWrapper}>
              <Grid item xs={12}>
                <SecondaryButton text={'Register Operator'} submitFunction={() => {
                      navigate(config.routes.SSV.OPERATOR.GENERATE_KEYS);
                    }} />
              </Grid>
              <Grid item xs={12} className={classes.UnderButtonText}>
                Sign up as one of the network operators
              </Grid>
            </Grid>
          </Grid>
        </Grid>,
          ]}
      />
  );
};

export default observer(RegisterOperatorHome);