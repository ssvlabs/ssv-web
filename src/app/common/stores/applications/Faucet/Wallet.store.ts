import Web3 from 'web3';
import axios from 'axios';
import Notify from 'bnc-notify';
import Onboard from 'bnc-onboard';
import { Contract } from 'web3-eth-contract';
import { action, computed, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import Wallet from '~app/common/stores/Abstracts/Wallet';
import { wallets } from '~app/common/stores/utilis/wallets';
import Application from '~app/common/stores/Abstracts/Application';
import FaucetStore from '~app/common/stores/applications/Faucet/Faucet.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';

class WalletStore extends BaseStore implements Wallet {
  web3: any = null;
  wallet: any = null;
  ssvBalance: any = 0;
  notifySdk: any = null;
  onboardSdk: any = null;
  accountAddress: string = '';
  wrongNetwork: boolean = false;
  networkId: number | null = null;
  accountDataLoaded: boolean = false;

  private contract: Contract | undefined;
  private faucetStore: FaucetStore = this.getStore('Faucet');
  private notificationsStore: NotificationsStore = this.getStore('Notifications');

  constructor() {
    super();

    makeObservable(this, {
      web3: observable,
      wallet: observable,
      toWei: action.bound,
      connected: computed,
      notifySdk: observable,
      connect: action.bound,
      fromWei: action.bound,
      networkId: observable,
      onboardSdk: observable,
      ssvBalance: observable,
      encodeKey: action.bound,
      decodeKey: action.bound,
      isWrongNetwork: computed,
      wrongNetwork: observable,
      getterContract: computed,
      accountAddress: observable,
      walletHandler: action.bound,
      networkHandler: action.bound,
      addressHandler: action.bound,
      accountDataLoaded: observable,
      initWalletHooks: action.bound,
      initializeUserInfo: action.bound,
      setAccountDataLoaded: action.bound,
      connectWalletFromCache: action.bound,
    });
    this.initWalletHooks();
  }

  BN(s: any) {
    return new this.web3.utils.BN(s);
  }

  /**
   * Initialize SDK
   * @url https://docs.blocknative.com/onboard#initialization
   */
  initWalletHooks() {
    this.faucetStore;
    if (this.onboardSdk) return;
    const connectionConfig = {
      dappId: config.ONBOARD.API_KEY,
      networkId: 5,
      walletSelect: {
        wallets,
      },
      subscriptions: {
        wallet: this.walletHandler,
        address: this.addressHandler,
        network: this.networkHandler,
      },
    };
    console.debug('OnBoard SDK Config:', connectionConfig);
    this.onboardSdk = Onboard(connectionConfig);
    const notifyOptions = {
      dappId: config.ONBOARD.API_KEY,
      networkId: 5,
      desktopPosition: 'topRight',
    };
    // @ts-ignore
    this.notifySdk = Notify(notifyOptions);
  }

  /**
   * Initialize Account data from contract
   */
  async initializeUserInfo() {
    try {
      const applicationStore: Application = this.getStore('Application');
      const faucetStore: FaucetStore = this.getStore('Faucet');
      const faucetUrl = `${config.links.SSV_API_ENDPOINT}/faucet/config`;
      const response = (await axios.get(faucetUrl)).data;
      faucetStore.amountToTransfer = response[0].amount_to_transfer;
      // eslint-disable-next-line no-constant-condition
      applicationStore.strategyRedirect = response[0].transactions_capacity > 0 ? config.routes.FAUCET.ROOT : config.routes.FAUCET.DEPLETED;
    } catch {
      console.log('[ERROR]: fail to fetch faucet config');
    }
  }

  fromWei(amount?: string): number {
    if (!amount) return 0;
    return this.web3.utils.fromWei(amount, 'ether');
  }

  toWei(amount?: number): string {
    if (!amount) return '0';
    return this.web3.utils.toWei(amount.toString(), 'ether');
  }

  /**
   * Check wallet cache and connect
   */
  async connectWalletFromCache() {
    const selectedWallet: string | null = window.localStorage.getItem('selectedWallet');
    if (selectedWallet && selectedWallet !== 'undefined') {
      await this.onboardSdk.walletSelect(selectedWallet);
      await this.onboardSdk.walletCheck();
    } else {
      this.setAccountDataLoaded(true);
    }
  }

  /**
   * Connect wallet
   */
  async connect() {
    try {
      console.debug('Connecting wallet..');
      await this.onboardSdk.walletSelect();
      await this.onboardSdk.walletCheck();
    } catch (error: any) {
      const message = error.message ?? 'Unknown errorMessage during connecting to wallet';
      this.notificationsStore.showMessage(message, 'error');
      console.error('Connecting to wallet error:', message);
      return false;
    }
  }

  /**
   * User address handler
   * @param address: string
   */
  async addressHandler(address: string) {
    this.setAccountDataLoaded(false);
    if (address === undefined) {
      window.localStorage.removeItem('selectedWallet');
    } else {
      this.accountAddress = address;
      await this.initializeUserInfo();
      // await this.distributionStore.eligibleForReward();
      // await this.distributionStore.checkIfClaimed();
    }
    this.setAccountDataLoaded(true);
  }

  /**
   * Callback for connected wallet
   * @param wallet: any
   */
  async walletHandler(wallet: any) {
    this.wallet = wallet;
    this.web3 = new Web3(wallet.provider);
    console.debug('Wallet Connected:', wallet);
    window.localStorage.setItem('selectedWallet', wallet.name);
  }

  /**
   * User Network handler
   * @param networkId: any
   */
  async networkHandler(networkId: any) {
    console.log('networkId: ', networkId);
    this.networkId = networkId;
    this.wrongNetwork = networkId !== 5 && networkId !== undefined;
    config.links.SSV_API_ENDPOINT = `${process.env.REACT_APP_SSV_API_ENDPOINT}/prater`;
  }

  /**
   * User address handler
   * @param operatorKey: string
   */
  encodeKey(operatorKey?: string) {
    if (!operatorKey) return '';
    return this.web3.eth.abi.encodeParameter('string', operatorKey);
  }

  /**
   * User address handler
   * @param operatorKey: string
   */
  decodeKey(operatorKey?: string) {
    if (!operatorKey) return '';
    return this.web3?.eth.abi.decodeParameter('string', operatorKey);
  }

  /**
   * Set Account loaded
   * @param status: boolean
   */
  setAccountDataLoaded = (status: boolean): void => {
    this.accountDataLoaded = status;
  };

  get connected() {
    return this.accountAddress;
  }

  get isWrongNetwork(): boolean {
    return this.wrongNetwork;
  }

  get getterContract(): Contract {
    if (!this.contract) {
      const abi: any = config.CONTRACTS.SSV_NETWORK.ABI;
      const contractAddress: string = config.CONTRACTS.SSV_NETWORK.ADDRESS;
      this.contract = new this.web3.eth.Contract(abi, contractAddress);
    }
    // @ts-ignore
    return this.contract;
  }
}

export default WalletStore;
