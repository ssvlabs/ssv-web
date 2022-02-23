import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { States } from '~app/common/stores/enums/State';
import ApplicationStore from '~app/common/stores/Application.store';
import DarkModeSwitcher from '~app/common/components/AppBar/components/DarkModeSwitcher';
import ConnectWalletButton from '~app/common/components/AppBar/components/ConnectWalletButton';
import { useStyles } from './AppBar.styles';

const AppBar = () => {
    const stores = useStores();
    const history = useHistory();
    const wrapperRef = useRef(null);
    const buttonsRef = useRef(null);
    const [width, setWidth] = useState(window.innerWidth);
    const [menuBar, openMenuBar] = useState(false);
    const applicationStore: ApplicationStore = stores.Application;
    const [showMobileBar, setMobileBar] = useState(false);

    const isDistribution = applicationStore.isStrategyState(States.distribution);

    const classes = useStyles({ isDistribution });

    // Add event listener on screen size change
    useEffect(() => {
        window.addEventListener('resize', () => setWidth(window.innerWidth));
    }, []);

    useEffect(() => {
        if (width < 1200 && !showMobileBar) {
            setMobileBar(true);
        } else if (width >= 1200 && showMobileBar) {
            openMenuBar(false);
            setMobileBar(false);
        }
    }, [width]);

    useEffect(() => {
        /**
         * Close menu drop down when click outside
         */
        const handleClickOutside = (e: any) => {
            // @ts-ignore
            if (menuBar && wrapperRef.current && (!wrapperRef.current.contains(e.target) && !buttonsRef.current.contains(e.target))) {
                openMenuBar(false);
            }
        };
        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef, buttonsRef, menuBar]);

    function openExplorer() {
        window.open(config.links.LINK_EXPLORER);
    }

    function openDocs() {
        window.open(config.links.LINK_SSV_DEV_DOCS);
    }

    const moveToDashboard = () => {
        if (process.env.REACT_APP_NEW_STAGE) {
            history.push('/dashboard');
        }
    };

    return (
      <Grid container className={classes.AppBarWrapper}>
        <Grid item className={`${classes.AppBarIcon} ${width < 500 ? classes.SmallLogo : ''}`} onClick={() => { !isDistribution && history.push('/'); }} />
        {!isDistribution && !showMobileBar && (
          <Grid item container className={classes.Linkbuttons}>
            <Grid item className={classes.LinkButton}>Join</Grid>
            <Grid item className={classes.LinkButton} onClick={moveToDashboard}>
              My Account
            </Grid>
            <Grid item className={classes.LinkButton} onClick={openExplorer}>Explorer</Grid>
            <Grid item className={classes.LinkButton} onClick={openDocs}>Docs</Grid>
          </Grid>
          )}
        <Grid item className={classes.Wrapper}>
          <ConnectWalletButton />
        </Grid>
        {!showMobileBar && (
          <Grid item>
            <DarkModeSwitcher margin />
          </Grid>
        )}
        {!isDistribution && showMobileBar && (
          <Grid item ref={wrapperRef}>
            <Grid className={classes.Hamburger} onClick={() => { openMenuBar(!menuBar); }} />
          </Grid>
          )}
        {!isDistribution && menuBar && (
          <Grid item container className={classes.MobileMenuBar} ref={buttonsRef}>
            <Grid item className={`${classes.MenuButton}`}>Join</Grid>
            <Grid item className={classes.MenuButton} onClick={moveToDashboard}>My Account</Grid>
            <Grid item className={classes.MenuButton} onClick={openExplorer}>Explorer</Grid>
            <Grid item className={classes.MenuButton} onClick={openDocs}>Docs</Grid>
            <Grid item className={classes.UnderLine} />
            <Grid item container className={`${classes.MenuButton} ${classes.Slider}`}>
              <Grid item xs>{applicationStore.darkMode ? 'Dark Mode' : 'Light Mode'}</Grid>
              <Grid item>
                <DarkModeSwitcher margin={false} />
              </Grid>
            </Grid>
          </Grid>
          )}
      </Grid>
    );
};

export default observer(AppBar);
