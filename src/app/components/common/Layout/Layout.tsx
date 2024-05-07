
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import WalletPopUp from '~app/components/applications/SSV/WalletPopUp';
import { useStyles } from '~app/components/common/Layout/Layout.styles';
import { TransactionPendingPopUp } from '~app/components/applications/SSV/TransactionPendingPopUp';

const Layout = ({ children }: any) => {
    const classes = useStyles();

    return (
      <Grid container className={classes.Root} spacing={0} justifyContent="center">
        <Grid item xs={12}>
          { children }
        </Grid>
        <WalletPopUp />
        <TransactionPendingPopUp />
      </Grid>
    );
};

export default observer(Layout);
