import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import config from '~app/common/config';
import Header from '~app/common/components/Header';
import UnStyledLink from '~app/common/components/UnStyledLink';
import { useStyles } from '~app/components/Welcome/Welcome.styles';
import BackNavigation from '~app/common/components/BackNavigation';

const RouteLink = UnStyledLink(RouterLink);

const StartRegister = () => {
  const classes = useStyles();
  const title = 'Share validator keys with other operators';
  const subtitle = '';

  return (
    <Paper className={classes.mainContainer}>
      <BackNavigation to={config.routes.HOME} text="Join the SSV Network Operators" />
      <Header title={title} subtitle={subtitle} />

      <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
        <Grid item xs zeroMinWidth className={classes.gridContainer}>
          <RouteLink to={config.routes.OPERATOR.KEYS.GENERATE}>
            <Paper className={classes.guideStepsContainerPaper}>
              <Grid container wrap="nowrap" spacing={1}>
                <Grid item md={8} xs={8}>
                  <Typography noWrap variant="h6">Create new Operator</Typography>
                  <Typography noWrap variant="caption">Create your network identifier</Typography>
                </Grid>
                <Grid item md={4} xs={4}>
                  <ArrowForwardIosIcon className={classes.arrowIcon} />
                </Grid>
              </Grid>
            </Paper>
          </RouteLink>
        </Grid>

        <Grid item xs zeroMinWidth className={classes.gridContainer}>
          <RouteLink to={config.routes.VALIDATOR.SHARE}>
            <Paper className={classes.guideStepsContainerPaper}>
              <Grid container wrap="nowrap" spacing={1}>
                <Grid item md={8} xs={8}>
                  <Typography noWrap variant="h6">Share Validator Key</Typography>
                  <Typography noWrap variant="caption">List yourself in the network operators registry</Typography>
                </Grid>
                <Grid item md={4} xs={4}>
                  <ArrowForwardIosIcon className={classes.arrowIcon} />
                </Grid>
              </Grid>
            </Paper>
          </RouteLink>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default observer(StartRegister);
