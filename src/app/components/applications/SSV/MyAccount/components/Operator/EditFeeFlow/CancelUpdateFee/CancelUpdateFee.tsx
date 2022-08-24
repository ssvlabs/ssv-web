import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import EventStore from '~app/common/stores/applications/SsvWeb/Event.store';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from './CancelUpdateFee.styles';

type Props = {
    // eslint-disable-next-line no-unused-vars
    getCurrentState: (forceState?: number) => void,
};

const CancelUpdateFee = (props: Props) => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const ssvStore: SsvStore = stores.SSV;
    const eventStore: EventStore = stores.Event;
    const walletStore: WalletStore = stores.Wallet;
    const operatorStore: OperatorStore = stores.Operator;
    const applicationStore: ApplicationStore = stores.Application;
    const [futureFee, setFutureFee] = useState(0);
    const [successPage, showSuccessPage] = useState(false);

    const cancelUpdateProcess = async () => {
        if (!operatorStore.processOperatorId) return history.push(applicationStore.strategyRedirect);
        applicationStore.setIsLoading(true);
        const response = await operatorStore.cancelChangeFeeProcess(operatorStore.processOperatorId);
        if (response) {
            // @ts-ignore
            setFutureFee(operatorStore.operatorFutureFee);
            eventStore.send({ category: 'cancel', action: 'click', label: '' });
            showSuccessPage(true);
        }
        applicationStore.setIsLoading(false);
    };

    const backToMyAccount = () => {
        history.push(config.routes.SSV.MY_ACCOUNT.OPERATOR.ROOT);
        operatorStore.switchCancelDialog();
    };

    const declareNewFee = async () => {
        await props.getCurrentState(0);
        operatorStore.switchCancelDialog();
    };

    // @ts-ignore
    const currentOperatorFee = formatNumberToUi(ssvStore.newGetFeeForYear(walletStore.fromWei(operatorStore.operatorCurrentFee)));
    // @ts-ignore
    const operatorFutureFee = formatNumberToUi(ssvStore.newGetFeeForYear(walletStore.fromWei(futureFee)));

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
      <Dialog className={classes.DialogWrapper} PaperProps={{ style: { overflow: 'unset', borderRadius: 16 } }} open={operatorStore.openCancelDialog}>
        <Grid className={classes.CloseDialog} onClick={operatorStore.switchCancelDialog} />
        <Grid className={classes.GridWrapper} container>
          <HeaderSubHeader title={'Cancel Update Fee'} />
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
          <PrimaryButton withoutLoader wrapperClass={classes.SecondButton} disable={false} text={'Declare a New Fee'} submitFunction={declareNewFee} />
        </Grid>
      </Dialog>
    );
};

export default observer(CancelUpdateFee);