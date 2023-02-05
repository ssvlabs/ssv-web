import React from 'react';
import { Grid } from '@mui/material';
import { observer } from 'mobx-react';
import config from '~app/common/config';
import { useNavigate } from 'react-router-dom';
import { useStyles } from './GenerateKeyShares.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';

const GenerateKeyShares = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
      <BorderScreen
          body={[
            <Grid container style={{ gap: 24 }}>
              <HeaderSubHeader
                  marginBottom={0.01}
                  title={'Generate Validator KeyShares'}
                  subtitle={<>To run a Distributed Validator you must split your validation key into <br/>
                    <b>Key Shares</b> and distribute them across your selected operators to<br/>
                    operate in your behalf.</>}
              />
              <Grid item className={classes.Image} />
              <HeaderSubHeader
                  marginBottom={0.01}
                  subtitle={'Select your preferred method to split your key:'}
              />
              <Grid container item className={classes.LinkButtonsWrapper}>
                <Grid container item className={classes.LinkButtonWrapper}>
                  <SecondaryButton
                      dataTestId={'online'}
                      withVerifyConnection
                      text={'Online'}
                      submitFunction={() => {
                        navigate(config.routes.SSV.VALIDATOR.IMPORT);
                      }}
                  />
                  <Grid item xs={12} className={classes.UnderButtonText}>
                    Split key via the webapp
                  </Grid>
                </Grid>
                <Grid container item className={classes.LinkButtonWrapper}>
                  <SecondaryButton
                      dataTestId={'offline'}
                      withVerifyConnection
                      text={'Offline'}
                      submitFunction={() => {
                        navigate(config.routes.SSV.VALIDATOR.DISTRIBUTION_METHOD.DISTRIBUTE_OFFLINE);
                      }}
                  />
                  <Grid item xs={12} className={classes.UnderButtonText}>
                    Split key on your computer
                  </Grid>
                </Grid>
              </Grid>
            </Grid>,
          ]}
      />
  );
};

export default observer(GenerateKeyShares);
