import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Header from '~app/common/components/Header';
import config, { translations } from '~app/common/config';
import { useStyles } from '~app/components/Welcome/Welcome.styles';
import UnStyledLink from '~app/common/components/UnStyledLink';

const RouteLink = UnStyledLink(RouterLink);

const RegisterValidatorHome = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.mainContainer}>
      <Header title={translations.VALIDATOR.HOME.TITLE} subtitle={translations.VALIDATOR.HOME.DESCRIPTION} />
      <br />
      <Grid container wrap="nowrap" spacing={3} className={classes.rowGridContainer}>
        <Grid item xs={6} md={6} zeroMinWidth className={classes.rowGridContainer}>
          <RouteLink to={config.routes.VALIDATOR.CREATE} data-testid={config.routes.VALIDATOR.CREATE}>
            <Paper>
              <Grid container wrap="nowrap" className={classes.bigSquareButton}>
                <Grid item md={12} xs={12} className={classes.bigSquareButtonGrid}>
                  <img src="/images/etherium.png" alt="Create Validator" className={classes.bigSquareButtonIcon} />
                  <Typography noWrap variant="h6" className={classes.guideStepText}>Create Validator</Typography>
                </Grid>
              </Grid>
            </Paper>
          </RouteLink>
        </Grid>

        <Grid item xs={6} md={6} zeroMinWidth className={classes.rowGridContainer}>
          <RouteLink to={config.routes.VALIDATOR.IMPORT} data-testid={config.routes.VALIDATOR.IMPORT}>
            <Paper>
              <Grid container wrap="nowrap" className={classes.bigSquareButton}>
                <Grid item md={12} xs={12} className={classes.bigSquareButtonGrid}>
                  <img src="/images/etherium.png" alt="Import Validator" className={classes.bigSquareButtonIcon} />
                  <Typography noWrap variant="h6" className={classes.guideStepText}>Import Validator</Typography>
                </Grid>
              </Grid>
            </Paper>
          </RouteLink>
        </Grid>
      </Grid>

    </Paper>
  );
};

export default observer(RegisterValidatorHome);
