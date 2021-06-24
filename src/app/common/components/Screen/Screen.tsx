import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useStyles } from '~app/common/components/Screen/Screen.styles';
import Header from '~app/common/components/Header';
import BackNavigation from '~app/common/components/BackNavigation';

type Params = {
    title: string,
    subTitle: string,
    navigationText?: string
    navigationLink?: string
    body?: any;
    actionButton?: any;
};

const Screen = ({ title, subTitle, navigationLink, navigationText, body, actionButton }: Params) => {
    const classes = useStyles();

    return (
      <Grid container className={classes.root} spacing={2} justify="center">
        <Grid zeroMinWidth item xs={12} md={12}>
          {navigationText && <BackNavigation to={navigationLink} text={navigationText} />}
        </Grid>
        <Grid item xs={12} md={12}>
          <Header title={title} subtitle={subTitle} />
        </Grid>
        <Grid item xs={12} md={12}>
          { body }
        </Grid>
        <Grid item xs={12} md={12}>
          { actionButton }
        </Grid>
      </Grid>
    );
};

export default observer(Screen);
