import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useStyles } from '~app/common/components/Layout/Layout.styles';
import BarMessage from '~app/components/BarMessage';

const Layout = ({ children }: any) => {
    const classes = useStyles();

    return (
      <Grid container className={classes.root} spacing={0} justify="center">
        <Grid item xs={12} md={4}>
          { children }
        </Grid>
        <BarMessage />
      </Grid>
    );
};

export default observer(Layout);
