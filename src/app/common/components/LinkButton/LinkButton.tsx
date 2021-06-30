import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useStyles } from '~app/common/components/LinkButton/LinkButton.styles';

const LinkButton = ({ primaryLabel, secondaryLabel, icon }: any) => {
    const classes = useStyles();

    return (
      <Paper className={classes.guideStepsContainerPaper}>
        <Grid container wrap="nowrap" spacing={1} justify={'space-between'}>
          {icon && (
          <Grid item>
            <img src={icon} className={classes.icon} />
          </Grid>
          )}
          <Grid item xs={9} className={`${secondaryLabel ? '' : classes.textWrapper}`}>
            <Typography variant="h6" noWrap className={classes.guideStepText}>{primaryLabel}</Typography>
            <Typography variant="caption" noWrap className={classes.guideStepSubText}>{secondaryLabel}</Typography>
          </Grid>
          <Grid item xs={1}>
            <ArrowForwardIosIcon className={classes.arrowIcon} />
          </Grid>
        </Grid>
      </Paper>
    );
};

export default observer(LinkButton);
