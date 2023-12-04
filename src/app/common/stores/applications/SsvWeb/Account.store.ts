import { Contract } from 'ethers';
import { observable, makeObservable } from 'mobx';
import Account from '~lib/api/Account';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';

class AccountStore extends BaseStore {
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
      const applicationStore: ApplicationStore = this.getStore('Application');
      const notificationsStore: NotificationsStore = this.getStore('Notifications');
      const walletStore: WalletStore = this.getStore('Wallet');
      const contract: Contract = walletStore.setterContract;
      try {
        const tx = await contract.setFeeRecipientAddress(feeRecipient);
        if (tx.hash) {
          applicationStore.txHash = tx.hash;
          applicationStore.showTransactionPendingPopUp(true);
        }
        const receipt = await tx.wait();
        if (receipt.blockHash) {
          console.log('in resolve');
          this.recipientAddress = feeRecipient;
          applicationStore.showTransactionPendingPopUp(false);
          resolve(true);
        }
      } catch (e: any) {
        console.error(`Error during setting fee recipient: ${e.message}`);
        notificationsStore.showMessage(e.message, 'error');
        resolve(false);
      }
    });
  }

  async getFeeRecipientAddress(ownerAddress: string) {
    const result: any = await new Promise(resolve => {
      const res = Account.getInstance().getAccountData(ownerAddress);
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
      const res = Account.getInstance().getAccountData(ownerAddress);
      resolve(res);
    });
    if (result.data) {
      this.ownerNonce = Number(result.data.nonce);
    }
  }
}

export default AccountStore;
