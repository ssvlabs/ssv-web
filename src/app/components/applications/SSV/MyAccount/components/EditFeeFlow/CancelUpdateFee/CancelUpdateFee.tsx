import Dialog from '@mui/material/Dialog';
import { Grid } from '~app/atomicComponents';
import Typography from '@mui/material/Typography';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '~app/atomicComponents';
import config from '~app/common/config';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/CancelUpdateFee/CancelUpdateFee.styles';
import { ButtonSize } from '~app/enums/Button.enum';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { useStores } from '~app/hooks/useStores';
import { IOperator } from '~app/model/operator.model';
import { SingleCluster } from '~app/model/processes.model';
import { getStrategyRedirect } from '~app/redux/navigation.slice';
import { getIsContractWallet } from '~app/redux/wallet.slice';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import { fromWei, getFeeForYear } from '~root/services/conversions.service';
import { cancelChangeFeeProcess } from '~root/services/operatorContract.service.ts';
import { fetchAndSetOperatorFeeInfo, getOperatorFeeData, getOperatorProcessId } from '~app/redux/operator.slice.ts';
import { formatNumberToUi } from '~lib/utils/numbers';
import { getProcess } from '~app/redux/process.slice.ts';

const CancelUpdateFee = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [futureFee, setFutureFee] = useState(0);
  const process: SingleCluster | undefined = useAppSelector(getProcess);
  const operator: IOperator = process?.item;
  const [successPage, showSuccessPage] = useState(false);
  const [isOpenCancelUpdateFeeDialog, setIsOpenCancelUpdateFeeDialog] = useState(false);
  const dispatch = useAppDispatch();
  const strategyRedirect = useAppSelector(getStrategyRedirect);
  const isContractWallet = useAppSelector(getIsContractWallet);
  const operatorFeeData = useAppSelector(getOperatorFeeData);
  const processOperatorId = useAppSelector(getOperatorProcessId);
  const cancelUpdateProcess = async () => {
    if (!processOperatorId) return navigate(strategyRedirect);
    const response = await cancelChangeFeeProcess({ operator, isContractWallet, dispatch });
    if (response) {
      await dispatch(fetchAndSetOperatorFeeInfo(operator.id));
      setFutureFee(operatorFeeData.operatorFutureFee as number);
      GoogleTagManager.getInstance().sendEvent({
        category: 'cancel',
        action: 'click'
      });
      showSuccessPage(true);
    }
  };

  const backToMyAccount = () => {
    navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.ROOT);
  };

  const declareNewFee = async () => {
    navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.UPDATE_FEE.START);
  };

  // @ts-ignore
  const currentOperatorFee = formatNumberToUi(getFeeForYear(fromWei(operatorFeeData.operatorCurrentFee)));
  // @ts-ignore
  const operatorFutureFee = formatNumberToUi(getFeeForYear(fromWei(futureFee)));

  if (successPage) {
    return (
      <Dialog className={classes.DialogWrapper} open={isOpenCancelUpdateFeeDialog}>
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
          <PrimaryButton isDisabled={false} text={'Back to My Account'} onClick={backToMyAccount} size={ButtonSize.XL} />
        </Grid>
      </Dialog>
    );
  }

  return (
    <Dialog className={classes.DialogWrapper} PaperProps={{ style: { overflow: 'unset', borderRadius: 16 } }} open={isOpenCancelUpdateFeeDialog}>
      <Grid className={classes.CloseDialog} onClick={() => setIsOpenCancelUpdateFeeDialog(true)} />
      <Grid className={classes.GridWrapper} container>
        <HeaderSubHeader title={'Cancel Update Fee'} />
        <Grid className={classes.Text}>
          <b>Canceling</b> the fee update process will notify <br />
          your managed validators and your{' '}
          <b>
            current fee <br />
            will remain
          </b>
        </Grid>
        <Grid className={classes.Line} />
        <Grid className={classes.Text}>
          <b>Declaring a new fee</b> will reset the current <br />
          process and start the process anew.
        </Grid>
        <PrimaryButton isDisabled={false} text={'Cancel Update Fee'} onClick={cancelUpdateProcess} size={ButtonSize.XL} />
        <PrimaryButton isDisabled={false} text={'Declare a New Fee'} onClick={declareNewFee} size={ButtonSize.XL} />
      </Grid>
    </Dialog>
  );
};

export default observer(CancelUpdateFee);
