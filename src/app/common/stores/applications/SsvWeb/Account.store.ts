import { Contract } from 'web3-eth-contract';
import { observable, makeObservable } from 'mobx';
import { getAccountData } from '~lib/api/account.service';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';

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
      const applicationStore: ApplicationStore = this.getStore('Application');
      const walletStore: WalletStore = this.getStore('Wallet');
      const contract: Contract = walletStore.setterContract;
      try {
        await contract.methods.setFeeRecipientAddress(feeRecipient).send({ from: walletStore.accountAddress })
          .on('receipt', async (receipt: any) => {
            console.log(receipt);
            this.recipientAddress = feeRecipient;
            resolve(true);
          })
          .on('transactionHash', (txHash: string) => {
            applicationStore.txHash = txHash;
            walletStore.notifySdk.hash(txHash);
          })
          .on('error', (error: any) => {
            console.debug('Contract Error', error.message);
            applicationStore.setIsLoading(false);
            resolve(false);
          });
      } catch (e: any) {
        console.error(`Error during setting fee recipient: ${e.message}`);
        resolve(false);
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
    if (result.data) {
      this.ownerNonce = Number(result.data.nonce);
    }
  }
}

export default AccountStore;
