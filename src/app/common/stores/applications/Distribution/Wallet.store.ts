import Web3 from 'web3';
import Notify from 'bnc-notify';
import Onboard from 'bnc-onboard';
import { Contract } from 'web3-eth-contract';
import { action, computed, observable } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import Wallet from '~app/common/stores/Abstracts/Wallet';
import { wallets } from '~app/common/stores/utilis/wallets';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import DistributionStore from '~app/common/stores/applications/Distribution/Distribution.store';

class WalletStore extends BaseStore implements Wallet {
    @observable web3: any = null;
    @observable wallet: any = null;
    @observable ssvBalance: any = 0;
    @observable notifySdk: any = null;
    @observable onboardSdk: any = null;
    @observable accountAddress: string = '';
    @observable wrongNetwork: boolean = false;
    @observable networkId: number | null = null;
    @observable accountDataLoaded: boolean = false;

    private contract: Contract | undefined;
    private distributionStore: DistributionStore = this.getStore('Distribution');
    private notificationsStore: NotificationsStore = this.getStore('Notifications');

    constructor() {
        super();
        this.initWalletHooks();
    }

    /**
   * Initialize SDK
   * @url https://docs.blocknative.com/onboard#initialization
   */
  @action.bound
  initWalletHooks() {
    if (this.onboardSdk) return;
    const connectionConfig = {
      dappId: config.ONBOARD.API_KEY,
      networkId: 1,
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
      networkId: 1,
      desktopPosition: 'topRight',
    };
    // @ts-ignore
    this.notifySdk = Notify(notifyOptions);
  }

  /**
   * Initialize Account data from contract
   */
  @action.bound
  async initializeUserInfo() {

  }

  /**
   * Check wallet cache and connect
   */
  @action.bound
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
  @action.bound
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
    @action.bound
    async addressHandler(address: string) {
        this.setAccountDataLoaded(false);
        if (address === undefined) {
            window.localStorage.removeItem('selectedWallet');
        } else {
            this.accountAddress = address;
            await this.distributionStore.eligibleForReward();
            await this.distributionStore.checkIfClaimed();
        }
        this.setAccountDataLoaded(true);
    }

  /**
   * Callback for connected wallet
   * @param wallet: any
   */
  @action.bound
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
  @action.bound
  async networkHandler(networkId: any) {
    console.log('networkId: ', networkId);
    this.wrongNetwork = networkId !== 1 && networkId !== undefined;
  }

  /**
   * User address handler
   * @param operatorKey: string
   */
  @action.bound
  encodeKey(operatorKey?: string) {
    if (!operatorKey) return '';
    return this.web3.eth.abi.encodeParameter('string', operatorKey);
  }

  /**
   * User address handler
   * @param operatorKey: string
   */
  @action.bound
  decodeKey(operatorKey?: string) {
    if (!operatorKey) return '';
    return this.web3?.eth.abi.decodeParameter('string', operatorKey);
  }

  /**
   * Set Account loaded
   * @param status: boolean
   */
  @action.bound
  setAccountDataLoaded = (status: boolean): void => {
    this.accountDataLoaded = status;
  };

  @computed
  get connected() {
    return this.accountAddress;
  }

  @computed
  get isWrongNetwork(): boolean {
    return this.wrongNetwork;
  }

  @computed
  get getContract(): Contract {
    if (!this.contract) {
      const abi: any = process.env.REACT_APP_NEW_STAGE ? config.CONTRACTS.SSV_NETWORK.ABI : config.CONTRACTS.SSV_NETWORK.OLD_ABI;
      const contractAddress: string = config.CONTRACTS.SSV_NETWORK.ADDRESS;
      this.contract = new this.web3.eth.Contract(abi, contractAddress);
    }
    // @ts-ignore
    return this.contract;
  }
}

export default WalletStore;
