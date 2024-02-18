import { observable, makeObservable } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';
import { EContractName } from '~app/model/contracts.model';
import { getContractByName } from '~root/services/contracts.service';
import { store } from '~app/store';
import { setIsShowTxPendingPopup, setTxHash } from '~app/redux/appState.slice';
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
          store.dispatch(setTxHash(tx.hash));
          store.dispatch(setIsShowTxPendingPopup(true));
        }
        const receipt = await tx.wait();
        if (receipt.blockHash) {
          console.log('in resolve');
          this.recipientAddress = feeRecipient;
          store.dispatch(setIsShowTxPendingPopup(false));
          resolve(true);
        }
      } catch (e: any) {
        console.error(`Error during setting fee recipient: ${e.message}`);
        resolve(false);
      }
    });
    // return new Promise<boolean>(async (resolve) => {
    //   const applicationStore: ApplicationStore = this.getStore('Application');
    //   const walletStore: WalletStore = this.getStore('Wallet');
    //   const contract: Contract = walletStore.setterContract;
    //   try {
    //     await contract.methods.setFeeRecipientAddress(feeRecipient).send({ from: walletStore.accountAddress })
    //       .on('receipt', async (receipt: any) => {
    //         console.log(receipt);
    //         this.recipientAddress = feeRecipient;
    //         resolve(true);
    //       })
    //       .on('transactionHash', (txHash: string) => {
    //         applicationStore.txHash = txHash;
    //         notifyService.hash(tx.hash);
    //       })
    //       .on('error', (error: any) => {
    //         console.debug('Contract Error', error.message);
    //         applicationStore.setIsLoading(false);
    //         resolve(false);
    //       });
    //   } catch (e: any) {
    //     console.error(`Error during setting fee recipient: ${e.message}`);
    //     resolve(false);
    //   }
    // });
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
