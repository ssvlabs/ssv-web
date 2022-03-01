import { Contract } from 'web3-eth-contract';

export default abstract class Wallet {
    web3: any;
    connected: string;
    getContract: Contract;
    accountAddress: string;
    isWrongNetwork: boolean;

    protected constructor(getContract: Contract) {
        this.connected = '';
        this.accountAddress = '';
        this.isWrongNetwork = false;
        this.getContract = getContract;
    }

    public abstract connect(): void;
    // eslint-disable-next-line no-unused-vars
    public abstract decodeKey(publicKey: string): string;
    // eslint-disable-next-line no-unused-vars
    public abstract encodeKey(publicKey: string): string;
    public abstract initWalletHooks(): void;
    public abstract connectWalletFromCache(): void;
}