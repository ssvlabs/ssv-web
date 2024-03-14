import { ConnectedChain, WalletState } from '@web3-onboard/core';
import { action, makeObservable, observable } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';
import Wallet from '~app/common/stores/Abstracts/Wallet';
import { isMainnet } from '~root/providers/networkInfo.provider';
import notifyService from '~root/services/notify.service';

class WalletStore extends BaseStore implements Wallet {
  wallet: any = null;
  accountAddress: string = '';
  isWalletConnect = false;

  constructor() {
    super();

    makeObservable(this, {
      wallet: observable,
      accountAddress: observable,
      initWallet: action.bound,
      resetUser: action.bound,
    });
  }

  /**
   * Initialize SDK
   * @url https://docs.blocknative.com/onboard#initialization
   */
  async initWallet(wallet: WalletState, connectedChain: ConnectedChain) {
    if (wallet && connectedChain) {
      this.wallet = wallet;
      const address = wallet.accounts[0]?.address;
      // TODO: refuse connection if connecting with mainnet
      if (!isMainnet()) {
        // this.wrongNetwork = false;
      } else {
        // this.wrongNetwork = true;
        // this.notificationsStore.showMessage('Please change network', 'error');
      }
      this.accountAddress = address;
      notifyService.init(connectedChain.id);
    }
  }

  resetUser = async () => {};
}

export default WalletStore;
