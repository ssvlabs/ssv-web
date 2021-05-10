import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useStores } from '~app/hooks/useStores';
import SsvStore from '~app/common/stores/Ssv.store';
import Spinner from '~app/common/components/Spinner';
import BarMessage from '~app/common/components/BarMessage';
import { useStyles } from '~app/common/components/Layout/Layout.styles';

const Layout = ({ children }: any) => {
    const classes = useStyles();
    const stores = useStores();
    const ssv: SsvStore = stores.ssv;

    const renderSpinner = () => {
        if (ssv.isLoading) {
            return <Spinner />;
        }
        return null;
    };

    return (
      <Grid container className={classes.root} spacing={0} justify="center">
        <Grid item xs={12} md={4}>
          { children }
        </Grid>
        <BarMessage />
        {renderSpinner()}
      </Grid>
    );
};

export default observer(Layout);
