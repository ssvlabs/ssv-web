import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import ImageDiv from '~app/common/components/ImageDiv/ImageDiv';
import WhiteWrapper from '~app/common/components/WhiteWrapper/WhiteWrapper';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import CancelUpdateFee from '~app/components/MyAccount/components/CancelUpdateFee';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStyles } from '~app/components/MyAccount/components/UpdateFee/UpdateFee.styles';
import DeclareFee from '~app/components/MyAccount/components/UpdateFee/components/DeclareFee';
import FeeUpdated from '~app/components/MyAccount/components/UpdateFee/components/FeeUpdated';
import WaitingPeriod from '~app/components/MyAccount/components/UpdateFee/components/WaitingPeriod';
import PendingExpired from '~app/components/MyAccount/components/UpdateFee/components/PendingExpired';
import PendingExecution from '~app/components/MyAccount/components/UpdateFee/components/PendingExecution';

const UpdateFee = () => {
    const stores = useStores();
    // @ts-ignore
    const { operator_id } = useParams();
    const operatorStore: OperatorStore = stores.Operator;
    const [operator, setOperator] = useState(null);
    const [processState, setProcessState] = useState(0);
    const applicationStore: ApplicationStore = stores.Application;
    const notificationsStore: NotificationsStore = stores.Notifications;

    useEffect(() => {
        applicationStore.setIsLoading(true);
        Operator.getInstance().getOperator(operator_id).then((response: any) => {
            if (response) {
                setOperator(response);
                applicationStore.setIsLoading(false);
                getCurrentState();
            }
        });
    }, []);

    const getCurrentState = async (forceState?: number) => {
        if (forceState) {
            setProcessState(forceState);
            return;
        }
        await operatorStore.getOperatorFeeInfo(operator_id);
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
            } else if (todayDate > endPendingStateTime && daysFromEndPendingStateTime <= 0) {
                setProcessState(4);
            }
        }
    };

    // @ts-ignore
    const { logo, address } = operator || {};
    const classes = useStyles({ operatorLogo: logo });

    const copyToClipboard = (key: string) => {
        navigator.clipboard.writeText(key);
        notificationsStore.showMessage('Copied to clipboard.', 'success');
    };

    const openExplorer = (key: string) => {
        window.open(`${config.links.LINK_EXPLORER}/${key}`, '_blank');
    };

    const renderBody = () => {
        // @ts-ignore
        switch (processState) {
            // @ts-ignore
            case 0:
                return <DeclareFee getCurrentState={getCurrentState} />;
            // @ts-ignore
            case 1:
                return <WaitingPeriod getCurrentState={getCurrentState} />;
            // @ts-ignore
            case 2:
                return <PendingExecution getCurrentState={getCurrentState} />;
            // @ts-ignore
            case 3:
                return <FeeUpdated />;
            // @ts-ignore
            case 4:
                return <PendingExpired />;
            default:
            // code block
        }
    };

    if (!operator) return null;

    return (
      <Grid container item>
        <WhiteWrapper header={'Update Operator Fee'}>
          <Grid item container className={classes.HeaderWrapper}>
            <Typography className={classes.Address}>{address}</Typography>
            <ImageDiv onClick={copyToClipboard} image={'copy'} width={24} height={24} />
            <ImageDiv onClick={openExplorer} image={'explorer'} width={24} height={24} />
          </Grid>
        </WhiteWrapper>

        <Grid className={classes.BodyWrapper}>
          {renderBody()}
          <CancelUpdateFee />
        </Grid>
      </Grid>
    );
};

export default observer(UpdateFee);