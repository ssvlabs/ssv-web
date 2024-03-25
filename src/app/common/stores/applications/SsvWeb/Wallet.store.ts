import { ConnectedChain, WalletState } from '@web3-onboard/core';
import { action, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import Wallet from '~app/common/stores/Abstracts/Wallet';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import { removeFromLocalStorageByKey } from '~root/providers/localStorage.provider';
import { store } from '~app/store';
import { setStrategyRedirect } from '~app/redux/navigation.slice';
import notifyService from '~root/services/notify.service';
import { initContracts } from '~root/services/contracts.service';
import { getNetworkInfoIndexByNetworkId, getStoredNetwork } from '~root/providers/networkInfo.provider';
import { checkIfWalletIsContract } from '~root/services/wallet.service';
import { getLocalStorageFlagValue, TEST_WALLET_ADDRESS } from '~lib/utils/developerHelper';
import { setConnectedNetwork } from '~app/redux/wallet.slice';

class WalletStore extends BaseStore implements Wallet {
  wallet: any = null;
  accountAddress: string = '';
  isContractWallet: boolean = false;
  isNotMetamask = false;
  private ssvStore: SsvStore = this.getStore('SSV');
  private operatorStore: OperatorStore = this.getStore('Operator');
  private myAccountStore: MyAccountStore = this.getStore('MyAccount');

  constructor() {
    super();
    makeObservable(this, {
      wallet: observable,
      resetUser: action.bound,
      accountAddress: observable,
      isContractWallet: observable,
      isNotMetamask: observable,
      initWallet: action.bound,
    });
  }

  async initWallet(wallet: WalletState, connectedChain: ConnectedChain) {
    await this.resetUser();
    console.warn('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< initWallet', wallet, connectedChain);
    this.wallet = wallet;
    const checkedWallet = window.localStorage.getItem(TEST_WALLET_ADDRESS);
    this.accountAddress = checkedWallet || wallet.accounts[0].address;
    notifyService.init(connectedChain.id);
    const index = getNetworkInfoIndexByNetworkId(Number(connectedChain.id));
    store.dispatch(setConnectedNetwork(index));
    this.isNotMetamask = wallet.label !== 'MetaMask';
    initContracts({ provider: wallet.provider, network: getStoredNetwork(), shouldUseRpcUrl: this.isNotMetamask });
    this.isContractWallet = this.isNotMetamask && await checkIfWalletIsContract({ provider: wallet.provider, walletAddress: wallet.accounts[0].address });
    await this.ssvStore.initUser();
    await this.operatorStore.initUser();
    this.myAccountStore.setIntervals();
    await Promise.all([
      this.myAccountStore.getOwnerAddressOperators({}),
      this.myAccountStore.getOwnerAddressClusters({}),
      this.operatorStore.updateOperatorValidatorsLimit(),
    ]);
    if (this.myAccountStore?.ownerAddressClusters?.length) {
      store.dispatch(setStrategyRedirect(config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD));
    } else if (this.myAccountStore?.ownerAddressOperators?.length) {
      store.dispatch(setStrategyRedirect(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD));
    } else {
      store.dispatch(setStrategyRedirect(config.routes.SSV.ROOT));
    }
    if (!this.myAccountStore?.ownerAddressOperators?.length || !this.myAccountStore?.ownerAddressClusters?.length) this.myAccountStore.forceBigList = true;
  }

  async resetUser() {
    this.ssvStore.clearUserSyncInterval();
    this.myAccountStore.clearIntervals();
    this.accountAddress = '';
    this.wallet = null;
    this.ssvStore.clearSettings();
    this.operatorStore.clearSettings();
    removeFromLocalStorageByKey('params');
    store.dispatch(setStrategyRedirect(config.routes.SSV.ROOT));
  }
}

export default WalletStore;
