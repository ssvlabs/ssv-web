import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import { useHistory, useParams } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import PrimaryButton from '~app/components/common/PrimaryButton';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import { formatNumberToUi, multiplyNumber } from '~lib/utils/numbers';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
// import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStyles } from './CancelUpdateFee.styles';

type Props = {
    // eslint-disable-next-line no-unused-vars
    getCurrentState: (forceState?: number) => void,
};

const CancelUpdateFee = (props: Props) => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    // @ts-ignore
    const { operator_id } = useParams();
    const [successPage, showSuccessPage] = useState(false);
    const walletStore: WalletStore = stores.Wallet;
    const operatorStore: OperatorStore = stores.Operator;
    const applicationStore: ApplicationStore = stores.Application;
    // const notificationsStore: NotificationsStore = stores.Notifications;

    const cancelUpdateProcess = async () => {
        applicationStore.setIsLoading(true);
        const response = await operatorStore.cancelChangeFeeProcess(operator_id);
        if (response) {
            showSuccessPage(true);
        }
        applicationStore.setIsLoading(false);
    };

    const backToMyAccount = () => {
        history.push(`/dashboard/operator/${operator_id}`);
        operatorStore.switchCancelDialog();
    };

    const declareNewFee = async () => {
        await props.getCurrentState(0);
        operatorStore.switchCancelDialog();
    };

    // @ts-ignore
    const currentOperatorFee = formatNumberToUi(multiplyNumber(walletStore.fromWei(operatorStore.operatorCurrentFee), config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR));
    // @ts-ignore
    const operatorFutureFee = formatNumberToUi(multiplyNumber(walletStore.fromWei(operatorStore.operatorFutureFee), config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR));

    if (successPage) {
        return (
          <Dialog className={classes.DialogWrapper} open={operatorStore.openCancelDialog}>
            <Grid container item className={classes.GridWrapper} style={{ gap: 56 }}>
              <Grid item className={classes.BackgroundImage} />
              <HeaderSubHeader marginBottom={0} title={'Fee update process canceled successfully!'} />
              <Grid container item className={classes.CurrentFeeWrapper}>
                <Grid item xs={12}>
                  <Typography className={classes.CancelSubText}>Your current fee has remained.</Typography>
                </Grid>
                <Grid container item style={{ gap: 12 }}>
                  <Grid item>
                    <SsvAndSubTitle bold leftTextAlign ssv={currentOperatorFee} />
                  </Grid>
                  <Grid item>
                    <Grid item className={classes.NegativeArrow} />
                  </Grid>
                  <Grid item>
                    <SsvAndSubTitle fade bold leftTextAlign ssv={operatorFutureFee} />
                  </Grid>
                </Grid>
              </Grid>
              <PrimaryButton
                disable={false}
                text={'Back to My Account'}
                submitFunction={backToMyAccount}
                wrapperClass={classes.BackToMyAccount}
              />
            </Grid>
          </Dialog>
        );
    }

    return (
      <Dialog className={classes.DialogWrapper} open={operatorStore.openCancelDialog}>
        <Grid className={classes.CloseDialog} onClick={operatorStore.switchCancelDialog} />
        <Grid className={classes.GridWrapper} container>
          <HeaderSubHeader title={'Sending Transaction'} />
          <Grid className={classes.Text}>
            <b>Canceling</b> the fee update process will notify <br />
            your managed validators and your <b>current fee <br />
              will remain</b>
          </Grid>
          <Grid className={classes.Line} />
          <Grid className={classes.Text}>
            <b>Declaring a new fee</b> will reset the current <br />
            process and start the process anew.
          </Grid>
          <PrimaryButton wrapperClass={classes.FirstButton} disable={false} text={'Cancel Update Fee'} submitFunction={cancelUpdateProcess} />
          <PrimaryButton withLoader={false} wrapperClass={classes.SecondButton} disable={false} text={'Declare a New Fee'} submitFunction={declareNewFee} />
        </Grid>
      </Dialog>
    );
};

export default observer(CancelUpdateFee);