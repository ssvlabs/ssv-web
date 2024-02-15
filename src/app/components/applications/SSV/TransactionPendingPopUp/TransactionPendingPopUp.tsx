import React from 'react';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import { getImage } from '~lib/utils/filePath';
import LinkText from '~app/components/common/LinkText';
import { ENV } from '~lib/utils/envHelper';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import AddressKeyInput from '~app/components/common/AddressKeyInput/AddressKeyInput';
import { useStyles } from '~app/components/applications/SSV/TransactionPendingPopUp/TransactionPendingPopUp.styles';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsShowTxPendingPopup, getTxHash } from '~app/redux/appState.slice';

const TransactionPendingPopUp = () => {
    const classes = useStyles();
    const isShowTxPendingPopup = useAppSelector(getIsShowTxPendingPopup);
    const txHash = useAppSelector(getTxHash);

    return (
      <Dialog className={classes.DialogWrapper} aria-labelledby="simple-dialog-title" open={isShowTxPendingPopup}>
        <Grid className={classes.gridWrapper} container>
          <HeaderSubHeader title={'Sending Transaction'} subtitle={'Your transaction is pending on the blockchain - please wait while it\'s being confirmed'} />
          <Grid item>
            <img className={classes.Loader} src={getImage('ssv-loader.svg')} />
          </Grid>
          <Grid item container style={{ marginBottom: 20 }}>
            <Grid item xs>
              <div className={classes.validatorText}>Transaction Hash</div>
            </Grid>
            <AddressKeyInput whiteBackgroundColor withCopy address={txHash} />
          </Grid>
          <LinkText text={'View on Etherscan'} link={`${ENV().ETHERSCAN_URL}/tx/${txHash}`} />
        </Grid>
      </Dialog>
    );
};

export default TransactionPendingPopUp;
