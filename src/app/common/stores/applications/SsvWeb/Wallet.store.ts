import Web3 from 'web3';
import Notify from 'bnc-notify';
import { Contract, ethers } from 'ethers';
// import { Contract } from 'web3-eth-contract';
import { ConnectedChain, WalletState } from '@web3-onboard/core';
import { action, computed, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import ApiParams from '~lib/api/ApiParams';
import { roundNumber } from '~lib/utils/numbers';
import BaseStore from '~app/common/stores/BaseStore';
import Application from '~app/common/stores/Abstracts/Application';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
// import Wallet, { WALLET_CONNECTED } from '~app/common/stores/Abstracts/Wallet';
import Wallet from '~app/common/stores/Abstracts/Wallet';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import {
  changeCurrentNetwork,
  getCurrentNetwork,
  inNetworks,
  notIncludeMainnet, testNets, TOKEN_NAMES,
} from '~lib/utils/envHelper';

class WalletStore extends BaseStore implements Wallet {
  web3: any = null;
  wallet: any = null;
  notifySdk: any = null;
  onboardSdk: any = null;
  accountAddress: string = '';
  wrongNetwork: boolean = false;
  networkId: number | null = null;
  accountDataLoaded: boolean = false;
  private viewContract: Contract | undefined;
  private networkContract: Contract | undefined;
  private ssvStore: SsvStore = this.getStore('SSV');
  private operatorStore: OperatorStore = this.getStore('Operator');
  private notificationsStore: NotificationsStore = this.getStore('Notifications');
  private initializingUserInfo: number = 0;

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
      initWallet: action.bound,
      accountDataLoaded: observable,
      initializeUserInfo: action.bound,
      setAccountDataLoaded: action.bound,
      checkConnectedWallet: action.bound,
      onBalanceChangeCallback: action.bound,
      onNetworkChangeCallback: action.bound,
      onWalletConnectedCallback: action.bound,
      onAccountAddressChangeCallback: action.bound,
    });
  }

  BN(s: any) {
    return new this.web3.utils.BN(s);
  }

  /**
   * Initialize SDK
   * @url https://docs.blocknative.com/onboard#initialization
   */
  async initWallet(wallet: WalletState | null, connectedChain: ConnectedChain | null) {
    if (wallet && connectedChain) {
      this.wallet = wallet;
      const networkId = parseInt(String(connectedChain.id), 16);
      const balance = wallet.accounts[0]?.balance ? wallet.accounts[0]?.balance[TOKEN_NAMES[networkId]] : undefined;
      const address = wallet.accounts[0]?.address;
      console.warn('<<<<<<<<<<<<< Wallet address >>>>>>>>>>>>>', address);
      await this.onWalletConnectedCallback(wallet);
      this.onNetworkChangeCallback(networkId);
      await this.onBalanceChangeCallback(balance);
      await this.onAccountAddressChangeCallback(address);
      const notifyOptions = {
        networkId,
        dappId: config.ONBOARD.API_KEY,
        desktopPosition: 'topRight',
      };
      // @ts-ignore
      this.notifySdk = Notify(notifyOptions);
    } else {
      console.warn('<<<<<<<<<<<<<<<<<<<<<<<< initWallet: no address >>>>>>>>>>>>>>>>>>>>>>>>');
      await this.onAccountAddressChangeCallback(undefined);
    }
  }

  /**
   * Initialize Account data from contract
   */
  async initializeUserInfo() {
    if (this.initializingUserInfo > 0) {
      this.initializingUserInfo++;
      return;
    }
    this.initializingUserInfo++;
    try {
      // await this.operatorStore.validatorsPerOperatorLimit();
      await this.ssvStore.initUser();
      await this.operatorStore.initUser();
    } catch (e: any) {
      console.log(e.message);
    } finally {
      this.initializingUserInfo--;
      if (this.initializingUserInfo > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await this.initializeUserInfo();
      }
    }
  }

  fromWei(amount?: number | string): number {
    if (!amount) return 0;
    if (typeof amount === 'number' && amount === 0) return 0;
    if (typeof amount === 'string' && Number(amount) === 0) return 0;

    return parseFloat(this.web3.utils.fromWei(amount.toString(), 'ether'));
  }

  async changeNetwork(networkId: string | number) {
    await this.onboardSdk.setChain({ chainId: networkId });
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
  async checkConnectedWallet() {
    await this.onAccountAddressChangeCallback(this.wallet?.address || undefined);
    // console.warn('checkConnectedWallet 1');
    // const walletConnected = window.localStorage.getItem(WALLET_CONNECTED);
    // if (!walletConnected || walletConnected && !JSON.parse(walletConnected)) {
    //   console.warn('checkConnectedWallet 2');
    //   await this.onAccountAddressChangeCallback(undefined);
    // }
  }

  async disconnect() {
    console.warn('Disconnecting wallet..');
    return;
    // const [primaryWallet] = this?.onboardSdk?.state?.get().wallets;
    // if (primaryWallet) {
    //   await this?.onboardSdk?.disconnectWallet({ label: primaryWallet.label }).catch((e: any) => {
    //     console.error('Error disconnecting wallet', e);
    //   });
    // }
  }

  /**
   * Connect wallet
   */
  async connect() {
    return;
    // try {
    //   console.debug('Connecting wallet..');
    //   // await this.disconnect();
    //   // cleanLocalStorage();
    //   if (this.wallet) {
    //     return;
    //   }
    //   const result = await this.onboardSdk.connectWallet();
    //   console.warn({
    //     result,
    //     onboardSdk: this.onboardSdk,
    //   });
    //   if (result?.length > 0) {
    //     const networkId = result[0].chains[0].id;
    //     let balance = 0;
    //     try {
    //       balance = result[0].accounts[0]?.balance[TOKEN_NAMES[networkId]];
    //     } catch (e) {
    //       balance = 0;
    //     }
    //     const wallet = result[0];
    //     const address = result[0].accounts[0].address;
    //     await this.onWalletConnectedCallback(wallet);
    //     this.onNetworkChangeCallback(Number(networkId));
    //     await this.onBalanceChangeCallback(balance || 0);
    //     await this.onAccountAddressChangeCallback(address);
    //   }
    // } catch (error: any) {
    //   const message = error.message ?? 'Unknown errorMessage during connecting to wallet';
    //   this.notificationsStore.showMessage(message, 'error');
    //   console.error('Connecting to wallet error:', error);
    //   return false;
    // }
  }

  /**
   * User address handler
   * @param address
   */
  async onAccountAddressChangeCallback(address: string | undefined) {
    this.setAccountDataLoaded(false);
    const applicationStore: Application = this.getStore('Application');
    const myAccountStore: MyAccountStore = this.getStore('MyAccount');
    const ssvStore: SsvStore = this.getStore('SSV');
    // window.localStorage.setItem(WALLET_CONNECTED, JSON.stringify(!!address));
    if (address === undefined || !this.wallet?.label) {
      console.warn('onAccountAddressChangeCallback: Wallet disconnected');
      ssvStore.clearUserSyncInterval();
      await this.resetUser();
      setTimeout(() => {
        this.setAccountDataLoaded(true);
      }, 1000);
    } else {
      console.warn('onAccountAddressChangeCallback: Wallet connected');
      this.ssvStore.clearSettings();
      myAccountStore.clearIntervals();
      this.accountAddress = address;
      ApiParams.cleanStorage();
      await Promise.all([
        this.initializeUserInfo(),
        myAccountStore.getOwnerAddressOperators({}),
        myAccountStore.getOwnerAddressClusters({}),
      ]);
      if (myAccountStore?.ownerAddressClusters?.length) {
        applicationStore.strategyRedirect = config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD;
      } else if (myAccountStore?.ownerAddressOperators?.length) {
        applicationStore.strategyRedirect = config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD;
      } else {
        applicationStore.strategyRedirect = config.routes.SSV.ROOT;
      }
      if (!myAccountStore?.ownerAddressOperators?.length || !myAccountStore?.ownerAddressClusters?.length) myAccountStore.forceBigList = true;
      myAccountStore.setIntervals();
      this.setAccountDataLoaded(true);
    }
  }

  async resetUser() {
    const myAccountStore: MyAccountStore = this.getStore('MyAccount');
    const applicationStore: Application = this.getStore('Application');
    this.accountAddress = '';
    this.ssvStore.clearSettings();
    this.operatorStore.clearSettings();
    myAccountStore.clearIntervals();
    window.localStorage.removeItem('params');
    window.localStorage.removeItem('selectedWallet');
    applicationStore.strategyRedirect = config.routes.SSV.ROOT;
  }

  /**
   * Callback for connected wallet
   * @param wallet
   */
  async onWalletConnectedCallback(wallet: any) {
    this.wallet = wallet;
    this.web3 = new Web3(wallet.provider);
    console.debug('Wallet Connected:', wallet);
  }

  /**
   * Fetch user balances and fees
   */
  async onBalanceChangeCallback(balance: any) {
    if (balance) await this.initializeUserInfo();
  }

  /**
   * User Network handler
   * @param networkId
   * @param apiVersion
   */
  onNetworkChangeCallback(networkId: number, apiVersion?: string) {
    if (notIncludeMainnet && networkId !== undefined && !inNetworks(networkId, testNets)) {
      this.wrongNetwork = true;
      this.notificationsStore.showMessage('Please change network to Holesky', 'error');
    } else {
      try {
        changeCurrentNetwork(Number(networkId), apiVersion);
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
    if (!this.viewContract && this.wallet.provider) {
      const abi: any = config.CONTRACTS.SSV_NETWORK_GETTER.ABI;
      const contractAddress: string = config.CONTRACTS.SSV_NETWORK_GETTER.ADDRESS;
      console.warn('Creating new getter contract', {
        abi,
        contractAddress,
      });
      // this.viewContract = new this.web3.eth.Contract(abi, contractAddress);
      const provider = new ethers.providers.Web3Provider(this.wallet.provider, 'any');
      this.viewContract = new Contract(contractAddress, abi, provider.getSigner());
    }
    // @ts-ignore
    return this.viewContract;
  }

  get setterContract(): Contract {
    if (!this.networkContract) {
      const abi: any = config.CONTRACTS.SSV_NETWORK_SETTER.ABI;
      const contractAddress: string = config.CONTRACTS.SSV_NETWORK_SETTER.ADDRESS;
      console.warn({ abi, contractAddress });
      // this.networkContract = new this.web3.eth.Contract(abi, contractAddress);
      const provider = new ethers.providers.Web3Provider(this.wallet.provider, 'any');
      this.networkContract = new Contract(contractAddress, abi, provider.getSigner());
    }
    return this.networkContract;
  }

}

export default WalletStore;
