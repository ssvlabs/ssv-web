import Web3 from 'web3';
import Onboard from 'bnc-onboard';
import { Contract } from 'web3-eth-contract';
import { action, computed, observable } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import { wallets } from '~app/common/stores/Wallet/wallets';
import Wallet from '~app/common/stores/Wallet/abstractWallet';
import ApplicationStore from '~app/common/stores/Application.store';
import NotificationsStore from '~app/common/stores/Notifications.store';

export const Networks = {
  MAINNET: 1,
  GOERLI: 5,
};

class WalletStore extends BaseStore implements Wallet {
  @observable networkId: number | null = null;
  @observable web3: any = null;
  @observable ready: boolean = false;
  @observable wallet: any = null;
  @observable onboardSdk: any = null;
  @observable accountAddress: string = '';
  @observable addressVerification: any;
  @observable wrongNetwork: boolean = false;
  private contract: Contract | undefined;

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
   * @param address
   */
  @action.bound
  async getContract(address?: string): Promise<Contract> {
    if (!this.contract && this.connected) {
      const contractAddress: string = config.CONTRACTS.SSV_REGISTRY.ADDRESS;
      this.contract = this.buildContract(address ?? contractAddress);
    }
    // @ts-ignore
    return this.contract;
  }

  @action.bound
  buildContract(address: string) {
    const abi: any = config.CONTRACTS.SSV_REGISTRY.ABI;
    return new this.web3.eth.Contract(abi, address);
  }

  @action.bound
  encodeKey(operatorKey?: string) {
    return this.web3.eth.abi.encodeParameter('string', operatorKey);
  }

  decodeKey(operatorKey?: string) {
    return this.web3.eth.abi.decodeParameter('string', operatorKey);
  }

  @action.bound
  clean() {
    this.accountAddress = '';
  }

  @action.bound
  async disconnect() {
    if (this.connected) {
      await this.onboardSdk.walletReset();
      this.clean();
    }
  }

  @action.bound
  async connect() {
    try {
      console.debug('Connecting wallet..');
      await this.selectWalletAndCheckIfReady();
    } catch (error: any) {
      const message = error.message ?? 'Unknown errorMessage during connecting to wallet';
      const notificationsStore: NotificationsStore = this.getStore('Notifications');
      notificationsStore.showMessage(message, 'error');
      console.error('Connecting to wallet error:', message);
      return false;
    }
  }

  /**
   * Check wallet is ready to transact
   */
  @action.bound
  async selectWalletAndCheckIfReady() {
    if (this.connected) {
      return;
    }
    await this.init();
    if (!this.connected) {
      const applicationStore: ApplicationStore = this.getStore('Application');
      await this.onboardSdk.walletSelect();
      await this.onboardSdk.walletCheck()
        .then((ready: boolean) => {
          console.debug(`Wallet is ${ready} for transaction:`);
        })
        .catch((error: any) => {
          applicationStore.setIsLoading(false);
          console.error('Wallet check errorMessage', error);
        });
    }
  }

  @action.bound
  setAccountAddress(address: string) {
    this.accountAddress = address;
  }

  @action.bound
  setNetworkId(networkId: number) {
    this.networkId = networkId;
  }

  /**
   * Initialize SDK
   * @url https://docs.blocknative.com/onboard#initialization
   */
  @action.bound
  async init() {
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
        wallet: this.onWalletConnected,
        address: this.setAccountAddress,
        network: this.onNetworkChange,
      },
    };
    console.debug('OnBoard SDK Config:', connectionConfig);
    this.onboardSdk = Onboard(connectionConfig);
    this.onboardSdk.walletReset();
  }

  /**
   * Callback for connected wallet
   * @param wallet
   */
  @action.bound
  async onWalletConnected(wallet: any) {
    this.wallet = wallet;
    this.web3 = new Web3(wallet.provider);
    this.addressVerification = this.web3.utils.isAddress;
    console.debug('Wallet Connected:', wallet);
    window.localStorage.setItem('selectedWallet', wallet.name);
  }

  @action.bound
  async onNetworkChange(networkId: any) {
    if (networkId !== 5) {
      this.alertNetworkError();
    } else {
      this.wrongNetwork = false;
    }
  }

  @action.bound
  alertNetworkError() {
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    this.wrongNetwork = true;
    notificationsStore.showMessage('Please change network to Goerli', 'error');
  }

  @action.bound
  async checkConnection() {
    const selectedWallet: string | null = window.localStorage.getItem('selectedWallet');
    if (selectedWallet) {
      await this.init();
      await this.onboardSdk.walletSelect(selectedWallet);
    }
  }

  @action.bound
  async onWalletDisconnect() {
    this.onboardSdk.walletReset();
    this.wallet = null;
    this.web3 = null;
    this.ready = false;
    this.onboardSdk = null;
    this.accountAddress = '';
    window.localStorage.removeItem('selectedWallet');
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
}

export default WalletStore;
