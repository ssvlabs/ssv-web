import Web3 from 'web3';
import Notify from 'bnc-notify';
import { action, computed, makeObservable, observable } from 'mobx';
import { ConnectedChain, WalletState } from '@web3-onboard/core';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import Wallet from '~app/common/stores/Abstracts/Wallet';
import { distributionHelper } from '~lib/utils/distributionHelper';
import { inNetworks, NETWORKS, testNets } from '~lib/utils/envHelper';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import DistributionStore from '~app/common/stores/applications/Distribution/Distribution.store';
import DistributionTestnetStore from '~app/common/stores/applications/Distribution/DistributionTestnet.store';
import { isMainnetSupported } from '~root/providers/networkInfo.provider';

class WalletStore extends BaseStore implements Wallet {
  web3: any = null;
  wallet: any = null;
  ssvBalance: any = 0;
  notifySdk: any = null;
  onboardSdk: any = null;
  accountAddress: string = '';
  wrongNetwork: boolean = false;
  networkId: number | null = null;

  private distributionStore: DistributionStore | DistributionTestnetStore | null = null;
  private notificationsStore: NotificationsStore = this.getStore('Notifications');

  constructor() {
    super();

    makeObservable(this, {
      web3: observable,
      wallet: observable,
      toWei: action.bound,
      notifySdk: observable,
      networkId: observable,
      fromWei: action.bound,
      ssvBalance: observable,
      onboardSdk: observable,
      changeNetwork: action.bound,
      wrongNetwork: observable,
      isWrongNetwork: computed,
      accountAddress: observable,
      walletHandler: action.bound,
      addressHandler: action.bound,
      networkHandler: action.bound,
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
    // TODO: refactor
    if (wallet && connectedChain) {
      const networkId = parseInt(String(connectedChain.id), 16);
      const { storeName } = distributionHelper(networkId);
      this.distributionStore = this.getStore(storeName);
      const address = wallet?.accounts[0]?.address;
      await this.walletHandler(wallet);
      await this.networkHandler(networkId);
      await this.addressHandler(address);

      const notifyOptions = {
        networkId: Number(connectedChain.id),
        dappId: config.ONBOARD.API_KEY,
        desktopPosition: 'topRight',
      };
      // @ts-ignore
      this.notifySdk = Notify(notifyOptions);
    }
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
    // window.localStorage.setItem(WALLET_CONNECTED, JSON.stringify(!!address));
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
    if (!isMainnetSupported() && networkId !== undefined && !inNetworks(networkId, testNets)) {
      this.wrongNetwork = true;
      this.notificationsStore.showMessage('Please change network to Holesky', 'error');
    } else {
      try {
        const chainId = networkId === NETWORKS.HOLESKY ? NETWORKS.MAINNET : networkId;
        if (networkId === NETWORKS.HOLESKY) {
          await this.changeNetwork(chainId);
        }
        // TODO: change to new set network
        // changeCurrentNetwork(chainId);
      } catch (e) {
        this.wrongNetwork = true;
        this.notificationsStore.showMessage(String(e), 'error');
        return;
      }
      this.wrongNetwork = false;
      this.networkId = networkId;
    }
  }

  get isWrongNetwork(): boolean {
    return this.wrongNetwork;
  }
}

export default WalletStore;
