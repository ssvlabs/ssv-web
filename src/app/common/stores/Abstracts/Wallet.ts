import { ConnectedChain, WalletState } from '@web3-onboard/core';
import BaseStore from '~app/common/stores/BaseStore';

export default abstract class Wallet extends BaseStore {
  wallet: any;
  accountAddress: string;
  isNotMetamask = false;

  protected constructor() {
    super();
    this.wallet = null;
    this.accountAddress = '';
    this.isNotMetamask = false;
  }

  // eslint-disable-next-line no-unused-vars
  public abstract initWallet(wallet: WalletState, connectedChain: ConnectedChain): Promise<void>;

  public abstract resetUser(): Promise<void>;
}
