import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ClearIcon from '@mui/icons-material/Clear';
import Typography from '@mui/material/Typography';
// import { useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
// import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from '~app/components/applications/SSV/ConnectivityPopUp/ConnectivityPopUp.styles';

const ConnectivityPopUp = () => {
    const stores = useStores();
    const classes = useStyles();
    // const navigate = useNavigate();
    const applicationStore: ApplicationStore = stores.Application;
    // const walletStore: WalletStore = stores.Wallet;
    const registerButtonStyle = { width: '100%', marginTop: 30, height: '50px', backgroundColor: 'black', color: 'white' };

    const closePopUp = () => {
        applicationStore.setWalletConnectivity(false);
    };

    const connectToWallet = () => {
        applicationStore.setWalletConnectivity(false);
    };

    return (
      <Dialog aria-labelledby="alert-dialog-slide-title" open={applicationStore.walletConnectivity}>
        <Grid className={classes.gridContainer} wrap={'wrap'} container alignItems={'center'} item zeroMinWidth spacing={0}>
          <Grid item xs={12}>
            <ClearIcon onClick={closePopUp} className={classes.exitIcon} />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.title} variant="h5">Unlock Wallet</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">We couldn&#39;t detect your wallet.</Typography>
            <Typography variant="subtitle2">Please connect to a wallet to proceed.</Typography>
            <Button
              variant="contained"
              onClick={connectToWallet}
              style={registerButtonStyle}
              data-testid="connect-to-wallet-button"
            >
              Connect Wallet
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    );
};

export default observer(ConnectivityPopUp);
