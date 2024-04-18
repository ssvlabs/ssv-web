import React, { useEffect, useState } from 'react';
import { useStores } from '~app/hooks/useStores';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import { UpdateFeeProps } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/UpdateFee';
import CancelFee from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/CancelFee';
import DeclareFee from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/DeclareFee';
import FeeUpdated from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/FeeUpdated';
import WaitingPeriod from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/WaitingPeriod';
import PendingExpired from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/PendingExpired';
import PendingExecution from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/PendingExecution';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsContractWallet } from '~app/redux/wallet.slice';

export type IncreaseFlowProps = {
    newFee: string | number;
    oldFee: string | number;
    currentCurrency: string;
    getCurrentState: Function;
    declareNewFeeHandler: Function;
    cancelUpdateFee: Function;
};

// eslint-disable-next-line no-unused-vars
enum IncreaseSteps {
    // eslint-disable-next-line no-unused-vars
    DECLARE_FEE,
    // eslint-disable-next-line no-unused-vars
    WAITING,
    // eslint-disable-next-line no-unused-vars
    PENDING,
    // eslint-disable-next-line no-unused-vars
    CONFIRM,
    // eslint-disable-next-line no-unused-vars
    EXPIRED,
    // eslint-disable-next-line no-unused-vars
    CANCEL,
}

const IncreaseFlow = ({ oldFee, newFee, currency, declareNewFeeHandler } : UpdateFeeProps) => {
    const stores = useStores();
    const operatorStore: OperatorStore = stores.Operator;
    const [currentStep, setCurrentStep] = useState(IncreaseSteps.DECLARE_FEE);
    const isContractWallet = useAppSelector(getIsContractWallet);

    useEffect(() => {
        getCurrentState();
    }, []);

    const getCurrentState = (isExecuted?: boolean) => {
        if (isExecuted) {
            setCurrentStep(IncreaseSteps.CONFIRM);
            return;
        }
        if (operatorStore.operatorApprovalBeginTime && operatorStore.operatorApprovalEndTime && operatorStore.operatorFutureFee) {
            const todayDate = new Date();
            const endPendingStateTime = new Date(operatorStore.operatorApprovalEndTime * 1000);
            const startPendingStateTime = new Date(operatorStore.operatorApprovalBeginTime * 1000);
            const isInPendingState = todayDate >= startPendingStateTime && todayDate < endPendingStateTime;

            // @ts-ignore
            const daysFromEndPendingStateTime = Math.ceil(Math.abs(todayDate - endPendingStateTime) / (1000 * 3600 * 24));

            if (isInPendingState) {
                setCurrentStep(IncreaseSteps.PENDING);
            } else if (startPendingStateTime > todayDate) {
                setCurrentStep(IncreaseSteps.WAITING);
            } else if (todayDate > endPendingStateTime) {
                setCurrentStep(IncreaseSteps.EXPIRED);
            } else if (todayDate > endPendingStateTime ) {
                if (daysFromEndPendingStateTime >= 3){
                    declareNewFeeHandler();
                    return;
                }
                setCurrentStep(IncreaseSteps.EXPIRED);
            }


        }
    };

    const cancelUpdateFee = async () => {
        const res = await operatorStore.cancelChangeFeeProcess(operatorStore.processOperatorId as number, isContractWallet);
        res && setCurrentStep(IncreaseSteps.CANCEL);
    };

    const components = {
        [IncreaseSteps.CANCEL]: CancelFee,
        [IncreaseSteps.CONFIRM]: FeeUpdated,
        [IncreaseSteps.WAITING]: WaitingPeriod,
        [IncreaseSteps.DECLARE_FEE]: DeclareFee,
        [IncreaseSteps.EXPIRED]: PendingExpired,
        [IncreaseSteps.PENDING]: PendingExecution,
    };

    const Component = components[currentStep];
    return (
        <Component cancelUpdateFee={cancelUpdateFee} declareNewFeeHandler={declareNewFeeHandler} newFee={newFee} oldFee={oldFee} currentCurrency={currency} getCurrentState={getCurrentState} />
    );
};

export default IncreaseFlow;
