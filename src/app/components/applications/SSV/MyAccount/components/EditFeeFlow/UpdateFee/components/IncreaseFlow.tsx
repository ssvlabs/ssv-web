import React, { useEffect, useState } from 'react';
import { UpdateFeeProps } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/UpdateFee';
import DeclareFee
    from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/DeclareFee';
import WaitingPeriod
    from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/WaitingPeriod';
import PendingExecution
    from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/PendingExecution';
import { useStores } from '~app/hooks/useStores';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import FeeUpdated
    from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/FeeUpdated';

export type IncreaseFlowProps = {
    newFee: string | number;
    oldFee: string | number;
    currentCurrency: string;
    getCurrentState: Function;
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
}

const IncreaseFlow = ({ oldFee, newFee, currency } : UpdateFeeProps) => {
    const stores = useStores();
    const operatorStore: OperatorStore = stores.Operator;
    const [currentStep, setCurrentStep] = useState(IncreaseSteps.DECLARE_FEE);

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
            console.log('in');
            console.log(startPendingStateTime > todayDate);
            console.log('in');
            // @ts-ignore
            const daysFromEndPendingStateTime = Math.ceil(Math.abs(todayDate - endPendingStateTime) / (1000 * 3600 * 24));
            console.log({ daysFromEndPendingStateTime });

            if (isInPendingState) {
                setCurrentStep(IncreaseSteps.PENDING);
                console.log('pend');
            } else if (startPendingStateTime > todayDate) {
                setCurrentStep(IncreaseSteps.WAITING);
                console.log('wait');
            } else if (todayDate > endPendingStateTime && daysFromEndPendingStateTime >= 3) {
                // @ts-ignore
                const savedOperator = JSON.parse(localStorage.getItem('expired_operators'));
                if (savedOperator && savedOperator?.includes(operatorStore.processOperatorId)) {
                    console.log('declare');
                    setCurrentStep(IncreaseSteps.DECLARE_FEE);
                } else {
                    console.log('conf');
                    setCurrentStep(IncreaseSteps.CONFIRM);
                }
            }
        }
    };

    const components = {
        [IncreaseSteps.DECLARE_FEE]: DeclareFee,
        [IncreaseSteps.WAITING]: WaitingPeriod,
        [IncreaseSteps.PENDING]: PendingExecution,
        [IncreaseSteps.CONFIRM]: FeeUpdated,
    };
    
    const Component = components[currentStep];
    return (
        <Component newFee={newFee} oldFee={oldFee} currentCurrency={currency} getCurrentState={getCurrentState} />
    );
};

export default IncreaseFlow;