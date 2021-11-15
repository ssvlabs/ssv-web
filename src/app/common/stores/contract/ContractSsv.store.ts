import { Contract } from 'web3-eth-contract';
import { action, computed, observable } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import { roundNumber } from '~lib/utils/numbers';

class ContractSsv extends BaseStore {
    // Amount
    @observable ssvBalance: number = 0;

    // Calculation props
    @observable networkFee: number = 0;
    @observable liquidationCollateral: number = 0;

    // Allowance
    @observable userAllowance: boolean = false;

    // Contracts
    @observable ssvContractInstance: Contract | null = null;

    /**
     * Returns instance of SSV contract
     */
    @computed
    get ssvContract(): Contract {
        if (!this.ssvContractInstance) {
            const walletStore: WalletStore = this.getStore('Wallet');
            this.ssvContractInstance = new walletStore.web3.eth.Contract(
                config.CONTRACTS.SSV.ABI,
                this.getContractAddress('ssv'),
            );
        }
        return <Contract> this.ssvContractInstance;
    }

    @action.bound
    getFeeForYear = (fee: number): number => {
        const perYear = fee * config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR;
        return roundNumber(perYear, 8);
    };

    /**
     * Check if userAllowance has been approved and return boolean corresponding value.
     */
    @computed
    get approvedAllowance() {
        return this.userAllowance;
    }

    /**
     * Get user account address from wallet.
     */
    get accountAddress(): String {
        return this.getStore('Wallet').accountAddress;
    }

    /**
     * Gets the contract address regarding the testnet/mainnet flag in url search params.
     * By default mainnet is used.
     * If testnet used - show warning in the top of the page.
     * @param contract
     */
    @action.bound
    getContractAddress(contract: string): string {
        const contractType = String(contract).toUpperCase();
        // @ts-ignore
        const contractData = config.CONTRACTS[contractType].ADDRESS;

        return contractData;
    }

    /**
     * Deposit ssv
     * @param contract
     */
    @action.bound
    async deposit(amount: number) {
        const walletStore: WalletStore = this.getStore('Wallet');
        walletStore.getContract().methods
            .deposit(amount).call()
            .then((response: any) => {
                console.log(response);
            });
    }

    /**
     * Set userAllowance value as boolean.
     * @param approved
     */
    @action.bound
    setApprovedAllowance(approved: number | string | null) {
        if (approved) {
            this.userAllowance = true;
        } else {
            this.userAllowance = false;
        }
    }

    /**
     *  Call userAllowance function in order to know if it has been set or not for SSV contract by user account.
     */
    @action.bound
    async checkAllowance(): Promise<number> {
        return this.ssvContract
            .methods
            .allowance(
                this.accountAddress,
                this.getContractAddress('ssv_network'),
            )
            .call()
            .then((allowance: number) => {
                // const allowanceValue = parseFloat(String(allowance));
                // const weiValue = this.getStore('Wallet').web3.utils.toWei(String(allowanceValue), 'ether');
                this.setApprovedAllowance(parseFloat(String(allowance)));
                // DEV: stub to show first allowance button
                // this.setApprovedAllowance(0);
                return this.userAllowance;
            }).catch((e: any) => { console.log(e); });
    }

    /**
     * Set allowance to get CDT from user account.
     */
    @action.bound
    async approveAllowance(estimate: boolean = false, callBack?: () => void): Promise<any> {
        const ssvValue = String('115792089237316195423570985008687907853269984665640564039457584007913129639935');
        const weiValue = ssvValue; // amount ? this.getStore('Wallet').web3.utils.toWei(ssvValue, 'ether') : ssvValue;

        if (!estimate) {
            console.debug('Approving:', { ssvValue, weiValue });
        }

        const methodCall = this.ssvContract
            .methods
            .approve(this.getContractAddress('ssv_network'), weiValue);

        if (estimate) {
            return methodCall
                .estimateGas({ from: this.accountAddress })
                .then((gasAmount: number) => {
                    const floatString = this.getStore('Wallet').web3.utils.fromWei(String(gasAmount), 'ether');
                    return parseFloat(floatString);
                });
        }

        return methodCall
            .send({ from: this.accountAddress })
            .on('receipt', async () => {
                this.userAllowance = true;
            })
            .on('transactionHash', () => {
                callBack && callBack();
            })
            .on('error', (error: any) => {
                console.debug('Contract Error', error);
                this.userAllowance = false;
            });
    }

    @action.bound
    async getSsvContractBalance(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ssvContract
                .methods
                .balanceOf(this.accountAddress)
                .call()
                .then((balance: any) => {
                    const ssvBalance = parseFloat(String(this.getStore('Wallet').web3.utils.fromWei(balance, 'ether')));
                    this.ssvBalance = ssvBalance;
                    resolve(ssvBalance);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    // /**
    //  * @url https://docs.metamask.io/guide/registering-your-token.html
    //  */
    // @action.bound
    // registerSSVTokenInMetamask() {
    //     return new Promise((resolve, reject) => {
    //         return this.getStore('Wallet').web3.currentProvider.send({
    //             method: 'wallet_watchAsset',
    //             params: {
    //                 type: 'ERC20',
    //                 options: {
    //                     address: this.getContractAddress('ssv'),
    //                     symbol: 'SSV',
    //                     decimals: 18,
    //                 },
    //             },
    //         }, (error: any, success: any) => {
    //             if (error) {
    //                 reject(error);
    //             } else {
    //                 resolve(success);
    //             }
    //         });
    //     }).then((success: any) => {
    //         if (!success) {
    //             this.getStore('Notifications')
    //                 .showMessage('Can not add SSV to wallet!', 'error');
    //         }
    //     }).catch((error: any) => {
    //         console.error('Can not add SSV token to wallet', error);
    //         this.getStore('Notifications')
    //             .showMessage(`Can not add SSV to wallet: ${error.message}`, 'error');
    //     });
    // }
}

export default ContractSsv;
