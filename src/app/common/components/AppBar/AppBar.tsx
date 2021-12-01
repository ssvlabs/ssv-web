import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
// import AppBar from '@material-ui/core/AppBar';
// import MenuIcon from '@material-ui/icons/Menu';
// import Toolbar from '@material-ui/core/Toolbar';
// import CloseIcon from '@material-ui/icons/Close';
// import Typography from '@material-ui/core/Typography';
// import config from '~app/common/config';
// import { useStyles } from './AppBar.styles';
// import useUserFlow from '~app/hooks/useUserFlow';
// import { useStores } from '~app/hooks/useStores';
// import OperatorStore from '~app/common/stores/Operator.store';
// import ApplicationStore from '~app/common/stores/Application.store';
// import config from '~app/common/config';
import DarkModeSwitcher from '~app/common/components/AppBar/components/DarkModeSwitcher';
import ConnectWalletButton from '~app/common/components/AppBar/components/ConnectWalletButton';
import { useStyles } from './AppBar.styles';
// import config from "~app/common/config";
import { Link as RouterLink } from 'react-router-dom';
import UnStyledLink from '~app/common/components/UnStyledLink';

const AppBar = () => {
    const classes = useStyles();
    const RouteLink = UnStyledLink(RouterLink);

    function openExplorer() {
        window.open('https://play.google.com/store/apps/details?id=com.drishya');
    }

    return (
      <Grid container className={classes.AppBarWrapper}>
        <Grid item className={classes.AppBarIcon} />
        <Grid item container className={classes.Linkbuttons}>
          {/* <ConditionalLink to={config.routes.VALIDATOR.CREATE} condition={false} onClick={redirectToLaunchpad}></ConditionalLink> */}
          <RouteLink to={'/dashboard'} className={classes.LinkButton}>
            <Grid item>My Account</Grid>
          </RouteLink>
          <RouteLink onClick={openExplorer} className={classes.LinkButton}>
            <Grid item>Explorer</Grid>
          </RouteLink>
          <RouteLink onClick={openExplorer} className={classes.LinkButton}>
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
