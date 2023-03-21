import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import BorderScreen from '~app/components/common/BorderScreen';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import ReactStepper
  from '~app/components/applications/SSV/MyAccount/components/Operator/EditFeeFlow/UpdateFee/components/Stepper';
import { useStyles } from './index.styles';

const PendingExpired = () => {
  const stores = useStores();
  const navigate = useNavigate();
  const [operator, setOperator] = useState(null);
  const ssvStore: SsvStore = stores.SSV;
  const walletStore: WalletStore = stores.Wallet;
  const operatorStore: OperatorStore = stores.Operator;
  const applicationStore: ApplicationStore = stores.Application;

  useEffect(() => {
    if (!operatorStore.processOperatorId) return navigate(applicationStore.strategyRedirect);
    // @ts-ignore
    const savedOperator = JSON.parse(localStorage.getItem('expired_operators')) ?? [];
    if (savedOperator && !savedOperator.includes(operatorStore.processOperatorId)) savedOperator.push(operatorStore.processOperatorId);
    localStorage.setItem('expired_operators', JSON.stringify(savedOperator));
    applicationStore.setIsLoading(true);
    Operator.getInstance().getOperator(operatorStore.processOperatorId).then(async (response: any) => {
      if (response) {
        setOperator(response);
        applicationStore.setIsLoading(false);
      }
    });
  }, []);

  const backToMyAccount = () => {
    navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD);
  };

  // @ts-ignore
  const classes = useStyles({ step: 4 });

  if (!operator) return null;

  // @ts-ignore
  const currentOperatorFee = formatNumberToUi(ssvStore.newGetFeeForYear(walletStore.fromWei(operatorStore.operatorCurrentFee)));
  // @ts-ignore
  const operatorFutureFee = formatNumberToUi(ssvStore.newGetFeeForYear(walletStore.fromWei(operatorStore.operatorFutureFee)));

  return (
    <BorderScreen
      blackHeader
      withoutNavigation
      body={[
        <Grid container item>
          <Grid container item className={classes.HeaderWrapper}>
            <Grid item>
              <Typography className={classes.Title}>Update Fee</Typography>
            </Grid>
            <Grid item className={classes.Step}>
              Expired
            </Grid>
          </Grid>
          <ReactStepper step={4} subTextAlign={'center'} />
          <Grid item container className={classes.TextWrapper}>
            <Grid item>
              <Typography>Your declare fee has expired because you have not executed it.</Typography>
            </Grid>
          </Grid>
          <Grid item container className={classes.FeesChangeWrapper}>
            <Grid item>
              <SsvAndSubTitle bold leftTextAlign ssv={currentOperatorFee} />
            </Grid>
            <Grid item className={classes.NegativeArrow} />
            <Grid item>
              <SsvAndSubTitle fade bold leftTextAlign ssv={operatorFutureFee} />
            </Grid>
          </Grid>
          <Grid item container className={classes.ButtonsWrapper}>
            <PrimaryButton disable={false} text={'Back to My Account'} submitFunction={backToMyAccount} />
          </Grid>
        </Grid>,

      ]}
    />
  );
};

export default observer(PendingExpired);
