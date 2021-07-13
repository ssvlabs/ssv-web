import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useStores } from '~app/hooks/useStores';
import Spinner from '~app/common/components/Spinner';
import WalletPopUp from '~app/components/WalletPopUp';
import ApplicationStore from '~app/common/stores/Application.store';
import { useStyles } from '~app/common/components/Layout/Layout.styles';

const Layout = ({ children }: any) => {
    const classes = useStyles();
    const stores = useStores();
    const applicationStore: ApplicationStore = stores.Application;

    const renderSpinner = () => {
        if (applicationStore.isLoading) {
            return <Spinner />;
        }
        return null;
    };

    return (
      <Grid container className={classes.root} spacing={0} justify="center">
        <Grid item>
          { children }
        </Grid>
        {renderSpinner()}
        <WalletPopUp />
      </Grid>
    );
};

export default observer(Layout);
