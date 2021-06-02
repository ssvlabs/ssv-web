import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Link as RouterLink } from 'react-router-dom';
import Header from '~app/common/components/Header';
import config, { translations } from '~app/common/config';
import UnStyledLink from '~app/common/components/UnStyledLink';
import { useStyles } from '~app/components/Welcome/Welcome.styles';

const RouteLink = UnStyledLink(RouterLink);

const Welcome = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.mainContainer}>
      <Header title={translations.HOME.TITLE} subtitle={translations.HOME.DESCRIPTION} />
      <Grid container spacing={2} className={classes.gridContainer}>
        <Grid item xs zeroMinWidth className={classes.gridContainer} spacing={1}>
          <RouteLink to={config.routes.VALIDATOR.HOME} data-testid={config.routes.VALIDATOR.HOME}>
            <Paper className={classes.guideStepsContainerPaper}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <img src="/images/etherium.png" alt="Create Validator" className={classes.arrowIcon} />
                  <Typography component="h1">Run validator</Typography>
                </Grid>
              </Grid>
            </Paper>
          </RouteLink>
        </Grid>

        <Grid item xs zeroMinWidth className={classes.gridContainer} spacing={1}>
          <RouteLink to={config.routes.OPERATOR.HOME} data-testid={config.routes.OPERATOR.HOME}>
            <Paper className={classes.guideStepsContainerPaper}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <img src="/images/etherium.png" alt="Create Validator" className={classes.arrowIcon} />
                  <Typography component="h1">Join as operator</Typography>
                </Grid>
              </Grid>
            </Paper>
          </RouteLink>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default observer(Welcome);
