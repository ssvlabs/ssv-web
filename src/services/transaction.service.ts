import { store } from '~app/store';
import { setIsLoading, setIsShowTxPendingPopup, setTxHash } from '~app/redux/appState.slice';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';
import { translations } from '~app/common/config';
import { executeAfterEvent } from '~root/services/events.service';
import { refreshOperatorsAndClusters } from '~app/redux/account.slice';

export const transactionExecutor = async ({ contractMethod, payload, isContractWallet, getterTransactionState, prevState }: {
  contractMethod: Function,
  payload: any,
  isContractWallet: boolean,
  getterTransactionState?: Function,
  prevState?: any,
}) => {
  try {
    let tx = await contractMethod(...payload);
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
        if (!getterTransactionState) {
          await store.dispatch(refreshOperatorsAndClusters());
          return true;
        }
        return await executeAfterEvent({ updatedStateGetter: getterTransactionState, prevState, callBack: () => store.dispatch(refreshOperatorsAndClusters()), txHash: tx.hash });
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (e: any) {
    store.dispatch(setMessageAndSeverity({ message: e.message || translations.DEFAULT.DEFAULT_ERROR_MESSAGE, severity: 'error' }));
    store.dispatch(setIsLoading(false));
    return false;
  } finally {
    if (!isContractWallet) {
      store.dispatch(setIsLoading(false));
      store.dispatch(setIsShowTxPendingPopup(false));
    }
  }
};
