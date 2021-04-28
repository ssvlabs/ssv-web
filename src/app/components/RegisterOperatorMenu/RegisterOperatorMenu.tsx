import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MaterialLink } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import config from '~app/common/config';
import Header from '~app/common/components/Header';
import UnStyledLink from '~app/common/components/UnStyledLink';
import BackNavigation from '~app/common/components/BackNavigation';
import { useStyles } from '~app/components/Home/Home.styles';

const RouteLink = UnStyledLink(RouterLink);
const OrganicLink = UnStyledLink(MaterialLink);

const RegisterOperatorMenu = () => {
  const classes = useStyles();
  const title = 'Join the SSV Network Operators';
  const subtitle = 'To join the network of operators you must run an SSV node.\nSetup your node, generate operator keys and register to the network.';

  return (
    <Paper className={classes.mainContainer}>
      <BackNavigation to={config.routes.OPERATOR.HOME} text="Join SSV Network" />
      <Header title={title} subtitle={subtitle} />

      <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
        <Grid item xs zeroMinWidth className={classes.gridContainer}>
          <OrganicLink href={config.links.LINK_SSV_DEV_DOCS} target="_blank">
            <Paper className={classes.guideStepsContainerPaper}>
              <Grid container wrap="nowrap" spacing={1}>
                <Grid item md={8} xs={8}>
                  <Typography noWrap variant="h6" className={classes.guideStepText}>Run SSV Node</Typography>
                  <Typography noWrap variant="caption">See our developer documentation</Typography>
                </Grid>
                <Grid item md={4} xs={4}>
                  <ArrowForwardIosIcon className={classes.arrowIcon} />
                </Grid>
              </Grid>
            </Paper>
          </OrganicLink>
        </Grid>

        <Grid item xs zeroMinWidth className={classes.gridContainer}>
          <OrganicLink href={config.links.LINK_SSV_DEV_DOCS} target="_blank">
            <Paper className={classes.guideStepsContainerPaper}>
              <Grid container wrap="nowrap" spacing={1}>
                <Grid item md={8} xs={8}>
                  <Typography noWrap variant="h6" className={classes.guideStepText}>Generate operator keys</Typography>
                  <Typography noWrap variant="caption">Create your network identifier</Typography>
                </Grid>
                <Grid item md={4} xs={4}>
                  <ArrowForwardIosIcon className={classes.arrowIcon} />
                </Grid>
              </Grid>
            </Paper>
          </OrganicLink>
        </Grid>

        <Grid item xs zeroMinWidth className={classes.gridContainer}>
          <RouteLink to={config.routes.OPERATOR.GENERATE_KEYS}>
            <Paper className={classes.guideStepsContainerPaper}>
              <Grid container wrap="nowrap" spacing={1}>
                <Grid item md={8} xs={8}>
                  <Typography noWrap variant="h6" className={classes.guideStepText}>Register to the network</Typography>
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

export default observer(RegisterOperatorMenu);
