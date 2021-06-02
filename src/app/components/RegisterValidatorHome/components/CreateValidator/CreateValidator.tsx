import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Header from '~app/common/components/Header';
import config, { translations } from '~app/common/config';
import BackNavigation from '~app/common/components/BackNavigation';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ConditionalLink from '~app/common/components/ConditionalLink';
import { useStyles } from '~app/components/RegisterValidatorHome/components/CreateValidator/CreateValidator.styles';

const CreateValidator = () => {
  const classes = useStyles();

  const redirectToLaunchpad = async () => {
    window.open(config.links.LAUNCHPAD_LINK);
  };

  return (
    <Paper className={classes.mainContainer}>
      <BackNavigation to={config.routes.VALIDATOR.HOME} text={translations.VALIDATOR.CREATE.NAVIGATION_TEXT} />
      <Header title={translations.VALIDATOR.CREATE.TITLE} subtitle={''} />

      <Grid container wrap="nowrap" spacing={0} className={classes.gridContainer}>
        <Grid item xs zeroMinWidth className={classes.gridContainer}>

          {translations.VALIDATOR.CREATE.BODY_TEXT.map((text: string) => {
            return (
              <Typography className={classes.bodyText} key={text} variant="subtitle1" style={{ fontSize: 15 }}>
                {text}
              </Typography>
            );
          })}
        </Grid>
        <Grid item xs zeroMinWidth className={classes.gridContainer}>
          <ConditionalLink to={config.routes.VALIDATOR.CREATE} condition={false} onClick={redirectToLaunchpad}>
            <Paper className={classes.guideStepsContainerPaper}>
              <Grid container wrap="nowrap" spacing={1}>
                <Grid item md={8} xs={8}>
                  <Typography noWrap variant="h6" className={classes.guideStepText}>Visit Ethereum launchpad</Typography>
                </Grid>
                <Grid item md={4} xs={4}>
                  <ArrowForwardIosIcon className={classes.arrowIcon} />
                </Grid>
              </Grid>
            </Paper>
          </ConditionalLink>
        </Grid>
        <div className={classes.imageContainr}>
          <img className={classes.rhinoImage} src={'/images/rhino.png'} />
        </div>
      </Grid>
    </Paper>
  );
};

export default observer(CreateValidator);
