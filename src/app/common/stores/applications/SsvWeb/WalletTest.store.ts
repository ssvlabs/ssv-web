import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { action, observable, computed } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import Wallet from '~app/common/stores/Abstracts/Wallet';

class WalletTestStore extends BaseStore implements Wallet {
    private contract: Contract | undefined;

    @observable notifySdk: any;
    @observable web3: any = null;
    @observable wallet: any = null;
    @observable ssvBalance: number = 0;
    @observable onboardSdk: any = null;
    @observable ready: boolean = false;
    @observable accountAddress: string = '';
    @observable wrongNetwork: boolean = false;
    @observable isAccountLoaded: boolean = false;
    @observable accountDataLoaded: boolean = true;

    @action.bound
    initWalletHooks(): void {
    }

    @action.bound
    initializeUserInfo(): void {
    }

    @action.bound
    fromWei(amount?: string): number {
        if (!amount) return 0;
        return this.web3?.utils.fromWei(amount, 'ether');
    }

    @action.bound
    toWei(amount?: number): string {
        if (!amount) return '0';
        return this.web3?.utils.toWei(amount.toString(), 'ether');
    }

    @action.bound
    buildContract(address: string) {
        const abi: any = config.CONTRACTS.SSV_NETWORK.ABI;
        return new this.web3.eth.Contract(abi, address);
    }

    @action.bound
    encodeKey(operatorKey?: string) {
        return this.web3.eth.abi.encodeParameter('string', operatorKey);
    }

    @action.bound
    decodeKey(operatorKey?: string) {
        return this.web3.eth.abi.decodeParameter('string', operatorKey);
    }

    @action.bound
    clean() {
        this.accountAddress = '';
    }

    @action.bound
    async disconnect() {
        if (this.connected) {
            this.accountAddress = '';
        }
    }

    @action.bound
    async connect() {
        try {
            console.debug('Connecting wallet..');
            await this.selectWalletAndCheckIfReady();
        } catch (error: any) {
            const message = error.message ?? 'Unknown errorMessage during connecting to wallet';
            const notificationsStore: NotificationsStore = this.getStore('Notifications');
            notificationsStore.showMessage(message, 'error');
            console.error('Connecting to wallet error:', message);
        }
    }

    @computed
    get connected() {
        return this.accountAddress;
    }

    /**
     * Check wallet is ready to transact
     */
    @action.bound
    async selectWalletAndCheckIfReady() {
        if (this.connected) {
            return;
        }
        this.web3 = new Web3('ws://localhost:8545');
        const accounts = await this.web3.eth.getAccounts();
        this.accountAddress = accounts[0];
    }

    /**
     * Returns true if wallet is ready
     * Otherwise returns false
     */
    checkIfWalletReady() {
        const notificationsStore: NotificationsStore = this.getStore('Notifications');
        if (!this.connected) {
            notificationsStore.showMessage('Please connect your wallet', 'error');
            return false;
        }
        return true;
    }

    /**
     * Check wallet cache and connect
     */
    @action.bound
    async connectWalletFromCache() {
        const selectedWallet: string | null = window.localStorage.getItem('selectedWallet');
        if (selectedWallet) {
            await this.onboardSdk.walletSelect(selectedWallet);
            await this.onboardSdk.walletCheck();
        } else {
            this.setAccountLoaded(true);
        }
    }

    @action.bound
    setAccountLoaded = (status: boolean): void => {
        this.isAccountLoaded = status;
    };

    @computed
    get isWrongNetwork(): boolean {
        return this.wrongNetwork;
    }

    /**
     * Get smart contract instance
     * @param address
     */
    @computed
    get getContract(): Contract {
        if (!this.contract && this.connected) {
            const contractAddress: string = config.CONTRACTS.SSV_NETWORK.ADDRESS;
            this.contract = this.buildContract(contractAddress);
        }
        // @ts-ignore
        return this.contract;
    }
}

export default WalletTestStore;
