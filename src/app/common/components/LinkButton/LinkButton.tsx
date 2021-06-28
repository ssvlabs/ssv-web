import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useStyles } from '~app/common/components/LinkButton/LinkButton.styles';

const LinkButton = ({ text1, text2 }: any) => {
    const classes = useStyles();

    return (
      <Paper className={classes.guideStepsContainerPaper}>
        <Grid container wrap="nowrap" spacing={1}>
          <Grid item md={8} xs={8}>
            <Typography variant="h6" className={classes.guideStepText}>{text1}</Typography>
            <Typography variant="caption" className={classes.guideStepSubText}>{text2}</Typography>
          </Grid>
          <Grid item md={4} xs={4}>
            <ArrowForwardIosIcon className={classes.arrowIcon} />
          </Grid>
        </Grid>
      </Paper>
    );
};

export default observer(LinkButton);
