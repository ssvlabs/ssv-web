import  { useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import AppLinksToggle from '~app/components/common/AppLinksToggle';
import { useStyles } from '~app/components/common/AppBar/AppBar.styles';
import NetworkToggle from '~app/components/common/AppBar/components/NetworkSwitchToggle/NetworkToggle';
import DarkModeSwitcher from '~app/components/common/AppBar/components/DarkModeSwitcher/DarkModeSwitcher';
import ConnectWalletButton from '~app/components/common/AppBar/components/ConnectWalletButton/ConnectWalletButton';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsDarkMode, getRestrictedUserGeo, getIsLoading } from '~app/redux/appState.slice';
import { getStrategyRedirect } from '~app/redux/navigation.slice';

type Button = {
  label: string;
  onClick: () => void;
  blueColor?: boolean;
  options?: any[],
};

const AppBar = ({ buttons, excludeNetworks = [] }: { buttons?: Button[], excludeNetworks?: number[] }) => {
    const navigate = useNavigate();
    const wrapperRef = useRef(null);
    const buttonsRef = useRef(null);
    const [menuBar, openMenuBar] = useState(false);
    // const isDistribution = applicationStore.strategyName === 'distribution';
    // @ts-ignore
    const classes = useStyles();
    const isDarkMode = useAppSelector(getIsDarkMode);
    const restrictedUserGeo = useAppSelector(getRestrictedUserGeo);
    const isLoading = useAppSelector(getIsLoading);
    const strategyRedirect = useAppSelector(getStrategyRedirect);
    const hasOperatorsOrValidators = strategyRedirect === config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD;

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
        if (restrictedUserGeo || isLoading) return;
        // @ts-ignore
        navigate(strategyRedirect);
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
              <Grid item xs>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</Grid>
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
        <Grid item container xs className={classes.GridItem} style={{ gap: 40, marginLeft: 40 }}>
          {buttons?.map((button, index) => {
              if (button?.options && button?.options?.length > 0) {
                  return <AppLinksToggle key={index} options={button?.options?.map((option: any) => ({ label: option.label, link: option.link, bottomLine: option.bottomLine || false }))} />;
              } else {
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
              }
          })}
        </Grid>
        <Grid item className={classes.GridItem}>
          <Grid item container style={{ alignItems: 'center' }}>
              <Grid item>
                  <NetworkToggle excludeNetworks={excludeNetworks} />
              </Grid>
            {!restrictedUserGeo && (
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

export default AppBar;
