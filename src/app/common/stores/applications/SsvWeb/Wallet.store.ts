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
import { decodeParameter, encodeParameter } from '~root/services/conversions.service';

class WalletStore extends BaseStore implements Wallet {
  web3: any = null;
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
      web3: observable,
      wallet: observable,
      connected: computed,
      networkId: observable,
      notifySdk: observable,
      connect: action.bound,
      onboardSdk: observable,
      decodeKey: action.bound,
      resetUser: action.bound,
      encodeKey: action.bound,
      isWrongNetwork: computed,
      wrongNetwork: observable,
      accountAddress: observable,
      initWallet: action.bound,
      initializeUserInfo: action.bound,
      onBalanceChangeCallback: action.bound,
      onAccountAddressChangeCallback: action.bound,
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
      // TODO: what with this?
      // await this.onAccountAddressChangeCallback(wallet.accounts[0]?.address);
      const applicationStore: Application = this.getStore('Application');
      const myAccountStore: MyAccountStore = this.getStore('MyAccount');
      // window.localStorage.setItem(WALLET_CONNECTED, JSON.stringify(!!address));
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
      this.ssvStore.clearUserSyncInterval();
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

  // TODO: delete
  async connect() {
    return;
  }

  /**
   * User address handler
   * @param address
   */
  async onAccountAddressChangeCallback(address: string) {}

  async resetUser() {
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

  // TODO: delete
  async onBalanceChangeCallback(balance: any) {
    // if (balance) await this.initializeUserInfo();
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

  /**
   * encode key
   * @param key
   */
  encodeKey(key?: string) {
    if (!key) return '';
    return encodeParameter('string', key);
  }

  /**
   * decode key
   * @param key
   */
  decodeKey(key?: string) {
    if (!key) return '';
    return decodeParameter('string', key);
  }

  get connected() {
    return this.accountAddress;
  }

  get isWrongNetwork(): boolean {
    return this.wrongNetwork;
  }
}

export default WalletStore;
