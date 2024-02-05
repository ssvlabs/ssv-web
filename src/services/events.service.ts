import MyAccountStore from '../app/common/stores/applications/SsvWeb/MyAccount.store';
import ContractEvent from '~lib/api/ContractEvent';

export const ifEventCaught = async (txHash: string, callBack: Function, delay: Function) => {
  let iterations = 0;
  while (iterations <= MyAccountStore.CHECK_UPDATES_MAX_ITERATIONS) {
    const txWasCaught = !!await ContractEvent.getInstance().getEventByTxHash(txHash);
    iterations += 1;
    if (txWasCaught) {
      await callBack();
      iterations = MyAccountStore.CHECK_UPDATES_MAX_ITERATIONS;
    } else {
      console.log('Transaction still not catched...');
    }
    await delay();
  }
  return true;
};
