import { setIsLoading, setIsPopUpWithIndexingStatus, setIsShowTxPendingPopup, setTransactionStatus, setTxHash } from '~app/redux/appState.slice';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';
import { translations } from '~app/common/config';
import { refreshOperatorsAndClusters } from '~app/redux/account.slice';
import { TransactionStatus } from '~app/enums/transactionStatus.enum.ts';
import { store } from '~app/store';

const CHECK_UPDATES_MAX_ITERATIONS = 60;

const checkIfStateChanged = async (updatedStateGetter: Function, prevState: unknown): Promise<boolean> => {
  try {
    const newState = await updatedStateGetter();
    return JSON.stringify(prevState) !== JSON.stringify(newState);
  } catch (e) {
    console.error('checkIfStateChanged ', e);
    return false;
  }
};

const delay = async (ms?: number) => new Promise((r) => setTimeout(() => r(true), ms || 1000));

export const executeAfterEvent = async ({
  updatedStateGetter,
  prevState,
  callBack,
  txHash
}: {
  updatedStateGetter: Function;
  prevState?: unknown;
  callBack: Function;
  txHash?: string;
}) => {
  let iterations = 0;
  while (iterations <= CHECK_UPDATES_MAX_ITERATIONS) {
    iterations += 1;
    let res;
    if (prevState) {
      res = await checkIfStateChanged(updatedStateGetter, prevState);
    } else {
      res = await updatedStateGetter(txHash);
    }
    if (res) {
      await callBack();
      iterations = CHECK_UPDATES_MAX_ITERATIONS + 1;
    } else {
      await delay();
    }
  }
  return true;
};

export type TxProps = {
  contractMethod: Function;
  payload: any;
  isContractWallet: boolean;
  getterTransactionState?: Function;
  prevState?: unknown;
  dispatch: Function;
  onConfirmed?: (
    events:
      | {
          eventName: string;
          args: {} | {};
        }[]
      | undefined
  ) => void;
  onSuccess?: (receipt: any) => void;
  onError?: (error: any) => void;
  refreshMS?: number;
  shouldThrowError?: boolean;
};

export const transactionExecutor = async ({
  contractMethod,
  payload,
  isContractWallet,
  getterTransactionState,
  prevState,
  dispatch,
  refreshMS,
  onConfirmed,
  onSuccess,
  onError,
  shouldThrowError
}: TxProps) => {
  try {
    if (isContractWallet) {
      contractMethod(...payload);
      dispatch(setIsShowTxPendingPopup(true));
      return true;
    }

    const tx = await contractMethod(...payload);

    if (tx.hash) {
      dispatch(setTxHash(tx.hash));
      dispatch(setTransactionStatus(TransactionStatus.PENDING));
      dispatch(setIsShowTxPendingPopup(true));
    }

    const receipt = await tx.wait();

    onSuccess?.(receipt);

    if (receipt.blockHash) {
      if (store.getState().appState?.isPopUpWithIndexingStatus) {
        dispatch(setTransactionStatus(TransactionStatus.INDEXING));
      }
      if (onConfirmed) {
        await onConfirmed(receipt.events || []);
        return true;
      }

      if (refreshMS) {
        await delay(refreshMS);
        await dispatch(refreshOperatorsAndClusters());
        return true;
      }

      const event: boolean = receipt.hasOwnProperty('events');
      if (event) {
        if (!getterTransactionState) {
          await dispatch(refreshOperatorsAndClusters());
          return true;
        }
        return await executeAfterEvent({
          updatedStateGetter: getterTransactionState,
          prevState,
          callBack: () => dispatch(refreshOperatorsAndClusters()),
          txHash: tx.hash
        });
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (e: any) {
    dispatch(
      setMessageAndSeverity({
        message: e.shortMessage || e.message || translations.DEFAULT.DEFAULT_ERROR_MESSAGE,
        severity: 'error'
      })
    );
    dispatch(setIsLoading(false));
    onError?.(e);
    if (shouldThrowError) {
      throw e;
    }
    return false;
  } finally {
    if (!isContractWallet) {
      dispatch(setIsLoading(false));
      dispatch(setIsShowTxPendingPopup(false));
      dispatch(setTransactionStatus(TransactionStatus.PENDING));
      dispatch(setIsPopUpWithIndexingStatus(false));
    }
  }
};
