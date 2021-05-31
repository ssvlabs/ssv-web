import React from 'react';
import { observer } from 'mobx-react';
import Dialog from '@material-ui/core/Dialog';
import { useStores } from '~app/hooks/useStores';
import ClearIcon from '@material-ui/icons/Clear';
import LaunchIcon from '@material-ui/icons/Launch';
import FileCopyIcon from '@material-ui/icons/FileCopy';
// import { useStores } from '~app/hooks/useStores';
// import useUserFlow from '~app/hooks/useUserFlow';
// import { translations } from '~app/common/config';
// import Header from '~app/common/components/Header';
import { useStyles } from '~app/components/WalletPopUp/WalletPopUp.styles';

// import ContractOperator from '~app/common/stores/contract/ContractOperator.store';
// import ContractValidator from '~app/common/stores/contract/ContractValidator.store';
import ApplicationStore from '~app/common/stores/Application.store';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';

const WalletPopUp = () => {
    const stores = useStores();
    const classes = useStyles();
    const applicationStore: ApplicationStore = stores.Application;
    const walletStore: WalletStore = stores.Wallet;

    const changeWallet = () => {
        applicationStore.setShowPopUp(false);
        walletStore.onboardSdk.walletSelect();
    };

    const closePopUp = () => {
        applicationStore.setShowPopUp(false);
    };

    const openWalletAddress = () => {
        window.open(`https://goerli.etherscan.io/address/${walletStore.accountAddress}`);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(walletStore.accountAddress);
    };

    return (
      <Dialog aria-labelledby="simple-dialog-title" open={applicationStore.showWalletPopUp}>
        <Grid wrap={'wrap'} container alignItems={'center'} item zeroMinWidth spacing={0}>
          <Grid item xs={12}>
            <ClearIcon onClick={closePopUp} className={classes.exitIcon} />
          </Grid>
        </Grid>
        <Grid className={classes.gridWrapper}>
          <Grid wrap={'wrap'} container alignItems={'center'} item zeroMinWidth spacing={0} className={classes.gridContainer}>
            <Grid>
              <Typography variant={'h6'}>Wallet Address</Typography>
            </Grid>
            <Grid item>
              <button className={classes.connectButton} onClick={changeWallet}>Change</button>
            </Grid>
          </Grid>
          <Grid container alignItems={'center'} spacing={2} className={classes.gridContainerAddress}>
            <Grid item xs>
              <Typography noWrap variant={'body2'}>{walletStore.accountAddress}</Typography>
            </Grid>
            <Grid item>
              <FileCopyIcon className={classes.cursor} onClick={copyToClipboard} />
            </Grid>
            <Grid item>
              <LaunchIcon className={classes.cursor} onClick={openWalletAddress} />
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid container className={classes.gridContainerAddress} spacing={0} justify="center"> */}
        {/*  <Grid item xs={8}> */}
        {/*    <div>{'0xhadh72ha27dh27a7d2auekh2u1heh1i27ayukq2'}</div> */}
        {/*  </Grid> */}
        {/*  <Grid item xs={2}> */}
        {/*    <div>image</div> */}
        {/*  </Grid> */}
        {/*  <Grid item xs={2}> */}
        {/*    <div>image</div> */}
        {/*  </Grid> */}
        {/* </Grid> */}
      </Dialog>
    );
};

export default observer(WalletPopUp);
