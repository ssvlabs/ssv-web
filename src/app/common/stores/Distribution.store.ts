import { Contract } from 'web3-eth-contract';
import { action, computed, observable } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import ApplicationStore from '~app/common/stores/Application.store';
import merkleTree from '~app/components/Distribution/assets/merkleTree.json';

/**
 * Base store provides singe source of true
 * for keeping all stores instances in one place
 */

class DistributionStore extends BaseStore {
    @observable txHash: string = '';
    @observable rewardIndex: number = 0;
    @observable userAddress: string = '';
    @observable rewardAmount: number = 0;
    @observable rewardMerkleProof: string[] = [];
    @observable userWithdrawRewards: boolean = false;
    @observable distributionContractInstance: Contract | null = null;

    /**
     * Returns instance of Distribution contract
     */
    @computed
    get distributionContract(): Contract {
        if (!this.distributionContractInstance) {
            const walletStore: WalletStore = this.getStore('Wallet');
            this.distributionContractInstance = new walletStore.web3.eth.Contract(
                config.CONTRACTS.SSV_DISTRIBUTION.ABI,
                config.CONTRACTS.SSV_DISTRIBUTION.ADDRESS,
            );
        }
        return <Contract> this.distributionContractInstance;
    }

    @computed
    get userRewardAmount() {
        const walletStore: WalletStore = this.getStore('Wallet');
        return walletStore.web3.utils.fromWei(String(this.rewardAmount));
    }

    @action.bound
    async claimRewards() {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
            const contract = this.distributionContract;
            const walletStore: WalletStore = this.getStore('Wallet');
            const applicationStore: ApplicationStore = this.getStore('Application');
            applicationStore.setIsLoading(true);
            await contract.methods.claim(
                this.rewardIndex,
                this.userAddress,
                String(this.rewardAmount),
                this.rewardMerkleProof,
            ).send({ from: walletStore.accountAddress })
                .on('receipt', async (receipt: any) => {
                    console.log('success!!!!!!');
                    console.log(receipt);
                    applicationStore.setIsLoading(false);
                    applicationStore.showTransactionPendingPopUp(false);
                    this.userWithdrawRewards = true;
                    resolve(true);
                })
                .on('transactionHash', (txHash: string) => {
                    this.txHash = txHash;
                    applicationStore.showTransactionPendingPopUp(true);
                })
                .on('error', (error: any) => {
                    console.log('error!!!!!!');
                    console.log(error);
                    applicationStore.setIsLoading(false);
                    applicationStore.showTransactionPendingPopUp(false);
                    resolve(false);
                });
        });
    }

    @action.bound
    async cleanState() {
        this.rewardIndex = 0;
        this.rewardAmount = 0;
        this.userAddress = '';
        this.rewardMerkleProof = [];
        this.userWithdrawRewards = false;
    }

    @action.bound
    async eligibleForReward() {
        await this.cleanState();
        const merkleTreeAddresses = Object.keys(merkleTree.claims);
        const walletStore: WalletStore = this.getStore('Wallet');
        merkleTreeAddresses.forEach((address: string) => {
            if (address.toLowerCase() === walletStore.accountAddress.toLowerCase()) {
                // @ts-ignore
                const merkleTreeUser = merkleTree.claims[address];
                this.userAddress = address;
                this.rewardIndex = merkleTreeUser.index;
                this.rewardMerkleProof = merkleTreeUser.proof;
                this.rewardAmount = parseInt(merkleTreeUser.amount, 16);
            }
        });
    }

    /**
     * @url https://docs.metamask.io/guide/registering-your-token.html
     */
    @action.bound
    registerSSVTokenInMetamask() {
        return new Promise((resolve, reject) => {
            return this.getStore('Wallet').web3.currentProvider.send({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: config.CONTRACTS.SSV_TOKEN.ADDRESS,
                        symbol: 'SSV',
                        decimals: 18,
                    },
                },
            }, (error: any, success: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(success);
                }
            });
        }).then((success: any) => {
            if (!success) {
                this.getStore('Notifications')
                    .showMessage('Can not add SSV to wallet!', 'error');
            }
        }).catch((error: any) => {
            console.error('Can not add SSV token to wallet', error);
            this.getStore('Notifications')
                .showMessage(`Can not add SSV to wallet: ${error.message}`, 'error');
        });
    }
}

export default DistributionStore;
