import { action, makeObservable, observable } from 'mobx';
import { ConnectedChain, WalletState } from '@web3-onboard/core';
import BaseStore from '~app/common/stores/BaseStore';
import Wallet from '~app/common/stores/Abstracts/Wallet';
import { distributionHelper } from '~lib/utils/distributionHelper';
import DistributionStore from '~app/common/stores/applications/Distribution/Distribution.store';
import DistributionTestnetStore from '~app/common/stores/applications/Distribution/DistributionTestnet.store';
import notifyService from '~root/services/notify.service';

class WalletStore extends BaseStore implements Wallet {
  wallet: any = null;
  ssvBalance: any = 0;
  accountAddress: string = '';

  private distributionStore: DistributionStore | DistributionTestnetStore | null = null;

  constructor() {
    super();

    makeObservable(this, {
      wallet: observable,
      ssvBalance: observable,
      accountAddress: observable,
      initWallet: action.bound,
    });
  }

  /**
   * Initialize SDK
   * @url https://docs.blocknative.com/onboard#initialization
   */
  async initWallet(wallet: WalletState, connectedChain: ConnectedChain) {
    // TODO: refactor
    if (wallet && connectedChain) {
      const networkId = parseInt(String(connectedChain.id), 16);
      const { storeName } = distributionHelper(networkId);
      this.distributionStore = this.getStore(storeName);
      const address = wallet?.accounts[0]?.address;
      if (address === undefined) {
        this.accountAddress = '';
      } else {
        this.accountAddress = address;
        if (this.distributionStore) {
          await this.distributionStore.eligibleForReward();
          if (this.distributionStore instanceof DistributionTestnetStore && this.distributionStore.checkIfClaimed) {
            await this.distributionStore.checkIfClaimed();
          }
        }
      }
      notifyService.init(connectedChain.id);
    }
  }
}

export default WalletStore;
