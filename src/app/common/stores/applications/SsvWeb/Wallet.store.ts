import Web3 from 'web3';
import Notify from 'bnc-notify';
import Onboard from 'bnc-onboard';
import { Contract } from 'web3-eth-contract';
import { action, computed, observable, makeObservable } from 'mobx';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import Validator from '~lib/api/Validator';
import ApiParams from '~lib/api/ApiParams';
import { roundNumber } from '~lib/utils/numbers';
import BaseStore from '~app/common/stores/BaseStore';
import Wallet from '~app/common/stores/Abstracts/Wallet';
import { wallets } from '~app/common/stores/utilis/wallets';
import Application from '~app/common/stores/Abstracts/Application';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';

class WalletStore extends BaseStore implements Wallet {
  web3: any = null;
  wallet: any = null;
  notifySdk: any = null;
  onboardSdk: any = null;
  accountAddress: string = '';
  wrongNetwork: boolean = false;
  networkId: number | null = null;
  accountDataLoaded: boolean = false;

  private contract: Contract | undefined;
  private ssvStore: SsvStore = this.getStore('SSV');
  private operatorStore: OperatorStore = this.getStore('Operator');
  private notificationsStore: NotificationsStore = this.getStore('Notifications');

  constructor() {
    super();
    makeObservable(this, {
      web3: observable,
      wallet: observable,
      connected: computed,
      toWei: action.bound,
      networkId: observable,
      notifySdk: observable,
      connect: action.bound,
      fromWei: action.bound,
      onboardSdk: observable,
      decodeKey: action.bound,
      resetUser: action.bound,
      encodeKey: action.bound,
      isWrongNetwork: computed,
      wrongNetwork: observable,
      getterContract: computed,
      setterContract: computed,
      accountAddress: observable,
      walletHandler: action.bound,
      addressHandler: action.bound,
      balanceHandler: action.bound,
      networkHandler: action.bound,
      initWalletHooks: action.bound,
      accountDataLoaded: observable,
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
  async initializeUserInfo() {
    try {
      // await this.operatorStore.validatorsPerOperatorLimit();
      await this.ssvStore.initUser();
      await this.operatorStore.initUser();
    } catch (e: any) {
      console.log(e.message);
    }
  }

  fromWei(amount?: number | string): number {
    if (!amount) return 0;
    if (typeof amount === 'number' && amount === 0) return 0;
    if (typeof amount === 'string' && Number(amount) === 0) return 0;

    return parseFloat(this.web3.utils.fromWei(amount.toString(), 'ether'));
  }

  toWei(amount?: number | string): string {
    if (!amount) return '0';
    // eslint-disable-next-line no-param-reassign
    if (typeof amount === 'number') amount = roundNumber(amount, 16);
    // eslint-disable-next-line no-param-reassign
    if (typeof amount === 'string') amount = amount.slice(0, 16);
    return this.web3.utils.toWei(amount.toString(), 'ether');
  }

  /**
   * Check wallet cache and connect
   */
  async connectWalletFromCache() {
    const selectedWallet: any = window.localStorage.getItem('selectedWallet');
    if (selectedWallet && selectedWallet !== 'undefined') {
      await this.onboardSdk.walletSelect(selectedWallet);
      await this.onboardSdk.walletCheck();
    } else {
      const applicationStore: Application = this.getStore('Application');
      applicationStore.strategyRedirect = config.routes.SSV.ROOT;
      await this.resetUser();
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
    const applicationStore: Application = this.getStore('Application');
    const myAccountStore: MyAccountStore = this.getStore('MyAccount');
    const ssvStore: SsvStore = this.getStore('SSV');
    if (address === undefined || !this.wallet?.name) {
      ssvStore.clearUserSyncInterval();
      await this.resetUser();
      setTimeout(() => {
        this.setAccountDataLoaded(true);
      }, 1000);
    } else {
      this.ssvStore.clearSettings();
      myAccountStore.clearIntervals();
      this.accountAddress = address;
      ApiParams.cleanStorage();
      await this.initializeUserInfo();
      const validatorsQuery = `${address}?page=1&perPage=5`;
      const validatorsResponse = await Validator.getInstance().clustersByOwnerAddress(validatorsQuery, true);
      const operatorsResponse = await Operator.getInstance().getOperatorsByOwnerAddress(1, 5, address, true);
      applicationStore.strategyRedirect = operatorsResponse?.operators?.length || validatorsResponse?.validators?.length ? config.routes.SSV.MY_ACCOUNT.DASHBOARD : config.routes.SSV.ROOT;
      if (!operatorsResponse?.operators?.length || !validatorsResponse?.validators?.length) myAccountStore.forceBigList = true;
      await myAccountStore.getOwnerAddressClusters({ reFetchBeaconData: true });
      await myAccountStore.getOwnerAddressOperators({});
      myAccountStore.setIntervals();
      this.setAccountDataLoaded(true);
    }
  }

  async resetUser() {
    const myAccountStore: MyAccountStore = this.getStore('MyAccount');
    const applicationStore: Application = this.getStore('Application');
    this.accountAddress = '';
    this.onboardSdk.walletReset();
    this.ssvStore.clearSettings();
    this.operatorStore.clearSettings();
    myAccountStore.clearIntervals();
    window.localStorage.removeItem('params');
    window.localStorage.removeItem('selectedWallet');
    applicationStore.strategyRedirect = config.routes.SSV.ROOT;
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
   * Fetch user balances and fees
   */
  async balanceHandler(balance: any) {
    if (balance) await this.initializeUserInfo();
  }

  /**
   * User Network handler
   * @param networkId: any
   */
  async networkHandler(networkId: any) {
    this.networkId = networkId;
    if (networkId !== 5 && networkId !== undefined) {
      this.wrongNetwork = true;
      this.notificationsStore.showMessage('Please change network to Goerli', 'error');
    } else {
      config.links.SSV_API_ENDPOINT = `${process.env.REACT_APP_SSV_API_ENDPOINT}/prater`;
      this.wrongNetwork = false;
    }
  }

  /**
   * encode key
   * @param key
   */
  encodeKey(key?: string) {
    if (!key) return '';
    return this.web3?.eth.abi.encodeParameter('string', key);
  }

  /**
   * decode key
   * @param key
   */
  decodeKey(key?: string) {
    if (!key) return '';
    return this.web3?.eth.abi.decodeParameter('string', key);
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

export default WalletStore;
