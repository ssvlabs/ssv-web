import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import { useStyles } from './AppBar.styles';
import useUserFlow from '~app/hooks/useUserFlow';
import { useStores } from '~app/hooks/useStores';
import ApplicationStore from '~app/common/stores/Application.store';
import ContractOperator from '~app/common/stores/contract/ContractOperator.store';
import ConnectWalletButton from '~app/common/components/AppBar/components/ConnectWalletButton';

type Button = {
  text: string,
  link: string,
  newPage?: boolean
  active?: boolean
};

// Subscribe to messages coming from secured frame.
window.onmessage = (event: MessageEvent) => {
  const { message, data } = event.data;
  switch (message) {
    case 'window.location.href':
      window.location.href = data;
      break;
  }
};

const AppBarComponent = () => {
  const classes = useStyles();
  const stores = useStores();
  const operatorStore: ContractOperator = stores.ContractOperator;
  const { history } = useUserFlow();
  const applicationStore: ApplicationStore = stores.Application;

  const bannerMenuButtons: Button[] = [
    { text: 'join', link: config.routes.HOME },
    { text: 'my account', link: config.routes.MY_ACCOUNT.DASHBOARD },
    { text: 'explorer', link: config.links.LINK_EXPLORER, newPage: true },
    { text: 'docs', link: 'https://docs.ssv.network/', newPage: true },
  ];
  const dropDownMenuButtons: Button[] = [
    { text: 'Join the Network', link: config.routes.HOME },
    { text: 'Documentation', link: 'https://docs.ssv.network/', newPage: true },
    { text: 'explorer', link: config.links.LINK_EXPLORER, newPage: true },
  ];

  const renderMenu = () => {
    return (
      <div className={classes.fullScreen}>
        <Grid container justify="center">
          {dropDownMenuButtons.map((button: Button, index: number) => {
            return (
              <Grid key={index} item xs={12} className={classes.menuButtonWrapper}>
                <Typography
                  onClick={() => {
                      switchPage(button.link, button.newPage);
                  }}
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
              <Typography onClick={() => {
                switchPage(config.routes.HOME);
              }}
                variant={'subtitle1'}
                className={classes.mainButton}>
                ssv.network
              </Typography>
            </Grid>
            <Grid item zeroMinWidth md={3}>
              <Grid container justify={'space-around'}>
                {bannerMenuButtons.map((button: Button, index: number) => {
                    return (
                      <Grid item key={index}>
                        <Typography onClick={() => {
                             switchPage(button.link, button.newPage);
                          }}
                          variant={'subtitle1'}
                          className={classes.button}>
                          {button.text}
                        </Typography>
                      </Grid>
                    );
                  })}
              </Grid>
            </Grid>
            <Grid item xs={8} md={4}>
              <Grid container spacing={1} alignItems={'center'} justify={'flex-end'}>
                <Grid item>
                  <ConnectWalletButton />
                </Grid>
                <Grid item className={classes.menu} onClick={() => {
                    handleClick(!applicationStore.shouldDisplayToolBar);
                  }}>
                  {applicationStore.shouldDisplayToolBar ? <CloseIcon className={classes.menuIcon} /> :
                  <MenuIcon className={classes.menuIcon} />}
                </Grid>
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
