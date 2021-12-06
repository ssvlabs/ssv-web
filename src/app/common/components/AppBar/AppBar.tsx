import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import UnStyledLink from '~app/common/components/UnStyledLink';
import DarkModeSwitcher from '~app/common/components/AppBar/components/DarkModeSwitcher';
import ConnectWalletButton from '~app/common/components/AppBar/components/ConnectWalletButton';
import { useStyles } from './AppBar.styles';

const AppBar = () => {
    const classes = useStyles();
    const history = useHistory();
    const RouteLink = UnStyledLink(RouterLink);

    function openExplorer() {
        window.open('https://play.google.com/store/apps/details?id=com.drishya');
    }

    return (
      <Grid container className={classes.AppBarWrapper}>
        <Grid item className={classes.AppBarIcon} onClick={() => { history.push('/'); }} />
        <Grid item container className={classes.Linkbuttons}>
          <RouteLink to={'/dashboard'} className={classes.LinkButton}>
            <Grid item>My Account</Grid>
          </RouteLink>
          <RouteLink to={'/dashboard'} onClick={openExplorer} className={classes.LinkButton}>
            <Grid item>Explorer</Grid>
          </RouteLink>
          <RouteLink to={'/dashboard'} onClick={openExplorer} className={classes.LinkButton}>
            <Grid item>Docs</Grid>
          </RouteLink>
        </Grid>
        <Grid item>
          <ConnectWalletButton />
        </Grid>
        <Grid item>
          <DarkModeSwitcher />
        </Grid>
      </Grid>
    );
};

export default observer(AppBar);
