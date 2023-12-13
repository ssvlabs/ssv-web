import { ConnectedChain, WalletState } from '@web3-onboard/core';
import { Contract } from 'ethers';
// import { Contract } from 'web3-eth-contract';
import BaseStore from '~app/common/stores/BaseStore';

export const WALLET_CONNECTED = 'WalletConnected';

export default abstract class Wallet extends BaseStore {
  web3: any;
  wallet: any;
  notifySdk: any;
  onboardSdk: any;
  connected: string;
  accountAddress: string;
  isWrongNetwork: boolean;
  networkId: number | null;
  accountDataLoaded: boolean;

  protected constructor() {
    super();
    this.wallet = null;
    this.connected = '';
    this.networkId = null;
    this.accountAddress = '';
    this.isWrongNetwork = false;
    this.accountDataLoaded = false;
  }

  public abstract get getterContract(): Contract;
  public abstract get setterContract(): Contract;

  // eslint-disable-next-line no-unused-vars
  public abstract onBalanceChangeCallback(balance: string): void;

  // eslint-disable-next-line no-unused-vars
  public abstract onAccountAddressChangeCallback(address: string): void;

  // eslint-disable-next-line no-unused-vars
  public abstract onNetworkChangeCallback(networkId: number): void;

  public abstract connect(): void;

  public abstract initializeUserInfo(): void;

  // eslint-disable-next-line no-unused-vars
  public abstract decodeKey(publicKey: string): string;

  // eslint-disable-next-line no-unused-vars
  public abstract encodeKey(publicKey: string): string;

  // eslint-disable-next-line no-unused-vars
  public abstract fromWei(amount?: string): number;

  // eslint-disable-next-line no-unused-vars
  public abstract toWei(amount?: number | string): string;

  // eslint-disable-next-line no-unused-vars
  public abstract initWallet(wallet: WalletState | null, connectedChain: ConnectedChain | null): void;

  public abstract checkConnectedWallet(): void;

  // eslint-disable-next-line no-unused-vars
  public abstract changeNetwork(networkId: string | number): void;

  // eslint-disable-next-line no-unused-vars
  public abstract BN(s: any): any;
}
