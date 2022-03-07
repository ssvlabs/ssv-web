import { Contract } from 'web3-eth-contract';
import BaseStore from '~app/common/stores/BaseStore';

export default abstract class Wallet extends BaseStore {
    web3: any;
    wallet: any;
    notifySdk: any;
    onboardSdk: any;
    connected: string;
    getContract: Contract;
    accountAddress: string;
    isWrongNetwork: boolean;
    accountDataLoaded: boolean;

    protected constructor(getContract: Contract) {
        super();
        this.wallet = null;
        this.connected = '';
        this.accountAddress = '';
        this.isWrongNetwork = false;
        this.getContract = getContract;
        this.accountDataLoaded = false;
    }

    public abstract connect(): void;
    public abstract initializeUserInfo(): void;
    // eslint-disable-next-line no-unused-vars
    public abstract decodeKey(publicKey: string): string;
    // eslint-disable-next-line no-unused-vars
    public abstract encodeKey(publicKey: string): string;
    public abstract initWalletHooks(): void;
    public abstract connectWalletFromCache(): void;
}