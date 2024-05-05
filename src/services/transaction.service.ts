import { setIsLoading, setIsShowTxPendingPopup, setTxHash } from '~app/redux/appState.slice';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';
import { translations } from '~app/common/config';
import { executeAfterEvent } from '~root/services/events.service';
import { refreshOperatorsAndClusters } from '~app/redux/account.slice';

export const transactionExecutor = async ({ contractMethod, payload, isContractWallet, getterTransactionState, prevState, dispatch }: {
  contractMethod: Function,
  payload: any,
  isContractWallet: boolean,
  getterTransactionState?: Function,
  prevState?: any,
  dispatch: Function,
}) => {
  try {
    let tx = await contractMethod(...payload);
    if (tx.hash) {
      dispatch(setTxHash(tx.hash));
      dispatch(setIsShowTxPendingPopup(true));
    }
    if (isContractWallet) {
      return true;
    }
    const receipt = await tx.wait();
    if (receipt.blockHash) {
      const event: boolean = receipt.hasOwnProperty('events');
      if (event) {
        if (!getterTransactionState) {
          await dispatch(refreshOperatorsAndClusters());
          return true;
        }
        return await executeAfterEvent({ updatedStateGetter: getterTransactionState, prevState, callBack: () => dispatch(refreshOperatorsAndClusters()), txHash: tx.hash });
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (e: any) {
    dispatch(setMessageAndSeverity({ message: e.message || translations.DEFAULT.DEFAULT_ERROR_MESSAGE, severity: 'error' }));
    dispatch(setIsLoading(false));
    return false;
  } finally {
    if (!isContractWallet) {
      dispatch(setIsLoading(false));
      dispatch(setIsShowTxPendingPopup(false));
    }
  }
};
