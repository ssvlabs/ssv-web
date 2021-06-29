import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Header from '~app/common/components/Header';
import BackNavigation from '~app/common/components/BackNavigation';
import { useStyles } from '~app/common/components/Screen/Screen.styles';

type ScreenParams = {
    title: string,
    subTitle: string,
    navigationText?: string
    navigationOnClick?: any
    navigationLink?: string
    body?: any;
    actionButton?: any;
    align?: boolean;
};

const Screen = ({ title, subTitle, navigationLink, navigationOnClick, navigationText, body, actionButton, align = false }: ScreenParams) => {
    const classes = useStyles();

    return (
      <Grid container spacing={0} justify="center">
        <Grid className={classes.navigation} item xs={12} md={12}>
          {navigationLink && <BackNavigation to={navigationLink} text={navigationText} onClick={navigationOnClick} />}
        </Grid>
        <Grid item xs={12} md={12} className={`${classes.header} ${align && classes.align}`}>
          <Header title={title} subtitle={subTitle} />
        </Grid>
        <Grid item xs={12} md={12}>
          { body }
        </Grid>
        {actionButton && (
          <Grid item xs={12} md={12} className={classes.bottom}>
            {actionButton}
          </Grid>
        )}
      </Grid>
    );
};

export default observer(Screen);
