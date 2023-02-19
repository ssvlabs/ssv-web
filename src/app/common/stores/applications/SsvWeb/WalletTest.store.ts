import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { action, computed, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import Wallet from '~app/common/stores/Abstracts/Wallet';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';

class WalletTestStore extends BaseStore implements Wallet {
  private contract: Contract | undefined;

  notifySdk: any;
  web3: any = null;
  wallet: any = null;
  ssvBalance: number = 0;
  onboardSdk: any = null;
  ready: boolean = false;
  accountAddress: string = '';
  wrongNetwork: boolean = false;
  networkId: number | null = null;
  isAccountLoaded: boolean = false;
  accountDataLoaded: boolean = true;

  constructor() {
    super();

    makeObservable(this, {
      web3: observable,
      ready: observable,
      wallet: observable,
      toWei: action.bound,
      clean: action.bound,
      connected: computed,
      networkId: observable,
      fromWei: action.bound,
      notifySdk: observable,
      connect: action.bound,
      ssvBalance: observable,
      onboardSdk: observable,
      encodeKey: action.bound,
      decodeKey: action.bound,
      isWrongNetwork: computed,
      setterContract: computed,
      getterContract: computed,
      disconnect: action.bound,
      wrongNetwork: observable,
      accountAddress: observable,
      isAccountLoaded: observable,
      accountDataLoaded: observable,
      initWalletHooks: action.bound,
      setAccountLoaded: action.bound,
      initializeUserInfo: action.bound,
      connectWalletFromCache: action.bound,
      selectWalletAndCheckIfReady: action.bound,
    });
  }

  BN(s: any) {
    return new this.web3.utils.BN(s);
  }

  initWalletHooks(): void {
  }

  initializeUserInfo(): void {
  }

  fromWei(amount?: string): number {
    if (!amount) return 0;
    return this.web3?.utils.fromWei(amount, 'ether');
  }

  toWei(amount?: number): string {
    if (!amount) return '0';
    return this.web3?.utils.toWei(amount.toString(), 'ether');
  }

  encodeKey(operatorKey?: string) {
    return this.web3.eth.abi.encodeParameter('string', operatorKey);
  }

  decodeKey(operatorKey?: string) {
    return this.web3.eth.abi.decodeParameter('string', operatorKey);
  }

  clean() {
    this.accountAddress = '';
  }

  async disconnect() {
    if (this.connected) {
      this.accountAddress = '';
    }
  }

  async connect() {
    try {
      console.debug('Connecting wallet..');
      await this.selectWalletAndCheckIfReady();
    } catch (error: any) {
      const message = error.message ?? 'Unknown errorMessage during connecting to wallet';
      const notificationsStore: NotificationsStore = this.getStore('Notifications');
      notificationsStore.showMessage(message, 'error');
      console.error('Connecting to wallet error:', message);
    }
  }

  get connected() {
    return this.accountAddress;
  }

  /**
   * Check wallet is ready to transact
   */
  async selectWalletAndCheckIfReady() {
    if (this.connected) {
      return;
    }
    this.web3 = new Web3('ws://localhost:8545');
    const accounts = await this.web3.eth.getAccounts();
    this.accountAddress = accounts[0];
  }

  /**
   * Returns true if wallet is ready
   * Otherwise returns false
   */
  checkIfWalletReady() {
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    if (!this.connected) {
      notificationsStore.showMessage('Please connect your wallet', 'error');
      return false;
    }
    return true;
  }

  /**
   * Check wallet cache and connect
   */
  async connectWalletFromCache() {
    const selectedWallet: string | null = window.localStorage.getItem('selectedWallet');
    if (selectedWallet) {
      await this.onboardSdk.walletSelect(selectedWallet);
      await this.onboardSdk.walletCheck();
    } else {
      this.setAccountLoaded(true);
    }
  }

  setAccountLoaded = (status: boolean): void => {
    this.isAccountLoaded = status;
  };

  get isWrongNetwork(): boolean {
    return this.wrongNetwork;
  }

  /**
   * Get smart contract instance
   */
  get getterContract(): Contract {
    if (!this.contract) {
      const abi: any = config.CONTRACTS.SSV_NETWORK.ABI;
      const contractAddress: string = config.CONTRACTS.SSV_NETWORK.ADDRESS;
      this.contract = new this.web3.eth.Contract(abi, contractAddress);
    }
    // @ts-ignore
    return this.contract;
  }

  get setterContract(): Contract {
    if (!this.contract) {
      const abi: any = config.CONTRACTS.SSV_NETWORK.ABI;
      const contractAddress: string = config.CONTRACTS.SSV_NETWORK.ADDRESS;
      this.contract = new this.web3.eth.Contract(abi, contractAddress);
    }
    // @ts-ignore
    return this.contract;
  }
}

export default WalletTestStore;
