import Web3 from 'web3';
import Notify from 'bnc-notify';
import Onboard from 'bnc-onboard';
import { Contract } from 'web3-eth-contract';
import { action, computed, observable } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import SsvStore from '~app/common/stores/SSV.store';
import { States } from '~app/common/stores/enums/State';
import { wallets } from '~app/common/stores/Wallet/wallets';
import OperatorStore from '~app/common/stores/Operator.store';
import Wallet from '~app/common/stores/Wallet/abstractWallet';
import ApplicationStore from '~app/common/stores/Application.store';
import DistributionStore from '~app/common/stores/Distribution.store';
import NotificationsStore from '~app/common/stores/Notifications.store';

class WalletStore extends BaseStore implements Wallet {
  @observable web3: any = null;
  @observable wallet: any = null;
  @observable notifySdk: any = null;
  @observable onboardSdk: any = null;
  @observable accountAddress: string = '';
  @observable wrongNetwork: boolean = false;
  @observable networkId: number | null = null;
  @observable walletConnected: boolean = false;
  @observable isAccountLoaded: boolean = false;

  private contract: Contract | undefined;
  private ssvStore: SsvStore = this.getStore('SSV');
  private operatorStore: OperatorStore = this.getStore('Operator');
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
      networkId: this.networkId || Number(config.ONBOARD.NETWORK_ID),
      walletSelect: {
        wallets,
      },
      subscriptions: {
        wallet: this.walletHandler,
        address: this.addressHandler,
        network: this.networkHandler,
        balance: this.balanceHandler,
      },
    };
    console.debug('OnBoard SDK Config:', connectionConfig);
    this.onboardSdk = Onboard(connectionConfig);
    const notifyOptions = {
      dappId: config.ONBOARD.API_KEY,
      networkId: this.networkId || Number(config.ONBOARD.NETWORK_ID),
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
    await this.operatorStore.validatorsPerOperatorLimit();
    if (process.env.REACT_APP_NEW_STAGE) {
      await this.ssvStore.initUser();
    }
  }

  /**
   * Check wallet cache and connect
   */
  @action.bound
  async connectWalletFromCache() {
    const selectedWallet: string | null = window.localStorage.getItem('selectedWallet');
    if (selectedWallet) {
      await this.onboardSdk.walletSelect(selectedWallet);
      await this.onboardSdk.walletCheck();
    } else {
      this.setAccountLoaded(true);
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
  const applicationStore: ApplicationStore = this.getStore('Application');
    if (address === undefined) {
      this.accountAddress = address;
      this.walletConnected = true;
      this.ssvStore.initSettings();
      window.localStorage.removeItem('selectedWallet');
    } else {
      this.accountAddress = address;
      this.walletConnected = true;
      this.setAccountLoaded(false);
      if (applicationStore.isStrategyState(States.distribution)) {
        await this.distributionStore.eligibleForReward();
      } else {
        await this.initializeUserInfo();
      }
      this.setAccountLoaded(true);
    }
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
   * Fetch user balances and fees
   */
  @action.bound
  async balanceHandler() {
    const applicationStore: ApplicationStore = this.getStore('Application');
    if (!process.env.REACT_APP_NEW_STAGE || applicationStore.isStrategyState(States.distribution)) return;
    await this.ssvStore.initUser();
  }

  /**
   * User Network handler
   * @param networkId: any
   */
  @action.bound
  async networkHandler(networkId: any) {
    console.log('networkId: ', networkId);
    if (networkId !== 5 && networkId !== undefined) {
      this.wrongNetwork = true;
      this.notificationsStore.showMessage('Please change network to Goerli', 'error');
    } else {
      this.wrongNetwork = false;
    }
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
  setAccountLoaded = (status: boolean): void => {
    this.isAccountLoaded = status;
  };

  @computed
  get connected() {
    return this.accountAddress;
  }

  @computed
  get isWrongNetwork() {
    return this.wrongNetwork;
  }

  @computed
  get accountLoaded() {
    return this.isAccountLoaded;
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
