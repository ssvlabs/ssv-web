import { useEffect, useState } from 'react';
import CancelFee from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/CancelFee';
import DeclareFee from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/DeclareFee';
import FeeUpdated from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/FeeUpdated';
import WaitingPeriod from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/WaitingPeriod';
import PendingExpired from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/PendingExpired';
import PendingExecution from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/PendingExecution';
import { SingleOperator } from '~app/model/processes.model';
import { IOperator, UpdateFeeProps } from '~app/model/operator.model';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { getIsContractWallet } from '~app/redux/wallet.slice';
import { getOperatorFeeData } from '~app/redux/operator.slice.ts';
import { cancelChangeFeeProcess } from '~root/services/operatorContract.service.ts';
import { getProcess } from '~app/redux/process.slice.ts';

export type IncreaseFlowProps = {
  newFee: string | number;
  oldFee: string | number;
  currentCurrency: string;
  getCurrentState: Function;
  declareNewFeeHandler: Function;
  cancelUpdateFee: Function;
};

enum IncreaseSteps {
  DECLARE_FEE,
  WAITING,
  PENDING,
  CONFIRM,
  EXPIRED,
  CANCEL
}

const IncreaseFlow = ({ oldFee, newFee, currency, declareNewFeeHandler } : UpdateFeeProps) => {
    const process: SingleOperator | undefined = useAppSelector(getProcess);
    const operator: IOperator = process?.item;
    const [currentStep, setCurrentStep] = useState(IncreaseSteps.DECLARE_FEE);
    const isContractWallet = useAppSelector(getIsContractWallet);
    const dispatch = useAppDispatch();
    const operatorFeeData = useAppSelector(getOperatorFeeData);

  useEffect(() => {
    getCurrentState();
  }, []);

    const getCurrentState = (isExecuted?: boolean) => {
        if (isExecuted) {
            setCurrentStep(IncreaseSteps.CONFIRM);
            return;
        }
        if (operatorFeeData.operatorApprovalBeginTime && operatorFeeData.operatorApprovalEndTime && operatorFeeData.operatorFutureFee) {
            const todayDate = new Date();
            const endPendingStateTime = new Date(operatorFeeData.operatorApprovalEndTime * 1000);
            const startPendingStateTime = new Date(operatorFeeData.operatorApprovalBeginTime * 1000);
            const isInPendingState = todayDate >= startPendingStateTime && todayDate < endPendingStateTime;

      // @ts-ignore
      const daysFromEndPendingStateTime = Math.ceil(Math.abs(todayDate - endPendingStateTime) / (1000 * 3600 * 24));

      if (isInPendingState) {
        setCurrentStep(IncreaseSteps.PENDING);
      } else if (startPendingStateTime > todayDate) {
        setCurrentStep(IncreaseSteps.WAITING);
      } else if (todayDate > endPendingStateTime) {
        if (daysFromEndPendingStateTime >= 3) {
          declareNewFeeHandler();
          return;
        }
        setCurrentStep(IncreaseSteps.EXPIRED);
      }
    }
  };

    const cancelUpdateFee = async () => {
        const res = await cancelChangeFeeProcess({ operator, isContractWallet, dispatch });
        res && setCurrentStep(IncreaseSteps.CANCEL);
    };

  const components = {
    [IncreaseSteps.CANCEL]: CancelFee,
    [IncreaseSteps.CONFIRM]: FeeUpdated,
    [IncreaseSteps.WAITING]: WaitingPeriod,
    [IncreaseSteps.DECLARE_FEE]: DeclareFee,
    [IncreaseSteps.EXPIRED]: PendingExpired,
    [IncreaseSteps.PENDING]: PendingExecution
  };

  const Component = components[currentStep];
  return (
    <Component
      cancelUpdateFee={cancelUpdateFee}
      declareNewFeeHandler={declareNewFeeHandler}
      newFee={newFee}
      oldFee={oldFee}
      currentCurrency={currency}
      getCurrentState={getCurrentState}
    />
  );
};

export default IncreaseFlow;
