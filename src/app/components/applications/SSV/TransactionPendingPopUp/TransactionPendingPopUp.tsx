import React from 'react';
import { observer } from 'mobx-react';
import { Grid, Dialog } from '@mui/material';
import { getImage } from '~lib/utils/filePath';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import AddressKeyInput from '~app/components/common/AddressKeyInput/AddressKeyInput';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from '~app/components/applications/SSV/TransactionPendingPopUp/TransactionPendingPopUp.styles';

const TransactionPendingPopUp = () => {
    const stores = useStores();
    const classes = useStyles();
    const walletStore: WalletStore = stores.Wallet;
    const applicationStore: ApplicationStore = stores.Application;

    return (
      <Dialog className={classes.DialogWrapper} aria-labelledby="simple-dialog-title" open={applicationStore.transactionPendingPopUp}>
        <Grid className={classes.gridWrapper} container>
          <HeaderSubHeader title={'Sending Transaction'} subtitle={'Your transaction is pending on the blockchain - please wait while it\'s being confirmed'} />
          <Grid item>
            <img className={classes.Loader} src={getImage('ssv-loader.svg')} />
          </Grid>
          <Grid item container style={{ marginBottom: 20 }}>
            <Grid item xs>
              <div className={classes.validatorText}>Transaction Hash</div>
            </Grid>
            <AddressKeyInput whiteBackgroundColor withCopy address={applicationStore.txHash} />
          </Grid>
          <LinkText text={'View on Etherscan'} link={`https://${walletStore.networkId === 5 ? 'goerli.' : ''}etherscan.io/tx/${applicationStore.txHash}`} />
        </Grid>
      </Dialog>
    );
};

export default observer(TransactionPendingPopUp);
