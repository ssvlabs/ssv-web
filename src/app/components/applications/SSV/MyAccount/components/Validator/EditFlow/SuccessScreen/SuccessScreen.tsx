import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import config from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import { useStyles } from './SuccessScreen.styles';

const SuccessScreen = () => {
  const classes = useStyles();
  const history = useHistory();

  setTimeout(() => {
    history.push(config.routes.SSV.MY_ACCOUNT.VALIDATOR.ROOT);
  }, 5000);

  return (
    <BorderScreen
      blackHeader
      withoutNavigation
      borderRadius={'16px 16px 0px 0px'}
      header={'Your Validator Has been Updated'}
      sectionClass={classes.SectionWrapper}
      wrapperClass={classes.Wrapper}
      body={[
        <Grid item container className={classes.Wrapper}>
          <Grid item className={classes.BackgroundImage} />
          <Grid item className={classes.Text}>You are being redirected to your validator.</Grid>
        </Grid>,
      ]}
    />
  );
};

export default observer(SuccessScreen);
