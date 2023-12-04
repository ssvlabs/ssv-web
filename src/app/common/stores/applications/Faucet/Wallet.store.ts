import Web3 from 'web3';
import axios from 'axios';
import Notify from 'bnc-notify';
import { Contract } from 'ethers';
import { action, computed, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import { initOnboard } from '~lib/utils/onboardHelper';
import Application from '~app/common/stores/Abstracts/Application';
import FaucetStore from '~app/common/stores/applications/Faucet/Faucet.store';
import { changeCurrentNetwork, getCurrentNetwork, isMainnet, NETWORKS } from '~lib/utils/envHelper';
import Wallet, { WALLET_CONNECTED } from '~app/common/stores/Abstracts/Wallet';
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
      changeNetwork: action.bound,
      isWrongNetwork: computed,
      wrongNetwork: observable,
      getterContract: computed,
      setterContract: computed,
      accountAddress: observable,
      walletHandler: action.bound,
      networkHandler: action.bound,
      addressHandler: action.bound,
      accountDataLoaded: observable,
      initWalletHooks: action.bound,
      initializeUserInfo: action.bound,
      setAccountDataLoaded: action.bound,
      checkConnectedWallet: action.bound,
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

    this.onboardSdk = initOnboard();

    const wallets = this.onboardSdk.state.select();
    wallets.subscribe(async (update: any) => {
      console.warn('Wallet subscription data:', update);
      update = update.wallets;
      if (update.length > 0) {
        const networkId = parseInt(String(update[0]?.chains[0]?.id), 16);
        const wallet = update[0];
        const address = update[0]?.accounts[0]?.address;
        await this.walletHandler(wallet);
        if (Number(networkId) !== NETWORKS.MAINNET) {
          this.wrongNetwork = false;
          await this.networkHandler(networkId);
        } else {
          this.wrongNetwork = true;
          this.notificationsStore.showMessage('Please change network', 'error');
        }
        await this.addressHandler(address);
      } else if (this.accountAddress && update.length === 0) {
        await this.addressHandler(undefined);
      }
    });
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
      const { faucetApi } = getCurrentNetwork();
      const applicationStore: Application = this.getStore('Application');
      const faucetStore: FaucetStore = this.getStore('Faucet');
      const faucetUrl = `${faucetApi}/config`;
      const response = (await axios.get(faucetUrl)).data.filter((data: any) => data.network === this.networkId?.toString());
      if (response.length > 0) {
        faucetStore.amountToTransfer = response[0].amount_to_transfer;
        // eslint-disable-next-line no-constant-condition
        applicationStore.strategyRedirect = response[0].transactions_capacity > 0 ? config.routes.FAUCET.ROOT : config.routes.FAUCET.DEPLETED;
      }
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
  async checkConnectedWallet() {
    const walletConnected = window.localStorage.getItem(WALLET_CONNECTED);
    if (!walletConnected || walletConnected && !JSON.parse(walletConnected)) {
      await this.addressHandler(undefined);
    }
  }

  /**
   * Connect wallet
   */
  async connect() {
    try {
      console.debug('Connecting wallet..');
      const result = await this.onboardSdk.connectWallet();
      if (result?.length > 0) {
        const networkId = result[0].chains[0].id;
        const wallet = result[0];
        const address = result[0].accounts[0].address;
        await this.walletHandler(wallet);
        await this.networkHandler(Number(networkId));
        await this.addressHandler(address);
      }
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
  async addressHandler(address: string | undefined) {
    this.setAccountDataLoaded(false);
    if (address === undefined) {
      this.accountAddress = '';
      window.localStorage.removeItem('selectedWallet');
    } else {
      this.accountAddress = address;
      await this.initializeUserInfo();
    }
    this.setAccountDataLoaded(true);
  }

  getSigner(){}

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
    if (!isMainnet) {
      try {
        changeCurrentNetwork(Number(networkId));
        this.wrongNetwork = networkId === undefined;
        this.networkId = networkId;
      } catch (e) {
        this.wrongNetwork = true;
        this.notificationsStore.showMessage(String(e), 'error');
        return;
      }
    } else {
      this.wrongNetwork = true;
      this.notificationsStore.showMessage('Please change network', 'error');
      return;
    }
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

  async changeNetwork(networkId: string | number) {
    await this.onboardSdk.setChain({ chainId: networkId });
  }

  get connected() {
    return this.accountAddress;
  }

  get isWrongNetwork(): boolean {
    return this.wrongNetwork;
  }

  get getterContract(): Contract {
    if (!this.contract) {
      const abi: any = config.CONTRACTS.SSV_NETWORK_GETTER.ABI;
      const contractAddress: string = config.CONTRACTS.SSV_NETWORK_GETTER.ADDRESS;
      this.contract = new this.web3.eth.Contract(abi, contractAddress);
    }
    // @ts-ignore
    return this.contract;
  }

  get setterContract(): Contract {
    if (!this.contract) {
      const abi: any = config.CONTRACTS.SSV_NETWORK_GETTER.ABI;
      const contractAddress: string = config.CONTRACTS.SSV_NETWORK_GETTER.ADDRESS;
      this.contract = new this.web3.eth.Contract(abi, contractAddress);
    }
    // @ts-ignore
    return this.contract;
  }
}

export default WalletStore;
