import Web3 from 'web3';
// import Onboard from 'bnc-onboard';
import { Contract } from 'web3-eth-contract';
import { action, observable, computed } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
// import ApplicationStore from '~app/common/stores/Application.store';
import NotificationsStore from '~app/common/stores/Notifications.store';
import Wallet from '~app/common/stores/Wallet/abstractWallet';

class WalletTestStore extends BaseStore implements Wallet {
    private contract: Contract | undefined;

    @observable web3: any = null;
    @observable ready: boolean = false;
    @observable wallet: any = null;
    @observable onboardSdk: any = null;
    @observable accountAddress: string = '';

    /**
     * Get smart contract instance
     * @param address
     */
    @action.bound
    async getContract(address?: string): Promise<Contract> {
        if (!this.contract && this.connected) {
            const contractAddress: string = config.CONTRACT.ADDRESS;
            this.contract = this.buildContract(address ?? contractAddress);
        }
        // @ts-ignore
        return this.contract;
    }

    @action.bound
    buildContract(address: string) {
        const abi: any = config.CONTRACT.ABI;
        return new this.web3.eth.Contract(abi, address);
    }

    @action.bound
    encodeOperatorKey(operatorKey?: string) {
        return this.web3.eth.abi.encodeParameter('string', operatorKey);
    }

    @action.bound
    decodeOperatorKey(operatorKey?: string) {
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
        const notificationsStore: NotificationsStore = this.getStore('Notifications');
        this.web3 = new Web3('ws://localhost:8545');
        const accounts = await this.web3.eth.getAccounts();
        console.log(accounts[0]);
        this.accountAddress = accounts[0];
        notificationsStore.showMessage('Wallet is connected!', 'success');
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
}

export default WalletTestStore;
