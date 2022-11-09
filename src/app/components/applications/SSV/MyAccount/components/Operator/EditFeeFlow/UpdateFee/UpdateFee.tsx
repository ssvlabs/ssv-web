import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
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
  const history = useHistory();
  const ssvRoutes = config.routes.SSV;
  const operatorStore: OperatorStore = stores.Operator;
  const [operator, setOperator] = useState(null);
  const [previousFee, setPreviousFee] = useState('');
  const applicationStore: ApplicationStore = stores.Application;

  useEffect(() => {
    if (!operatorStore.processOperatorId) return history.push(applicationStore.strategyRedirect);
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

      const daysFromEndPendingStateTime = Math.ceil(
        Math.abs(
          todayDate.getTime() - endPendingStateTime.getTime(),
        ) / (1000 * 3600 * 24),
      );

      if (isInPendingState) {
        history.replace(ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.PENDING);
      } else if (startPendingStateTime > todayDate) {
        history.replace(ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.UPDATE);
      } else if (todayDate > endPendingStateTime && daysFromEndPendingStateTime <= 3) {
        // @ts-ignore
        const savedOperator = JSON.parse(localStorage.getItem('expired_operators'));
        if (savedOperator && savedOperator?.includes(operatorStore.processOperatorId)) {
          history.replace(ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.START);
        } else {
          history.replace(ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.EXPIRED);
        }
      } else {
        history.replace(ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.SUCCESS);
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
        <OperatorId id={id} />
      </WhiteWrapper>
      <Grid className={classes.BodyWrapper}>
        <Route path={ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.ROOT}>
          <Switch>
            <Route exact path={ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.ROOT}>
              <Redirect to={ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.START} />
            </Route>
            <Route exact path={ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.START} component={() => {
              return <DeclareFee getCurrentState={getCurrentState} />;
            }} />
            <Route exact path={ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.UPDATE} component={() => {
              return <WaitingPeriod getCurrentState={getCurrentState} />;
            }} />
            <Route exact path={ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.PENDING} component={() => {
              return <PendingExecution setPreviousFee={setPreviousFee} />;
            }} />
            <Route exact path={ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.SUCCESS} component={() => {
              return <FeeUpdated previousFee={previousFee} />;
            }} />
            <Route exact path={ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.EXPIRED} component={() => {
              return <PendingExpired />;
            }} />
          </Switch>
        </Route>
        <CancelUpdateFee />
      </Grid>
    </Grid>
  );
};

export default observer(UpdateFee);
