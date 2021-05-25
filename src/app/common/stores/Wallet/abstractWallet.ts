import { Contract } from 'web3-eth-contract';

export default abstract class Wallet {
    public abstract checkIfWalletReady(): boolean;
    public abstract selectWalletAndCheckIfReady(): void;
    public abstract connect(): void;
    public abstract disconnect(): void;
    public abstract clean(): void;
    public abstract decodeOperatorKey(): string;
    public abstract encodeOperatorKey(): string;
    public abstract getContract(): Promise<Contract>;
}
