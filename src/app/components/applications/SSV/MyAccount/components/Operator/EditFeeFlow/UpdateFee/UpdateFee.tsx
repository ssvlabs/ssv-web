import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import WhiteWrapper from '~app/components/common/WhiteWrapper';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import OperatorId from '~app/components/applications/SSV/MyAccount/components/Operator/common/OperatorId';
import CancelUpdateFee
  from '~app/components/applications/SSV/MyAccount/components/Operator/EditFeeFlow/CancelUpdateFee';
import {
  useStyles,
} from '~app/components/applications/SSV/MyAccount/components/Operator/EditFeeFlow/UpdateFee/UpdateFee.styles';
import DeclareFee
  from '~app/components/applications/SSV/MyAccount/components/Operator/EditFeeFlow/UpdateFee/components/DeclareFee';
import FeeUpdated
  from '~app/components/applications/SSV/MyAccount/components/Operator/EditFeeFlow/UpdateFee/components/FeeUpdated';
import WaitingPeriod
  from '~app/components/applications/SSV/MyAccount/components/Operator/EditFeeFlow/UpdateFee/components/WaitingPeriod';
import PendingExpired
  from '~app/components/applications/SSV/MyAccount/components/Operator/EditFeeFlow/UpdateFee/components/PendingExpired';
import PendingExecution
  from '~app/components/applications/SSV/MyAccount/components/Operator/EditFeeFlow/UpdateFee/components/PendingExecution';

const UpdateFee = () => {
  const stores = useStores();
  const navigate = useNavigate();
  const ssvRoutes = config.routes.SSV;
  const operatorStore: OperatorStore = stores.Operator;
  const [operator, setOperator] = useState(null);
  const [previousFee, setPreviousFee] = useState('');
  const applicationStore: ApplicationStore = stores.Application;

  useEffect(() => {
    if (!operatorStore.processOperatorId) return navigate(applicationStore.strategyRedirect);
    applicationStore.setIsLoading(true);
    Operator.getInstance().getOperator(operatorStore.processOperatorId).then(async (response: any) => {
      if (response) {
        setOperator(response);
        await getCurrentState();
      }
      applicationStore.setIsLoading(false);
    });
  }, []);

  const getCurrentState = async () => {
    // @ts-ignore
    await operatorStore.getOperatorFeeInfo(operatorStore.processOperatorId);
    if (operatorStore.operatorApprovalBeginTime && operatorStore.operatorApprovalEndTime && operatorStore.operatorFutureFee) {
      const todayDate = new Date();
      const endPendingStateTime = new Date(operatorStore.operatorApprovalEndTime * 1000);
      const startPendingStateTime = new Date(operatorStore.operatorApprovalBeginTime * 1000);
      const isInPendingState = todayDate >= startPendingStateTime && todayDate < endPendingStateTime;

      // @ts-ignore
      const daysFromEndPendingStateTime = Math.ceil(Math.abs(todayDate - endPendingStateTime) / (1000 * 3600 * 24));

      if (isInPendingState) {
        navigate(ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.PENDING);
      } else if (startPendingStateTime > todayDate) {
        navigate(ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.UPDATE);
      } else if (todayDate > endPendingStateTime && daysFromEndPendingStateTime <= 3) {
        // @ts-ignore
        const savedOperator = JSON.parse(localStorage.getItem('expired_operators'));
        if (savedOperator && savedOperator?.includes(operatorStore.processOperatorId)) {
          navigate(ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.START);
        } else {
          navigate(ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.EXPIRED);
        }
      }
    }
  };

  // @ts-ignore
  const { logo, id } = operator || {};
  const classes = useStyles({ operatorLogo: logo });

  if (!operator) return null;

  return (
      <Grid container item>
        <WhiteWrapper header={'Update Operator Fee'}>
          <OperatorId id={id}/>
        </WhiteWrapper>
        <Grid className={classes.BodyWrapper}>
          <Routes>
              <Route path={ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.START}
                     element={<DeclareFee getCurrentState={getCurrentState}/>}/>
              <Route path={ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.UPDATE}
                     element={<WaitingPeriod getCurrentState={getCurrentState}/>}/>
              <Route path={ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.PENDING}
                     element={<PendingExecution setPreviousFee={setPreviousFee}/>}/>
              <Route path={ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.SUCCESS}
                     element={<FeeUpdated previousFee={previousFee}/>}/>
              <Route path={ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.EXPIRED} element={<PendingExpired/>}/>
          </Routes>
          <CancelUpdateFee/>
        </Grid>
      </Grid>
  );
};

export default observer(UpdateFee);
