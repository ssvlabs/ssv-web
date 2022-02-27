import { Contract } from 'web3-eth-contract';

export default abstract class Wallet {
    connected: string;
    getContract: Contract;
    isWrongNetwork: boolean;

    protected constructor(getContract: Contract) {
        this.connected = '';
        this.isWrongNetwork = false;
        this.getContract = getContract;
    }

    public abstract connect(): void;
    public abstract encodeKey(): void;
    public abstract decodeKey(): void;
    public abstract initWalletHooks(): void;
    public abstract connectWalletFromCache(): void;
}