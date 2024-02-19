import { observable, makeObservable } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';
import { EContractName } from '~app/model/contracts.model';
import { getContractByName } from '~root/services/contracts.service';
import { store } from '~app/store';
import { setIsShowTxPendingPopup, setTxHash } from '~app/redux/appState.slice';
import notifyService from '~root/services/notify.service';
import { getAccountData } from '~root/services/account.service';

class AccountStore extends BaseStore  {
  recipientAddress: string = '';
  ownerNonce: number = 0;

  constructor() {
    super();
    makeObservable(this, {
      recipientAddress: observable,
      ownerNonce: observable,
    });
  }

  async setFeeRecipient(feeRecipient: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const contract = getContractByName(EContractName.SETTER);
      try {
        const tx = await contract.setFeeRecipientAddress(feeRecipient);
        if (tx.hash) {
          notifyService.hash(tx.hash);
          store.dispatch(setTxHash(tx.hash));
          store.dispatch(setIsShowTxPendingPopup(true));
        }
        const receipt = await tx.wait();
        if (receipt.blockHash) {
          this.recipientAddress = feeRecipient;
          resolve(true);
        }
      } catch (e: any) {
        console.error(`Error during setting fee recipient: ${e.message}`);
        resolve(false);
      } finally {
        store.dispatch(setIsShowTxPendingPopup(false));
      }
    });
  }

  async getFeeRecipientAddress(ownerAddress: string) {
    const result: any = await new Promise(resolve => {
      const res = getAccountData(ownerAddress);
      resolve(res);
    });
    if (result.data.recipientAddress) {
      this.recipientAddress = result.data.recipientAddress;
    } else {
      this.recipientAddress = ownerAddress;
    }
  }

  async getOwnerNonce(ownerAddress: string) {
    const result: any = await new Promise(resolve => {
      const res = getAccountData(ownerAddress);
      resolve(res);
    });
    if (result?.data) {
      this.ownerNonce = Number(result.data.nonce);
    }
  }
}

export default AccountStore;
