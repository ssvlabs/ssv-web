import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MaterialLink } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import config from '~app/common/config';
import UnStyledLink from '~app/common/components/UnStyledLink';
import Header from '~app/components/Welcome/components/Header';
import { useStyles } from '~app/components/Welcome/Welcome.styles';

const RouteLink = UnStyledLink(RouterLink);
const OrganicLink = UnStyledLink(MaterialLink);

const Welcome = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.mainContainer}>
      <Header />

      <Grid container wrap="nowrap" spacing={0} className={classes.guideStepsContainer}>
        <Grid item xs zeroMinWidth className={classes.guideStepsContainer}>
          <OrganicLink href={config.links.LINK_SSV_DEV_DOCS} target="_blank">
            <Paper className={classes.guideStepsContainerPaper}>
              <Grid container wrap="nowrap" spacing={1}>
                <Grid item md={8} xs={8}>
                  <Typography noWrap variant="h6">Run SSV Node</Typography>
                  <Typography noWrap variant="caption">See our developer documentation</Typography>
                </Grid>
                <Grid item md={4} xs={4}>
                  <ArrowForwardIosIcon className={classes.arrowIcon} />
                </Grid>
              </Grid>
            </Paper>
          </OrganicLink>
        </Grid>

        <Grid item xs zeroMinWidth className={classes.guideStepsContainer}>
          <RouteLink to={config.routes.OPERATOR.KEYS.GENERATE}>
            <Paper className={classes.guideStepsContainerPaper}>
              <Grid container wrap="nowrap" spacing={1}>
                <Grid item md={8} xs={8}>
                  <Typography noWrap variant="h6">Generate operator keys</Typography>
                  <Typography noWrap variant="caption">Create your network identifier</Typography>
                </Grid>
                <Grid item md={4} xs={4}>
                  <ArrowForwardIosIcon className={classes.arrowIcon} />
                </Grid>
              </Grid>
            </Paper>
          </RouteLink>
        </Grid>

        <Grid item xs zeroMinWidth className={classes.guideStepsContainer}>
          <RouteLink to={config.routes.NETWORK.REGISTER}>
            <Paper className={classes.guideStepsContainerPaper}>
              <Grid container wrap="nowrap" spacing={1}>
                <Grid item md={8} xs={8}>
                  <Typography noWrap variant="h6">Register to the network</Typography>
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

export default observer(Welcome);
