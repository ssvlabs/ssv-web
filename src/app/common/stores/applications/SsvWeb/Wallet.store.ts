import Notify from 'bnc-notify';
import { ConnectedChain, WalletState } from '@web3-onboard/core';
import { action, computed, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import ApiParams from '~lib/api/ApiParams';
import BaseStore from '~app/common/stores/BaseStore';
import Wallet from '~app/common/stores/Abstracts/Wallet';
import Application from '~app/common/stores/Abstracts/Application';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';

class WalletStore extends BaseStore implements Wallet {
  wallet: any = null;
  notifySdk: any = null;
  onboardSdk: any = null;
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
      notifySdk: observable,
      onboardSdk: observable,
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
      const notifyOptions = {
        networkId: Number(connectedChain.id),
        dappId: config.ONBOARD.API_KEY,
        desktopPosition: 'topRight',
      };
      // @ts-ignore
      this.notifySdk = Notify(notifyOptions);
      // TODO: review this
      await this.initializeUserInfo();
      const applicationStore: Application = this.getStore('Application');
      const myAccountStore: MyAccountStore = this.getStore('MyAccount');
      this.ssvStore.clearSettings();
      myAccountStore.clearIntervals();
      this.accountAddress = wallet.accounts[0]?.address;
      ApiParams.cleanStorage();
      await Promise.all([
        myAccountStore.getOwnerAddressOperators({}),
        myAccountStore.getOwnerAddressClusters({}),
      ]);
      if (myAccountStore?.ownerAddressClusters?.length) {
        applicationStore.strategyRedirect = config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD;
      } else if (myAccountStore?.ownerAddressOperators?.length) {
        applicationStore.strategyRedirect = config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD;
      } else {
        applicationStore.strategyRedirect = config.routes.SSV.ROOT;
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
    const applicationStore: Application = this.getStore('Application');
    this.accountAddress = '';
    this.wallet = null;
    this.ssvStore.clearSettings();
    this.ssvStore.clearUserSyncInterval();
    this.operatorStore.clearSettings();
    myAccountStore.clearIntervals();
    window.localStorage.removeItem('params');
    window.localStorage.removeItem('selectedWallet');
    applicationStore.strategyRedirect = config.routes.SSV.ROOT;
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
