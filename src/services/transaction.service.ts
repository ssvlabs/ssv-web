import { Contract } from 'ethers';
import { store } from '~app/store';
import { setIsLoading, setIsShowTxPendingPopup, setTxHash } from '~app/redux/appState.slice';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';
import { translations } from '~app/common/config';
import { executeAfterEventV2 } from '~root/services/events.service';
import { getEventByTxHash } from '~root/services/contractEvent.service';
import { delay } from '~root/services/utils.service';
import { getValidator } from '~root/services/validator.service';
import { TransactionMethod } from '~app/enums/transactions.enum';

const contractMethods = {
  [TransactionMethod.RegisterValidator]: async (contract: Contract, payload: any) => await contract.registerValidator(...payload.values()),
  [TransactionMethod.BulkRegisterValidator]: async (contract: Contract, payload: any) => await contract.bulkRegisterValidator(...payload.values()),
  [TransactionMethod.RemoveValidator]: async (contract: Contract, payload: any) => await contract.removeValidator(...payload),
  [TransactionMethod.BulkRemoveValidator]: async (contract: Contract, payload: any) => await contract.bulkRemoveValidator(...payload),
  [TransactionMethod.ExitValidator]: async (contract: Contract, payload: any) => await contract.exitValidator(...payload),
  [TransactionMethod.BulkExitValidator]: async (contract: Contract, payload: any) => await contract.bulkExitValidator(...payload),
  [TransactionMethod.ReactivateCluster]: async (contract: Contract, payload: any) => await contract.reactivate(...payload),
  [TransactionMethod.UpdateValidator]: async (contract: Contract, payload: any) => await contract.reactivate(...payload),
};

const finishTransactionExecutor = {
  [TransactionMethod.RegisterValidator]: async (hash: string) => await executeAfterEventV2(async () => !!await getEventByTxHash(hash), delay),
  [TransactionMethod.BulkRegisterValidator]: async (hash: string) => await executeAfterEventV2(async () => !!await getEventByTxHash(hash), delay),
  [TransactionMethod.RemoveValidator]: async (publicKey: string) => await executeAfterEventV2(async () => !await getValidator(publicKey, true), delay),
  [TransactionMethod.BulkRemoveValidator]: async (publicKey: string) => await executeAfterEventV2(async () => !await getValidator(publicKey, true), delay),
  [TransactionMethod.ReactivateCluster]: async (hash: string) => await executeAfterEventV2(async () => !!await getEventByTxHash(hash), delay),
  [TransactionMethod.UpdateValidator]: async (hash: string) => await executeAfterEventV2(async () => !!await getEventByTxHash(hash), delay),
};

export const transactionExecutor = async ({ methodType, contract, payload, isContractWallet, callbackAfterExecution }: {
  methodType: TransactionMethod,
  contract: Contract,
  payload: any,
  isContractWallet: boolean,
  callbackAfterExecution: Function,
}) => {
  try {
    let tx = await contractMethods[methodType](contract, payload);
    if (tx.hash) {
      store.dispatch(setTxHash(tx.hash));
      store.dispatch(setIsShowTxPendingPopup(true));
    }
    if (isContractWallet) {
      return true;
    }
    const receipt = await tx.wait();
    if (receipt.blockHash) {
      const event: boolean = receipt.hasOwnProperty('events');
      if (event) {
        let finishExecuteData = '';
        if (methodType === TransactionMethod.RegisterValidator || methodType === TransactionMethod.BulkRegisterValidator || methodType === TransactionMethod.ReactivateCluster || methodType === TransactionMethod.UpdateValidator) {
          finishExecuteData = receipt.transactionHash;
        }
        if (methodType === TransactionMethod.RemoveValidator) {
          finishExecuteData = payload.publicKey;
        }
        if (methodType === TransactionMethod.BulkRemoveValidator) {
          finishExecuteData = payload.publicKey[0];
        }
        if (methodType === TransactionMethod.ExitValidator || methodType === TransactionMethod.BulkExitValidator) {
          return true;
        }
        await finishTransactionExecutor[methodType](finishExecuteData);
      } else {
        return false;
      }
    } else {
      return false;
    }
    return false;
  } catch (e: any) {
    store.dispatch(setMessageAndSeverity({
      message: e.message || translations.DEFAULT.DEFAULT_ERROR_MESSAGE,
      severity: 'error',
    }));
    store.dispatch(setIsLoading(false));
    return false;
  } finally {
    await callbackAfterExecution();
    if (!isContractWallet) {
      store.dispatch(setIsLoading(false));
      store.dispatch(setIsShowTxPendingPopup(false));
    }
  }
};

