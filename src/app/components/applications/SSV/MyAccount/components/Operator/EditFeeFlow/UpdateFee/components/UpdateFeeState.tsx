import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { timeDiffCalc } from '~lib/utils/time';
import { useStores } from '~app/hooks/useStores';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import {
  useStyles,
} from '~app/components/applications/SSV/MyAccount/components/Operator/EditFeeFlow/UpdateFee/components/index.styles';

const PROCESS_STATE_START = 0;
const PROCESS_STATE_WAITING = 1;
const PROCESS_STATE_PENDING = 2;
const PROCESS_STATE_SUCCESS = 3;
const PROCESS_STATE_EXPIRED = 4;

const UpdateFeeState = () => {
  const stores = useStores();
  const navigate = useNavigate();
  const operatorStore: OperatorStore = stores.Operator;
  const applicationStore: ApplicationStore = stores.Application;
  const [processState, setProcessState] = useState(0);
  const classes = useStyles({ step: processState });

  useEffect(() => {
    if (!operatorStore.processOperatorId) {
      navigate(applicationStore.strategyRedirect);
      return;
    }
    setInterval(getState, 2000);
    getState();
  }, []);

  const getState = async () => {
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
        setProcessState(PROCESS_STATE_PENDING);
      } else if (startPendingStateTime > todayDate) {
        setProcessState(PROCESS_STATE_WAITING);
      } else if (todayDate > endPendingStateTime && daysFromEndPendingStateTime <= 3) {
        // @ts-ignore
        const savedOperator = JSON.parse(localStorage.getItem('expired_operators'));
        if (savedOperator && savedOperator?.includes(operatorStore.processOperatorId)) {
          setProcessState(PROCESS_STATE_START);
          return;
        }
        setProcessState(PROCESS_STATE_EXPIRED);
      }
    }
  };

  const State = () => {
    if (processState === PROCESS_STATE_START) {
      return null;
    }
    let text = 'Waiting Period';
    switch (processState) {
      case PROCESS_STATE_PENDING:
        text = 'Pending Execution';
        break;
      case PROCESS_STATE_SUCCESS:
        text = 'Success';
        break;
      case PROCESS_STATE_EXPIRED:
        text = 'Expired';
        break;
    }
    return (
      <Grid item className={classes.Step}>
        {text}
      </Grid>
    );
  };

  const TimeReminder = () => {
    if ([1, 2, 4].indexOf(processState) === -1) return null;
    let text: string;
    // @ts-ignore
    const operatorBeginApprovalTime = new Date(operatorStore.operatorApprovalBeginTime * 1000);

    const today = new Date();
    if (processState === 1) {
      text = `${timeDiffCalc(operatorBeginApprovalTime, today)} Left`;
      return (
        <Typography style={{ alignSelf: 'center' }} className={classes.WaitingPeriod}>
          {text}
        </Typography>
      );
    }
    if (processState === 2) {
      // @ts-ignore
      const operatorEndApprovalTime = new Date(operatorStore.operatorApprovalEndTime * 1000);
      text = `Expires in ~ ${timeDiffCalc(today, operatorEndApprovalTime)}`;
      return (
        <Typography style={{ alignSelf: 'center' }} className={classes.ExpiresIn}>
          {text}
        </Typography>
      );
    }
    // @ts-ignore
    const expiredOn = new Date(operatorStore.operatorApprovalEndTime * 1000);
    const expiredDay = expiredOn.getDay();
    const expiredMonth = expiredOn.getMonth();
    const expiredYear = expiredOn.getFullYear();
    text = `on ${`${expiredDay}.${expiredMonth}.${expiredYear}`}`;
    return (
      <Typography style={{ alignSelf: 'center' }} className={classes.ExpiresIn}>
        {text}
      </Typography>
    );
  };

  return (
    <Grid container item className={classes.HeaderWrapper} alignItems={'flex-end'} direction={'column'}>
      <State />
      <TimeReminder />
    </Grid>
  );
};

export default observer(UpdateFeeState);
