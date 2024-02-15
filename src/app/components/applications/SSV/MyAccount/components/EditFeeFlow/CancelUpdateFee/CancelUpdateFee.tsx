import React, { useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/CancelUpdateFee/CancelUpdateFee.styles';
import { fromWei } from '~root/services/conversions.service';

const CancelUpdateFee = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const ssvStore: SsvStore = stores.SSV;
  const operatorStore: OperatorStore = stores.Operator;
  const applicationStore: ApplicationStore = stores.Application;
  const [futureFee, setFutureFee] = useState(0);
  const [successPage, showSuccessPage] = useState(false);

  const cancelUpdateProcess = async () => {
    if (!operatorStore.processOperatorId) return navigate(applicationStore.strategyRedirect);
    applicationStore.setIsLoading(true);
    const response = await operatorStore.cancelChangeFeeProcess(operatorStore.processOperatorId);
    if (response) {
      // @ts-ignore
      setFutureFee(operatorStore.operatorFutureFee);
      GoogleTagManager.getInstance().sendEvent({
        category: 'cancel',
        action: 'click',
      });
      showSuccessPage(true);
    }
    applicationStore.setIsLoading(false);
  };

  const backToMyAccount = () => {
    navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.ROOT);
    operatorStore.switchCancelDialog();
  };

  const declareNewFee = async () => {
    navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.UPDATE_FEE.START);
    operatorStore.switchCancelDialog();
  };

  // @ts-ignore
  const currentOperatorFee = formatNumberToUi(ssvStore.getFeeForYear(fromWei(operatorStore.operatorCurrentFee)));
  // @ts-ignore
  const operatorFutureFee = formatNumberToUi(ssvStore.getFeeForYear(fromWei(futureFee)));

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
            children={'Back to My Account'}
            submitFunction={backToMyAccount}
            wrapperClass={classes.BackToMyAccount}
          />
        </Grid>
      </Dialog>
    );
  }

  return (
    <Dialog className={classes.DialogWrapper} PaperProps={{ style: { overflow: 'unset', borderRadius: 16 } }}
      open={operatorStore.openCancelDialog}>
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
        <PrimaryButton wrapperClass={classes.FirstButton} disable={false} children={'Cancel Update Fee'}
          submitFunction={cancelUpdateProcess} />
        <PrimaryButton withoutLoader wrapperClass={classes.SecondButton} disable={false} children={'Declare a New Fee'}
          submitFunction={declareNewFee} />
      </Grid>
    </Dialog>
  );
};

export default observer(CancelUpdateFee);
