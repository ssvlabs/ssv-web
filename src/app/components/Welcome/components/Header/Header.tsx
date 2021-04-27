import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useStyles } from '~app/components/Welcome/components/Header/Header.styles';

const Header = () => {
  const classes = useStyles();
  return (
    <div className={classes.header}>
      <Typography variant="h5">Join the SSV Network Operators</Typography>
      <Typography variant="subtitle1">
        To join the network of operators you must run an SSV node.<br />
        Setup your node, generate operator keys and register to the network.
      </Typography>
    </div>
  );
};

export default Header;
