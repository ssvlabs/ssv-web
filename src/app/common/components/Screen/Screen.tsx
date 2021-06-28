import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useStyles } from '~app/common/components/Screen/Screen.styles';
import Header from '~app/common/components/Header';
import BackNavigation from '~app/common/components/BackNavigation';

type Params = {
    icon?: string,
    title: string,
    subTitle: string,
    navigationText?: string
    navigationOnClick?: any
    navigationLink?: string
    body?: any;
    actionButton?: any;
    align?: boolean;
};

const Screen = ({ icon, title, subTitle, navigationLink, navigationOnClick, navigationText, body, actionButton, align = false }: Params) => {
    const classes = useStyles();

    return (
      <Grid container className={classes.root} spacing={0} justify="center">
        {icon && (
          <Grid zeroMinWidth item xs={12} md={12}>
            <img className={classes.icon} src={icon} />
          </Grid>
        )}
        <Grid className={classes.navigation} item xs={12} md={12}>
          {navigationLink && <BackNavigation to={navigationLink} text={navigationText} onClick={navigationOnClick} />}
        </Grid>
        <Grid item xs={12} md={12} className={`${classes.header} ${align && classes.align}`}>
          <Header title={title} subtitle={subTitle} />
        </Grid>
        <Grid className={classes.body} item xs={12} md={12}>
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
