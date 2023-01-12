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
    // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
    super();

    makeObservable(this, {
      notifySdk: observable,
      web3: observable,
      wallet: observable,
      ssvBalance: observable,
      onboardSdk: observable,
      ready: observable,
      accountAddress: observable,
      wrongNetwork: observable,
      networkId: observable,
      isAccountLoaded: observable,
      accountDataLoaded: observable,
      initWalletHooks: action.bound,
      initializeUserInfo: action.bound,
      fromWei: action.bound,
      toWei: action.bound,
      buildContract: action.bound,
      encodeKey: action.bound,
      decodeKey: action.bound,
      clean: action.bound,
      disconnect: action.bound,
      connect: action.bound,
      connected: computed,
      selectWalletAndCheckIfReady: action.bound,
      connectWalletFromCache: action.bound,
      setAccountLoaded: action.bound,
      isWrongNetwork: computed,
      getContract: computed,
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

  buildContract(address: string) {
    const abi: any = config.CONTRACTS.SSV_NETWORK.ABI;
    return new this.web3.eth.Contract(abi, address);
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
  get getContract(): Contract {
    if (!this.contract && this.connected) {
      const contractAddress: string = config.CONTRACTS.SSV_NETWORK.ADDRESS;
      this.contract = this.buildContract(contractAddress);
    }
    // @ts-ignore
    return this.contract;
  }
}

export default WalletTestStore;
