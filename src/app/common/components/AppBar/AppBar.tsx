import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import Tooltip from '@material-ui/core/Tooltip';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import { useStyles } from './AppBar.styles';
import useUserFlow from '~app/hooks/useUserFlow';
import { useStores } from '~app/hooks/useStores';
import { isUpgradePage } from '~lib/utils/navigation';
import ApplicationStore from '~app/common/stores/Application.store';
import ContractOperator from '~app/common/stores/contract/ContractOperator.store';
import ConnectWalletButton from '~app/common/components/AppBar/components/ConnectWalletButton';

type Button = {
    text: string,
    link: string,
    newPage?: boolean
    active?: boolean
};

const AppBarComponent = () => {
    const classes = useStyles();
    const stores = useStores();
    const operatorStore: ContractOperator = stores.ContractOperator;
    const { history } = useUserFlow();
    const applicationStore: ApplicationStore = stores.Application;

    const buttons: Button[] = [
        { text: 'join', link: config.routes.HOME, active: true },
        { text: 'my account', link: config.routes.HOME, active: false },
        { text: 'explorer', link: config.links.LINK_EXPLORER, newPage: true, active: true },
        { text: 'docs', link: 'https://docs.ssv.network/', newPage: true, active: true },
    ];
    const menuButtons: Button[] = [
        { text: 'Join the Network', link: config.routes.HOME, active: true },
        { text: 'Documentation', link: 'https://docs.ssv.network/', newPage: true, active: true },
        { text: 'explorer', link: config.links.LINK_EXPLORER, newPage: true, active: true },
    ];

    const renderMenu = () => {
        return (
          <div className={classes.fullScreen}>
            <Grid container justify="center">
              {menuButtons.map((button: Button, index: number) => {
                  return (
                    <Grid key={index} item xs={12} className={classes.menuButtonWrapper}>
                      <Typography
                        onClick={() => { if (button.active) { switchPage(button.link, button.newPage); } }}
                        className={classes.menuButton}>
                        {button.text}
                      </Typography>
                    </Grid>
                  );
              })}
            </Grid>
          </div>
        );
    };

    const switchPage = (link: string, newPage: boolean = false) => {
        if (newPage) {
            window.open(link, '_blank');
        } else {
            operatorStore.clearOperatorData();
            history.push(link);
        }
        applicationStore.displayToolBarMenu(false);
    };

    const handleClick = (status: boolean) => {
        applicationStore.displayToolBarMenu(status);
    };

    return (
      <div className={classes.root}>
        <AppBar className={classes.bloxColor} position="static">
          <Toolbar className={classes.toolbar}>
            <Grid container justify={'space-between'} alignItems={'center'}>
              <Grid item xs={4} md={4}>
                <Typography onClick={() => { switchPage(config.routes.HOME); }}
                  variant={'subtitle1'}
                  className={classes.mainButton}>
                  ssv.network
                </Typography>
              </Grid>
              <Grid item zeroMinWidth md={3}>
                {!isUpgradePage() ? (
                  <Grid container justify={'space-around'}>
                    {buttons.map((button: Button, index: number) => {
                      return (
                        <Grid item key={index}>
                          <Tooltip disableHoverListener={button.active} key={index} disableFocusListener disableTouchListener title="Comming soon...">
                            <Typography onClick={() => { if (button.active) switchPage(button.link, button.newPage); }}
                              variant={'subtitle1'}
                              className={classes.button}>
                              {button.text}
                            </Typography>
                          </Tooltip>
                        </Grid>
                        );
                    })}
                  </Grid>
                ) : ''}
              </Grid>
              <Grid item xs={8} md={4}>
                <Grid container spacing={1} alignItems={'center'} justify={'flex-end'}>
                  <Grid item>
                    <ConnectWalletButton />
                  </Grid>
                  {!isUpgradePage() ? (
                    <Grid item className={classes.menu} onClick={() => { handleClick(!applicationStore.shouldDisplayToolBar); }}>
                      {applicationStore.shouldDisplayToolBar ? <CloseIcon className={classes.menuIcon} /> : <MenuIcon className={classes.menuIcon} />}
                    </Grid>
                  ) : ''}
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        {applicationStore.shouldDisplayToolBar && renderMenu()}
      </div>
    );
};

export default observer(AppBarComponent);
