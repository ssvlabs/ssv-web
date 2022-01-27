import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import { useStores } from '~app/hooks/useStores';
import ApplicationStore from '~app/common/stores/Application.store';
import AddressKeyInput from '~app/common/components/AddressKeyInput/AddressKeyInput';
import { useStyles } from '~app/components/TransactionPendingPopUp/TransactionPendingPopUp.styles';
import HeaderSubHeader from '~app/common/components/HeaderSubHeader';
import { getImage } from '~lib/utils/filePath';

type TransactionPendingPopUpParams = {
    txHash: string
};

const TransactionPendingPopUp = ({ txHash }: TransactionPendingPopUpParams) => {
    const stores = useStores();
    const classes = useStyles();
    const applicationStore: ApplicationStore = stores.Application;

    return (
      <Dialog className={classes.DialogWrapper} aria-labelledby="simple-dialog-title" open={applicationStore.transactionPendingPopUp}>
        <Grid className={classes.gridWrapper} container>
          <HeaderSubHeader title={'Sending Transaction'} subtitle={'Your transaction is pending on the blockchain - please wait while it\'s being confirmed'} />
          <Grid item>
            <img className={classes.Loader} src={getImage('ssv-loader.svg')} />
          </Grid>
          <Grid item container>
            <Grid item xs>
              <div className={classes.validatorText}>Transaction Hash</div>
            </Grid>
            <AddressKeyInput whiteBackgroundColor withCopy address={txHash} />
          </Grid>
          <Grid className={classes.linkHref} item>
            <a href={`https://goerli.etherscan.io/tx/${txHash}`} target={'_blank'}>View on Etherscan</a>
          </Grid>
        </Grid>
      </Dialog>
    );
};

export default observer(TransactionPendingPopUp);
