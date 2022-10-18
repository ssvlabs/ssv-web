import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import ConnectWalletButton from '~app/components/common/AppBar/components/ConnectWalletButton/ConnectWalletButton';
import DarkModeSwitcher from '~app/components/common/AppBar/components/DarkModeSwitcher/DarkModeSwitcher';
import { useStyles } from './AppBar.styles';

type Button = {
  label: string;
  onClick: () => void;
  blueColor?: boolean;
};

const AppBar = ({ buttons, backgroundColor }: { buttons?: Button[], backgroundColor?: string }) => {
    const stores = useStores();
    const history = useHistory();
    const wrapperRef = useRef(null);
    const buttonsRef = useRef(null);
    const [menuBar, openMenuBar] = useState(false);
    const applicationStore: ApplicationStore = stores.Application;
    // const isDistribution = applicationStore.strategyName === 'distribution';
    const hasOperatorsOrValidators = applicationStore.strategyRedirect === config.routes.SSV.MY_ACCOUNT.DASHBOARD;
    // @ts-ignore
    const classes = useStyles({ backgroundColor });

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

    const logoAction = () => {
        if (applicationStore.userGeo) return;
        if (applicationStore.isLoading) return;
        // @ts-ignore
        applicationStore.whiteNavBarBackground = false;
        history.push(applicationStore.strategyRedirect);
    };

    const Buttons = () => {
        return (
          <Grid item container className={classes.MobileMenuBar} ref={buttonsRef}>
            {buttons?.map((button, index) => {
                  return (
                    <Grid
                      item
                      key={index}
                      onClick={() => { openMenuBar(false); button.onClick(); }}
                      className={`${classes.MenuButton} ${button.blueColor && hasOperatorsOrValidators ? classes.BlueLink : ''}`}
                      >
                      {button.label}
                    </Grid>
                  );
              })}
            <Grid item className={classes.UnderLine} />
            <Grid item container className={`${classes.MenuButton} ${classes.Slider}`}>
              <Grid item xs>{applicationStore.darkMode ? 'Dark Mode' : 'Light Mode'}</Grid>
              <Grid item>
                <DarkModeSwitcher margin={false} />
              </Grid>
            </Grid>
          </Grid>
        );
    };

    const Hamburger = () => {
        return (
          <Grid item ref={wrapperRef}>
            <Grid className={classes.Hamburger}
              onClick={() => { openMenuBar(!menuBar); }}
            />
          </Grid>
        );
    };

    return (
      <Grid container className={classes.AppBarWrapper}>
        <Grid item className={classes.GridItem}>
          <Grid
            item
            onClick={logoAction}
            className={classes.AppBarIcon}
          />
        </Grid>
        <Grid item container xs className={classes.GridItem}>
          <Grid item container justify={'center'}>
            {buttons?.map((button, index) => {
                    return (
                      <Grid
                        item
                        key={index}
                        onClick={button.onClick}
                        className={`${classes.Button} ${button.blueColor && hasOperatorsOrValidators ? classes.BlueLink : ''}`}
                      >
                        {button.label}
                      </Grid>
                    );
                })}
          </Grid>
        </Grid>

        <Grid item className={classes.GridItem}>
          <Grid item container style={{ alignItems: 'center' }}>
            {!applicationStore.userGeo && (
              <Grid item>
                <ConnectWalletButton />
              </Grid>
              )}
            <Grid item className={classes.DarkModeWrapper}>
              <DarkModeSwitcher margin />
            </Grid>
            <Hamburger />
          </Grid>
        </Grid>
        {menuBar && <Buttons />}
      </Grid>
    );
};

export default observer(AppBar);
