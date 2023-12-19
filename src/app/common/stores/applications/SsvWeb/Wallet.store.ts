import Notify from 'bnc-notify';
import { Contract, ethers } from 'ethers';
import { ConnectedChain, WalletState } from '@web3-onboard/core';
import { action, computed, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import ApiParams from '~lib/api/ApiParams';
import BaseStore from '~app/common/stores/BaseStore';
import Application from '~app/common/stores/Abstracts/Application';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
// import Wallet, { WALLET_CONNECTED } from '~app/common/stores/Abstracts/Wallet';
import Wallet from '~app/common/stores/Abstracts/Wallet';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import {
  changeCurrentNetwork,
  getCurrentNetwork,
  inNetworks,
  notIncludeMainnet, testNets, TOKEN_NAMES,
} from '~lib/utils/envHelper';
import { decodeParameter, encodeParameter } from '~root/services/conversions.service';

class WalletStore extends BaseStore implements Wallet {
  web3: any = null;
  wallet: any = null;
  notifySdk: any = null;
  onboardSdk: any = null;
  accountAddress: string = '';
  wrongNetwork: boolean = false;
  networkId: number = 1;
  private viewContract: Contract | undefined;
  private networkContract: Contract | undefined;
  private ssvStore: SsvStore = this.getStore('SSV');
  private operatorStore: OperatorStore = this.getStore('Operator');
  private notificationsStore: NotificationsStore = this.getStore('Notifications');
  private initializingUserInfo: number = 0;

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
      onNetworkChangeCallback: action.bound,
      onAccountAddressChangeCallback: action.bound,
    });
  }

  BN(s: any) {
    return new this.web3.utils.BN(s);
  }

  async initWallet(wallet: WalletState | null, connectedChain: ConnectedChain | null) {
    if (wallet && connectedChain) {
      console.warn('<<<<<<<<<<<<<<<<< initiating wallet >>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      const networkId = parseInt(String(connectedChain.id), 16);
      const balance = wallet.accounts[0]?.balance ? wallet.accounts[0]?.balance[TOKEN_NAMES[networkId]] : undefined;
      const address = wallet.accounts[0]?.address;
      this.wallet = wallet;
      // this.web3 = new Web3(wallet.provider);
      this.onNetworkChangeCallback(networkId);
      // await this.onBalanceChangeCallback(balance);
      await this.onAccountAddressChangeCallback(address);
      const notifyOptions = {
        networkId,
        dappId: config.ONBOARD.API_KEY,
        desktopPosition: 'topRight',
      };
      // @ts-ignore
      this.notifySdk = Notify(notifyOptions);
    } else {
      await this.onAccountAddressChangeCallback(undefined);
    }
  }

  /**
   * Initialize Account data from contract
   */
  async initializeUserInfo() {
    // if (this.initializingUserInfo > 0) {
    //   this.initializingUserInfo++;
    //   return;
    // }
    // this.initializingUserInfo++;
    // try {
    //   // await this.operatorStore.validatorsPerOperatorLimit();
    //   await this.ssvStore.initUser();
    //   await this.operatorStore.initUser();
    // } catch (e: any) {
    //   console.log(e.message);
    // } finally {
    //   this.initializingUserInfo--;
    //   if (this.initializingUserInfo > 0) {
    //     await new Promise((resolve) => setTimeout(resolve, 1000));
    //     await this.initializeUserInfo();
    //   }
    // }
    await this.ssvStore.initUser();
    await this.operatorStore.initUser();
  }

  /**
   * Connect wallet
   */
  async connect() {
    return;
    // try {
    //   console.debug('Connecting wallet..');
    //   // await this.disconnect();
    //   // cleanLocalStorage();
    //   if (this.wallet) {
    //     return;
    //   }
    //   const result = await this.onboardSdk.connectWallet();
    //   console.warn({
    //     result,
    //     onboardSdk: this.onboardSdk,
    //   });
    //   if (result?.length > 0) {
    //     const networkId = result[0].chains[0].id;
    //     let balance = 0;
    //     try {
    //       balance = result[0].accounts[0]?.balance[TOKEN_NAMES[networkId]];
    //     } catch (e) {
    //       balance = 0;
    //     }
    //     const wallet = result[0];
    //     const address = result[0].accounts[0].address;
    //     await this.onWalletConnectedCallback(wallet);
    //     this.onNetworkChangeCallback(Number(networkId));
    //     await this.onBalanceChangeCallback(balance || 0);
    //     await this.onAccountAddressChangeCallback(address);
    //   }
    // } catch (error: any) {
    //   const message = error.message ?? 'Unknown errorMessage during connecting to wallet';
    //   this.notificationsStore.showMessage(message, 'error');
    //   console.error('Connecting to wallet error:', error);
    //   return false;
    // }
  }

  /**
   * User address handler
   * @param address
   */
  async onAccountAddressChangeCallback(address: string | undefined) {
    const applicationStore: Application = this.getStore('Application');
    const myAccountStore: MyAccountStore = this.getStore('MyAccount');
    const ssvStore: SsvStore = this.getStore('SSV');
    // window.localStorage.setItem(WALLET_CONNECTED, JSON.stringify(!!address));
    if (address === undefined || !this.wallet?.label) {
      console.warn('onAccountAddressChangeCallback: Wallet disconnected');
      ssvStore.clearUserSyncInterval();
      await this.resetUser();
    } else {
      console.warn('onAccountAddressChangeCallback: Wallet connected');
      this.ssvStore.clearSettings();
      myAccountStore.clearIntervals();
      this.accountAddress = address;
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
    }
  }

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

  /**
   * Fetch user balances and fees
   */
  async onBalanceChangeCallback(balance: any) {
    // if (balance) await this.initializeUserInfo();
  }

  /**
   * User Network handler
   * @param networkId
   * @param apiVersion
   */
  onNetworkChangeCallback(networkId: number, apiVersion?: string) {
    if (notIncludeMainnet && networkId !== undefined && !inNetworks(networkId, testNets)) {
      this.wrongNetwork = true;
      this.notificationsStore.showMessage('Please change network to Holesky', 'error');
    } else {
      try {
        changeCurrentNetwork(Number(networkId), apiVersion);
      } catch (e) {
        this.wrongNetwork = true;
        this.notificationsStore.showMessage(String(e), 'error');
        return;
      }
      config.links.SSV_API_ENDPOINT = getCurrentNetwork().api;
      this.wrongNetwork = false;
      this.networkId = networkId;
    }
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
