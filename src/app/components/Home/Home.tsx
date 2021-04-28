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
import { useStyles } from '~app/components/Home/Home.styles';

const RouteLink = UnStyledLink(RouterLink);

const Home = () => {
  const classes = useStyles();
  const title = 'Join SSV Network';
  const subtitle = 'Create new operator and share validator keys with other operators';

  return (
    <Paper className={classes.mainContainer}>
      <Header title={title} subtitle={subtitle} />

      <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
        <Grid item xs zeroMinWidth className={classes.gridContainer}>
          <RouteLink to={config.routes.OPERATOR.START}>
            <Paper className={classes.guideStepsContainerPaper}>
              <Grid container wrap="nowrap" spacing={1}>
                <Grid item md={8} xs={8}>
                  <Typography noWrap variant="h6" className={classes.guideStepText}>Create new Operator</Typography>
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
          <RouteLink to={config.routes.VALIDATOR.HOME}>
            <Paper className={classes.guideStepsContainerPaper}>
              <Grid container wrap="nowrap" spacing={1}>
                <Grid item md={8} xs={8}>
                  <Typography noWrap variant="h6" className={classes.guideStepText}>Share Validator Key</Typography>
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

export default observer(Home);
