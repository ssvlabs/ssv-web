import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { useStyles } from '~app/components/applications/SSV/RegisterOperatorHome/RegisterOperatorHome.styles';
import { SecondaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';

const RegisterOperatorHome = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <BorderScreen
      marginTop={0}
      subHeaderText={'Join the SSV Network'}
      body={[
        <Grid container>
          <HeaderSubHeader
            title={'Join the SSV Network Operators'}
            subtitle={'To join as an network operator, you must run an SSV node. Start with your node setup and return here to register your operator key.'}
          />
          <Grid container item>
            <Grid container item className={classes.LinkButtonWrapper}>
              <Grid item xs={12}>
                <SecondaryButton
                  text={'Run SSV Node'}
                  onClick={() => {
                    GoogleTagManager.getInstance().sendEvent({
                      category: 'external_link',
                      action: 'click',
                      label: 'Run SSV Node'
                    });
                    window.open('https://docs.ssv.network/run-a-node/operator-node/installation');
                  }}
                  size={ButtonSize.XL}
                />
              </Grid>
              <Grid item xs={12} className={classes.UnderButtonText}>
                Follow our installation docs
              </Grid>
            </Grid>
            <Grid container item className={classes.LinkButtonWrapper}>
              <Grid item xs={12}>
                <SecondaryButton
                  text={'Register Operator'}
                  onClick={() => {
                    navigate(config.routes.SSV.OPERATOR.GENERATE_KEYS);
                  }}
                  size={ButtonSize.XL}
                />
              </Grid>
              <Grid item xs={12} className={classes.UnderButtonText}>
                Sign up with your operator key
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ]}
    />
  );
};

export default observer(RegisterOperatorHome);
