import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '~app/atomicComponents/PrimaryButton';
import config from '~app/common/config';
import { ProcessStore } from '~app/common/stores/applications/SsvWeb';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import {
  useStyles,
} from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/CancelUpdateFee/CancelUpdateFee.styles';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppSelector } from '~app/hooks/redux.hook';
import { useStores } from '~app/hooks/useStores';
import { IOperator } from '~app/model/operator.model';
import { SingleOperator } from '~app/model/processes.model';
import { getStrategyRedirect } from '~app/redux/navigation.slice';
import { getIsContractWallet } from '~app/redux/wallet.slice';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { formatNumberToUi } from '~lib/utils/numbers';
import { fromWei, getFeeForYear } from '~root/services/conversions.service';

const CancelUpdateFee = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const operatorStore: OperatorStore = stores.Operator;
  const processStore: ProcessStore = stores.Process;
  const process: SingleOperator = processStore.getProcess;
  const operator: IOperator = process.item;
  const [futureFee, setFutureFee] = useState(0);
  const [successPage, showSuccessPage] = useState(false);
  const strategyRedirect = useAppSelector(getStrategyRedirect);
  const isContractWallet = useAppSelector(getIsContractWallet);

  const cancelUpdateProcess = async () => {
    if (!operatorStore.processOperatorId) return navigate(strategyRedirect);
    const response = await operatorStore.cancelChangeFeeProcess({ operator, isContractWallet });
    if (response) {
      // @ts-ignore
      setFutureFee(operatorStore.operatorFutureFee);
      GoogleTagManager.getInstance().sendEvent({
        category: 'cancel',
        action: 'click',
      });
      showSuccessPage(true);
    }
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
  const currentOperatorFee = formatNumberToUi(getFeeForYear(fromWei(operatorStore.operatorCurrentFee)));
  // @ts-ignore
  const operatorFutureFee = formatNumberToUi(getFeeForYear(fromWei(futureFee)));

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
            isDisabled={false}
            text={'Back to My Account'}
            onClick={backToMyAccount}
            size={ButtonSize.XL}
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
        <PrimaryButton isDisabled={false} text={'Cancel Update Fee'}
                       onClick={cancelUpdateProcess} size={ButtonSize.XL} />
        <PrimaryButton isDisabled={false} text={'Declare a New Fee'}
                       onClick={declareNewFee} size={ButtonSize.XL} />
      </Grid>
    </Dialog>
  );
};

export default observer(CancelUpdateFee);
