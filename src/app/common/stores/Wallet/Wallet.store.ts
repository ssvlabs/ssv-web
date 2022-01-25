import Web3 from 'web3';
import Notify from 'bnc-notify';
import Onboard from 'bnc-onboard';
import { Contract } from 'web3-eth-contract';
import { action, computed, observable } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import SsvStore from '~app/common/stores/SSV.store';
import { wallets } from '~app/common/stores/Wallet/wallets';
import OperatorStore from '~app/common/stores/Operator.store';
import Wallet from '~app/common/stores/Wallet/abstractWallet';
import NotificationsStore from '~app/common/stores/Notifications.store';

class WalletStore extends BaseStore implements Wallet {
  @observable web3: any = null;
  @observable wallet: any = null;
  @observable notifySdk: any = null;
  @observable onboardSdk: any = null;
  @observable addressVerification: any;
  @observable accountAddress: string = '';
  @observable wrongNetwork: boolean = false;
  @observable networkId: number | null = null;
  @observable walletConnected: boolean = false;

  private contract: Contract | undefined;
  private ssvStore: SsvStore = this.getStore('SSV');
  private operatorStore: OperatorStore = this.getStore('Operator');
  private notificationsStore: NotificationsStore = this.getStore('Notifications');

  constructor() {
    super();
    this.init();
  }

  @computed
  get connected() {
    return this.accountAddress;
  }

  @computed
  get isWrongNetwork() {
    return this.wrongNetwork;
  }

  /**
   * Get smart contract instance
   * @param address: string
   */
  @action.bound
  getContract(address?: string): Contract {
    if (!this.contract) {
      const abi: any = process.env.REACT_APP_NEW_STAGE ? config.CONTRACTS.SSV_NETWORK.ABI : config.CONTRACTS.SSV_NETWORK.OLD_ABI;
      const contractAddress: string = config.CONTRACTS.SSV_NETWORK.ADDRESS;
      this.contract = new this.web3.eth.Contract(abi, address ?? contractAddress);
    }
    // @ts-ignore
    return this.contract;
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
   * Initialize SDK
   * @url https://docs.blocknative.com/onboard#initialization
   */
  @action.bound
  init() {
    if (this.onboardSdk) {
      return;
    }
    console.debug('Initializing OnBoard SDK..');
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
        balance: this.syncBalance,
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
   * Check wallet cache and connect
   */
  @action.bound
  async checkConnection() {
    const selectedWallet: string | null = window.localStorage.getItem('selectedWallet');
    if (selectedWallet) {
      await this.onboardSdk.walletSelect(selectedWallet);
      await this.onboardSdk.walletCheck();
    } else {
      this.ssvStore.setAccountLoaded(true);
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
    if (address === undefined) {
      this.accountAddress = address;
      this.walletConnected = true;
      this.ssvStore.initSettings();
      window.localStorage.removeItem('selectedWallet');
    } else {
      this.accountAddress = address;
      this.walletConnected = true;
      await this.initializeUserInfo();
    }
  }

  /**
   * Callback for connected wallet
   * @param wallet: any
   */
  @action.bound
  async walletHandler(wallet: any) {
    console.log('wallet: ', wallet);
    this.wallet = wallet;
    this.web3 = new Web3(wallet.provider);
    this.addressVerification = this.web3.utils.isAddress;
    console.debug('Wallet Connected:', wallet);
    window.localStorage.setItem('selectedWallet', wallet.name);
  }

  /**
   * Initialize Account data from contract
   */
  @action.bound
  async initializeUserInfo() {
    this.ssvStore.setAccountLoaded(false);
    await this.operatorStore.validatorsPerOperatorLimit();
    if (process.env.REACT_APP_NEW_STAGE) {
      await this.ssvStore.checkIfLiquidated();
      await this.ssvStore.getSsvContractBalance();
      await this.ssvStore.getNetworkContractBalance();
      await this.ssvStore.getAccountBurnRate();
      await this.operatorStore.loadOperators();
      await this.ssvStore.fetchAccountOperators();
      await this.ssvStore.fetchAccountValidators();
      await this.ssvStore.getNetworkFees();
      await this.ssvStore.checkAllowance();
    }
    this.ssvStore.setAccountLoaded(true);
  }

  /**
   * Fetch user balances and fees
   */
  @action.bound
  async syncBalance() {
    if (!process.env.REACT_APP_NEW_STAGE) return;
    if (!this.accountAddress) return;
    await this.ssvStore.getSsvContractBalance();
    await this.ssvStore.getNetworkContractBalance();
    await this.ssvStore.checkIfLiquidated();
    await this.ssvStore.getNetworkFees();
    await this.ssvStore.getAccountBurnRate();
  }

  /**
   * User Network handler
   * @param networkId: any
   */
  @action.bound
  async networkHandler(networkId: any) {
    console.log('networkId: ', networkId);
    if (networkId !== 5) {
      this.wrongNetwork = true;
      this.notificationsStore.showMessage('Please change network to Goerli', 'error');
    } else {
      this.wrongNetwork = false;
      await this.initializeUserInfo();
    }
  }
}

export default WalletStore;
