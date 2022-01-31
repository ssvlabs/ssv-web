import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import config from '~app/common/config';
import HeaderSubHeader from '~app/common/components/HeaderSubHeader';
import SecondaryButton from '~app/common/components/SecondaryButton/SecondaryButton';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import { useStyles } from '~app/components/GenerateOperatorKeys/GenerateOperatorKeys.styles';

const RegisterOperatorHome = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <BorderScreen
      navigationLink={config.routes.HOME}
      body={[
        <Grid container>
          <HeaderSubHeader title={'Join the SSV Network Operators'}
            subtitle={'To join the network of operators you must run an SSV node. Setup your node, generate operator keys and register to the network.'}
          />
          <Grid container item justify={'space-evenly'}>
            <Grid container item className={classes.LinkButtonWrapper}>
              <Grid item xs={12}>
                <SecondaryButton text={'Run SSV Node'} onClick={() => { window.open(config.links.LINK_SSV_DEV_DOCS); }} />
              </Grid>
              <Grid item xs={12} className={classes.UnderButtonText}>
                See our developer documentation
              </Grid>
            </Grid>
            <Grid container item className={classes.LinkButtonWrapper}>
              <Grid item xs={12}>
                <SecondaryButton text={'Register Operator'} onClick={() => { history.push(config.routes.OPERATOR.GENERATE_KEYS); }} />
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
