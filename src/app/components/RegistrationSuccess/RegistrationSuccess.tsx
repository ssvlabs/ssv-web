import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { translations } from '~app/common/config';
import Header from '~app/common/components/Header';
import { useStyles } from '~app/components/Welcome/Welcome.styles';

const RegistrationSuccess = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.mainContainer}>
      <Header title={translations.VALIDATOR.SUCCESS.TITLE} subtitle={translations.VALIDATOR.SUCCESS.DESCRIPTION} />

      <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
        <Grid item xs zeroMinWidth className={classes.gridContainer}>
          TODO: finish this screen
        </Grid>
      </Grid>
    </Paper>
  );
};

export default observer(RegistrationSuccess);
