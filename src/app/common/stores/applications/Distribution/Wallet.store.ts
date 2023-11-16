import Web3 from 'web3';
import Notify from 'bnc-notify';
import Onboard from '@web3-onboard/core';
import { Contract } from 'web3-eth-contract';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import { action, computed, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import { getImage } from '~lib/utils/filePath';
import BaseStore from '~app/common/stores/BaseStore';
import { distributionHelper } from '~lib/utils/distributionHelper';
import Wallet, { WALLET_CONNECTED } from '~app/common/stores/Abstracts/Wallet';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import DistributionStore from '~app/common/stores/applications/Distribution/Distribution.store';
import {
  changeCurrentNetwork, getCurrentNetwork,
  inNetworks,
  NETWORKS, notIncludeMainnet, testNets, TOKEN_NAMES,
} from '~lib/utils/envHelper';
import DistributionTestnetStore from '~app/common/stores/applications/Distribution/DistributionTestnet.store';

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
  private distributionStore: DistributionStore | DistributionTestnetStore | null = null;
  private notificationsStore: NotificationsStore = this.getStore('Notifications');

  constructor() {
    super();

    makeObservable(this, {
      web3: observable,
      wallet: observable,
      toWei: action.bound,
      connected: computed,
      notifySdk: observable,
      networkId: observable,
      fromWei: action.bound,
      connect: action.bound,
      ssvBalance: observable,
      onboardSdk: observable,
      decodeKey: action.bound,
      changeNetwork: action.bound,
      encodeKey: action.bound,
      wrongNetwork: observable,
      isWrongNetwork: computed,
      getterContract: computed,
      setterContract: computed,
      accountAddress: observable,
      walletHandler: action.bound,
      addressHandler: action.bound,
      networkHandler: action.bound,
      initWalletHooks: action.bound,
      accountDataLoaded: observable,
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
    if (this.onboardSdk) return;
    const injected = injectedModule();
    const walletConnect = walletConnectModule({ projectId: config.ONBOARD.PROJECT_ID, optionalChains: [1, 5, 17000] });

    const theme = window.localStorage.getItem('isDarkMode') === '1' ? 'dark' : 'light';
    this.onboardSdk = Onboard({
      theme: theme,
      apiKey: config.ONBOARD.API_KEY,
      wallets: [injected, walletConnect],
      disableFontDownload: true,
      connect: {
        autoConnectLastWallet: true,
        showSidebar: false,
        removeIDontHaveAWalletInfoLink: true,
        removeWhereIsMyWalletWarning: true,
      },
      notify: {
        enabled: false,
      },
      accountCenter: {
        mobile: {
          enabled: false,
        },
        desktop: {
          enabled: false,
        },
      },
      chains: [
        {
          id: NETWORKS.MAINNET,
          token: TOKEN_NAMES[NETWORKS.MAINNET],
          label: 'Ethereum Mainnet',
        },
        {
          id: NETWORKS.GOERLI,
          token: TOKEN_NAMES[NETWORKS.GOERLI],
          label: 'Goerli testnet',
        },
        {
          id: NETWORKS.HOLESKY,
          label: 'Holesky testnet',
          token: TOKEN_NAMES[NETWORKS.HOLESKY],
        },
      ],
      appMetadata: {
        name: 'SSV Network',
        icon: getImage('ssvIcons/logo.svg'),
        logo: getImage('ssvIcons/logo.svg'),
        description: 'SSV Network',
        recommendedInjectedWallets: [
          { name: 'MetaMask', url: 'https://metamask.io' },
        ],
      },
    });

    const wallets = this.onboardSdk.state.select('wallets');
    wallets.subscribe(async (update: any) => {
      if (update.length > 0) {
        const networkId = parseInt(String(update[0]?.chains[0]?.id), 16);
        const { storeName } = distributionHelper(networkId);
        this.distributionStore = this.getStore(storeName);
        const wallet = update[0];
        const address = update[0]?.accounts[0]?.address;
        await this.walletHandler(wallet);
        await this.networkHandler(networkId);
        await this.addressHandler(address);
      } else if (this.accountAddress && update.length === 0) {
        await this.addressHandler(undefined);
      }
    });

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
  async initializeUserInfo() {

  }

  async changeNetwork(networkId: string | number) {
    await this.onboardSdk.setChain({ chainId: networkId });
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
    window.localStorage.setItem(WALLET_CONNECTED, JSON.stringify(!!address));
    if (address === undefined) {
      window.localStorage.removeItem('selectedWallet');
      this.accountAddress = '';
    } else {
      this.accountAddress = address;
      if (this.distributionStore) {
        await this.distributionStore.eligibleForReward();
        if (this.distributionStore instanceof DistributionTestnetStore && this.distributionStore.checkIfClaimed) {
          await this.distributionStore.checkIfClaimed();
        }
      }
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
    if (notIncludeMainnet && networkId !== undefined && !inNetworks(networkId, testNets)) {
      this.wrongNetwork = true;
      this.notificationsStore.showMessage('Please change network to Holesky', 'error');
    } else {
      try {
        changeCurrentNetwork(Number(networkId));
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
