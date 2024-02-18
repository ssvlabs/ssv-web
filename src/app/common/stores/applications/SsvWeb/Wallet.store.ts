import { ConnectedChain, WalletState } from '@web3-onboard/core';
import { action, computed, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import ApiParams from '~lib/api/ApiParams';
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
import { getStoredNetwork } from '~root/providers/networkInfo.provider';

class WalletStore extends BaseStore implements Wallet {
  wallet: any = null;
  accountAddress: string = '';
  wrongNetwork: boolean = false;
  networkId: number = 1;
  private ssvStore: SsvStore = this.getStore('SSV');
  private operatorStore: OperatorStore = this.getStore('Operator');

  constructor() {
    super();
    makeObservable(this, {
      wallet: observable,
      networkId: observable,
      resetUser: action.bound,
      isWrongNetwork: computed,
      wrongNetwork: observable,
      accountAddress: observable,
      initWallet: action.bound,
      initializeUserInfo: action.bound,
    });
  }

  async initWallet(wallet: WalletState | null, connectedChain: ConnectedChain | null) {
    if (wallet && connectedChain) {
      console.warn('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< initWallet', wallet, connectedChain);
      this.wallet = wallet;
      notifyService.init(connectedChain.id);
      // TODO: review this
      await this.initializeUserInfo();
      const myAccountStore: MyAccountStore = this.getStore('MyAccount');
      const operatorStore: OperatorStore = this.getStore('Operator');
      this.ssvStore.clearSettings();
      myAccountStore.clearIntervals();
      initContracts({ network: getStoredNetwork() });
      this.accountAddress = wallet.accounts[0]?.address;
      ApiParams.cleanStorage();
      await Promise.all([
        myAccountStore.getOwnerAddressOperators({}),
        myAccountStore.getOwnerAddressClusters({}),
        operatorStore.updateOperatorValidatorsLimit(),
      ]);
      if (myAccountStore?.ownerAddressClusters?.length) {
        store.dispatch(setStrategyRedirect(config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD));
      } else if (myAccountStore?.ownerAddressOperators?.length) {
        store.dispatch(setStrategyRedirect(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD));
      } else {
        store.dispatch(setStrategyRedirect(config.routes.SSV.ROOT));
      }
      if (!myAccountStore?.ownerAddressOperators?.length || !myAccountStore?.ownerAddressClusters?.length) myAccountStore.forceBigList = true;
      myAccountStore.setIntervals();
    } else {
      await this.resetUser();
    }
  }

  /**
   * Initialize Account data from contract
   */
  async initializeUserInfo() {
    await this.ssvStore.initUser();
    await this.operatorStore.initUser();
  }

  async resetUser() {
    this.ssvStore.clearUserSyncInterval();
    const myAccountStore: MyAccountStore = this.getStore('MyAccount');
    this.accountAddress = '';
    this.wallet = null;
    this.ssvStore.clearSettings();
    this.operatorStore.clearSettings();
    myAccountStore.clearIntervals();
    removeFromLocalStorageByKey('params');
    store.dispatch(setStrategyRedirect(config.routes.SSV.ROOT));
  }

  /**
   * User Network handler
   * @param networkId
   * @param apiVersion
   */
  setNetwork(networkId: number, apiVersion?: string) {
    // TODO: move this out to listener
    // if (notIncludeMainnet && networkId !== undefined && !inNetworks(networkId, testNets)) {
    //   this.wrongNetwork = true;
    //   this.notificationsStore.showMessage('Please change network to Holesky', 'error');
    // }
  }

  get isWrongNetwork(): boolean {
    return this.wrongNetwork;
  }
}

export default WalletStore;
