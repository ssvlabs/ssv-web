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
  accountAddress: string;
  isWrongNetwork: boolean;
  networkId: number | null;

  protected constructor() {
    super();
    this.wallet = null;
    this.networkId = null;
    this.accountAddress = '';
    this.isWrongNetwork = false;
  }

  public abstract initializeUserInfo(): void;

  // eslint-disable-next-line no-unused-vars
  public abstract initWallet(wallet: WalletState | null, connectedChain: ConnectedChain | null): void;
}
