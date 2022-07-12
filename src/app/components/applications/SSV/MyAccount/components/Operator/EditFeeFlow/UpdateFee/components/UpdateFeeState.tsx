import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import { useStyles } from './index.styles';
import { timeDiffCalc } from '~lib/utils/time';
import Typography from '@material-ui/core/Typography';

const UpdateFeeState = () => {
    const stores = useStores();
    const history = useHistory();
    const operatorStore: OperatorStore = stores.Operator;
    const [processState, setProcessState] = useState(0);
    const classes = useStyles({ step: processState });

    useEffect(() => {
        if (!operatorStore.processOperatorId) return history.push(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
        operatorStore.getOperatorFeeInfo(operatorStore.processOperatorId).then(() => {
            if (operatorStore.operatorApprovalBeginTime && operatorStore.operatorApprovalEndTime && operatorStore.operatorFutureFee) {
                const todayDate = new Date();
                const endPendingStateTime = new Date(operatorStore.operatorApprovalEndTime * 1000);
                const startPendingStateTime = new Date(operatorStore.operatorApprovalBeginTime * 1000);
                const isInPendingState = todayDate >= startPendingStateTime && todayDate < endPendingStateTime;

                // @ts-ignore
                const daysFromEndPendingStateTime = Math.ceil(Math.abs(todayDate - endPendingStateTime) / (1000 * 3600 * 24));
                
                if (isInPendingState) {
                    setProcessState(2);
                } else if (startPendingStateTime > todayDate) {
                    setProcessState(1);
                } else if (todayDate > endPendingStateTime && daysFromEndPendingStateTime <= 3) {
                    // @ts-ignore
                    const savedOperator = JSON.parse(localStorage.getItem('expired_operators'));
                    if (savedOperator && savedOperator?.includes(operatorStore.processOperatorId)) {
                        setProcessState(0);
                        return;
                    }
                    setProcessState(4);
                }
            }
        });
    }, []);

    const State = () => {
        if (processState === 0) return null;
        let text = 'Waiting Period';
        if (processState === 2) text = 'Pending Execution';
        if (processState === 3) text = 'Success';
        if (processState === 4) text = 'Expired';
        return (
          <Grid item className={classes.Step}>
            {text}
          </Grid>
        );
    };
    
    const TimeReminder = () => {
        if ([1, 2, 4].indexOf(processState) === -1) return null;
        let text = '';
        // @ts-ignore
        const operatorBeginApprovalTime = new Date(operatorStore.operatorApprovalBeginTime * 1000);

        const today = new Date();
        if (processState === 1) {
            text = `${timeDiffCalc(operatorBeginApprovalTime, today)} Left`;
            return (
              <Typography className={classes.WaitingPeriod}>
                {text}
              </Typography>
            );
        }
        if (processState === 2) {
            // @ts-ignore
            const operatorEndApprovalTime = new Date(operatorStore.operatorApprovalEndTime * 1000);
            text = `Expires in ~ ${timeDiffCalc(today, operatorEndApprovalTime)}`;
            return (
              <Typography className={classes.ExpiresIn}>
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
          <Typography className={classes.ExpiresIn}>
            {text}
          </Typography>
        );
    };
    console.log(processState);

    return (
      <Grid container item className={classes.HeaderWrapper} alignItems={'flex-end'} direction={'column'}>
        <State />
        <TimeReminder />
      </Grid>
    );
};

export default observer(UpdateFeeState);