import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import WalletPopUp from '~app/components/WalletPopUp';
import { useStyles } from '~app/common/components/Layout/Layout.styles';

const Layout = ({ children }: any) => {
    const classes = useStyles();

    return (
      <Grid container className={classes.root} spacing={0} justify="center">
        <Grid item xs={12}>
          { children }
        </Grid>
        <WalletPopUp />
      </Grid>
    );
};

export default observer(Layout);
