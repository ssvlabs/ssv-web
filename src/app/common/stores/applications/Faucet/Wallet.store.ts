import Web3 from 'web3';
import axios from 'axios';
import Notify from 'bnc-notify';
import { ConnectedChain, WalletState } from '@web3-onboard/core';
import { action, computed, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import Application from '~app/common/stores/Abstracts/Application';
import FaucetStore from '~app/common/stores/applications/Faucet/Faucet.store';
import { isMainnet, NETWORKS } from '~lib/utils/envHelper';
import Wallet from '~app/common/stores/Abstracts/Wallet';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';

class WalletStore extends BaseStore implements Wallet {
  web3: any = null;
  wallet: any = null;
  ssvBalance: any = 0;
  notifySdk: any = null;
  onboardSdk: any = null;
  accountAddress: string = '';
  wrongNetwork: boolean = false;
  networkId: number | null = null;

  private notificationsStore: NotificationsStore = this.getStore('Notifications');

  constructor() {
    super();

    makeObservable(this, {
      web3: observable,
      wallet: observable,
      toWei: action.bound,
      notifySdk: observable,
      fromWei: action.bound,
      networkId: observable,
      onboardSdk: observable,
      ssvBalance: observable,
      changeNetwork: action.bound,
      isWrongNetwork: computed,
      wrongNetwork: observable,
      accountAddress: observable,
      walletHandler: action.bound,
      networkHandler: action.bound,
      addressHandler: action.bound,
      initWallet: action.bound,
      initializeUserInfo: action.bound,
      checkConnectedWallet: action.bound,
    });
  }

  /**
   * Initialize SDK
   * @url https://docs.blocknative.com/onboard#initialization
   */
  async initWallet(wallet: WalletState | null, connectedChain: ConnectedChain | null) {
    if (wallet && connectedChain) {
      this.wallet = wallet;
      const networkId = parseInt(String(connectedChain.id), 16);
      const address = wallet.accounts[0]?.address;
      await this.walletHandler(wallet);
      if (Number(networkId) !== NETWORKS.MAINNET) {
        this.wrongNetwork = false;
        await this.networkHandler(networkId);
      } else {
        this.wrongNetwork = true;
        this.notificationsStore.showMessage('Please change network', 'error');
      }
      await this.addressHandler(address);
      const notifyOptions = {
        networkId: Number(connectedChain.id),
        dappId: config.ONBOARD.API_KEY,
        desktopPosition: 'topRight',
      };
      // @ts-ignore
      this.notifySdk = Notify(notifyOptions);
    } else if (this.accountAddress && !wallet) {
      await this.addressHandler(undefined);
    }
  }

  /**
   * Initialize Account data from contract
   */
  async initializeUserInfo() {
    try {
      const { faucetApi } = getStoredNetwork();
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
    // const walletConnected = window.localStorage.getItem(WALLET_CONNECTED);
    // if (!walletConnected || walletConnected && !JSON.parse(walletConnected)) {
    //   await this.addressHandler(undefined);
    // }
  }

  /**
   * User address handler
   * @param address: string
   */
  async addressHandler(address: string | undefined) {
    if (address === undefined) {
      this.accountAddress = '';
      window.localStorage.removeItem('selectedWallet');
    } else {
      this.accountAddress = address;
      await this.initializeUserInfo();
    }
  }

  /**
   * Callback for connected wallet
   * @param wallet: any
   */
  async walletHandler(wallet: any) {
    this.wallet = wallet;
    this.web3 = new Web3(wallet.provider);
  }

  /**
   * User Network handler
   * @param networkId: any
   */
  async networkHandler(networkId: any) {
    if (!isMainnet) {
      try {
        // TODO: refactor
        // changeCurrentNetwork(Number(networkId));
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

  async changeNetwork(networkId: string | number) {
    await this.onboardSdk.setChain({ chainId: networkId });
  }

  get isWrongNetwork(): boolean {
    return this.wrongNetwork;
  }
}

export default WalletStore;
