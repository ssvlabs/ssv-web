import { Contract } from 'web3-eth-contract';
import BaseStore from '~app/common/stores/BaseStore';

export default abstract class Wallet extends BaseStore {
  web3: any;
  wallet: any;
  notifySdk: any;
  onboardSdk: any;
  connected: string;
  accountAddress: string;
  isWrongNetwork: boolean;
  networkId: number | null;
  getterContract: Contract;
  setterContract?: Contract;
  accountDataLoaded: boolean;

  protected constructor(getContract: Contract) {
    super();
    this.wallet = null;
    this.connected = '';
    this.networkId = null;
    this.accountAddress = '';
    this.isWrongNetwork = false;
    this.accountDataLoaded = false;
    this.getterContract = getContract;
    this.setterContract = getContract;
  }

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

  public abstract initWalletHooks(): void;

  public abstract connectWalletFromCache(): void;

  // eslint-disable-next-line no-unused-vars
  public abstract BN(s: any): any;
}
