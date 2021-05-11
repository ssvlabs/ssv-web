import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { Link as MaterialLink } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Header from '~app/common/components/Header';
import config, { translations } from '~app/common/config';
import { useStyles } from '~app/components/Welcome/Welcome.styles';
import UnStyledLink from '~app/common/components/UnStyledLink';

const RouteLink = UnStyledLink(RouterLink);
const OrganicLink = UnStyledLink(MaterialLink);

const RegisterValidatorHome = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.mainContainer}>
      TEST
      <Header title={translations.OPERATOR.HOME.TITLE} subtitle={translations.OPERATOR.HOME.DESCRIPTION} />

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
          <RouteLink to={config.routes.OPERATOR.GENERATE_KEYS} data-testid={config.routes.OPERATOR.GENERATE_KEYS}>
            <Paper className={classes.guideStepsContainerPaper}>
              <Grid container wrap="nowrap" spacing={1}>
                <Grid item md={8} xs={8}>
                  <Typography noWrap variant="h6" className={classes.guideStepText}>Register operator</Typography>
                  <Typography noWrap variant="caption">List yourself as one of the network operators</Typography>
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

export default observer(RegisterValidatorHome);
