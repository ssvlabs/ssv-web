import React from 'react';
import { observer } from 'mobx-react';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Logo from '~app/common/components/AppBar/components/Logo';
import Button from '~app/common/components/AppBar/components/Button';
import { useStyles } from './AppBar.styles';

const AppBarComponent = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            <Logo />
          </Typography>
          <Button variant="outlined" color="primary">Connect Wallet</Button>
          <IconButton edge="end" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default observer(AppBarComponent);
