import axios from 'axios';
import { action, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/applications/Faucet/Wallet.store';

class FaucetStore extends BaseStore {
    amountToTransfer: any;
    pendingTransaction: any;
    addressTransactions: any;

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        makeObservable(this, {
            amountToTransfer: observable,
            pendingTransaction: observable,
            addressTransactions: observable,
            getLatestTransactions: action.bound,
            registerNewTransaction: action.bound,
            registerSSVTokenInMetamask: action.bound,
        });
    }

    async registerNewTransaction() {
        try {
            const walletStore: WalletStore = this.getStore('Wallet');
            const faucetUrl = `${process.env.REACT_APP_OPERATORS_ENDPOINT}/faucet`;
            this.pendingTransaction = await axios.post(faucetUrl, { owner_address: walletStore.accountAddress });
            return { status: true };
        } catch (e: any) {
            return { status: false, type: e.response.data.error.message === 'Reached max transactions per day' ? 1 : 2 };
        }
    }

    async getLatestTransactions() {
        try {
            const walletStore: WalletStore = this.getStore('Wallet');
            const faucetUrl = `${process.env.REACT_APP_OPERATORS_ENDPOINT}/faucet`;
            this.pendingTransaction = await axios.get(faucetUrl, { params: { owner_address: walletStore.accountAddress } });
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * @url https://docs.metamask.io/guide/registering-your-token.html
     */
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

export default FaucetStore;
