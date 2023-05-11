import React, { useState } from 'react';
import { UpdateFeeProps } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/UpdateFee';
import DeclareFee
    from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/DeclareFee';
import WaitingPeriod
    from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/WaitingPeriod';
import PendingExecution
    from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/PendingExecution';
import PendingExpired
    from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/PendingExpired';
import { useStores } from '~app/hooks/useStores';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';

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

const IncreaseFlow = ({ oldFee, inputValue, currency } : UpdateFeeProps) => {
    const stores = useStores();
    const operatorStore: OperatorStore = stores.Operator;
    const [currentStep, setCurrentStep] = useState(IncreaseSteps.DECLARE_FEE);

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
                setCurrentStep(IncreaseSteps.PENDING);
            } else if (startPendingStateTime > todayDate) {
                setCurrentStep(IncreaseSteps.WAITING);
            } else if (todayDate > endPendingStateTime && daysFromEndPendingStateTime <= 3) {
                // @ts-ignore
                const savedOperator = JSON.parse(localStorage.getItem('expired_operators'));
                if (savedOperator && savedOperator?.includes(operatorStore.processOperatorId)) {
                    setCurrentStep(IncreaseSteps.DECLARE_FEE);
                } else {
                    setCurrentStep(IncreaseSteps.CONFIRM);
                }
            }
        }
    };

    const components = {
        [IncreaseSteps.DECLARE_FEE]: DeclareFee,
        [IncreaseSteps.WAITING]: WaitingPeriod,
        [IncreaseSteps.PENDING]: PendingExecution,
        [IncreaseSteps.CONFIRM]: PendingExpired,
    };
    
    const Component = components[currentStep];
    return (
        <Component newFee={inputValue} oldFee={oldFee} currentCurrency={currency} getCurrentState={getCurrentState} />
    );
};

export default IncreaseFlow;