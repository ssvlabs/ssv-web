import { Contract } from 'web3-eth-contract';
import { action, computed, observable } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import { roundNumber } from '~lib/utils/numbers';

class SsvStore extends BaseStore {
    // Amount
    @observable ssvBalance: number = 0;
    @observable networkContractBalance: number = 0;

    // Calculation props
    @observable networkFee: number = 0;
    @observable accountBurnRate: number = 0;
    @observable dataLoaded: boolean = false;
    @observable liquidationCollateral: number = 0;

    // User state
    @observable userState: string = 'operator';

    // User Validators and Operators
    @observable userOperators: any[] = [];
    @observable userValidators: any[] = [];

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

    /**
     * Check if userAllowance has been approved and return boolean corresponding value.
     */
    @computed
    get approvedAllowance() {
        return this.userAllowance;
    }

    /**
     * Check user state
     */
    @computed
    get isValidatorState() {
        return this.userState === 'validator';
    }

    /**
     * Get user account address from wallet.
     */
    @computed
    get accountAddress(): String {
        return this.getStore('Wallet').accountAddress;
    }

    @action.bound
    getFeeForYear = (fee: number): number => {
        const perYear = fee * config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR;
        return roundNumber(perYear, 8);
    };

    /**
     * Returns days remaining before liquidation
     */
    @computed
    get getRemainingDays(): number {
        const blocksPerDay = config.GLOBAL_VARIABLE.BLOCKS_PER_DAY;
        const blocksPerYear = config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR;
        const burnRatePerDay = this.accountBurnRate * blocksPerDay;
        const liquidationCollateral = this.liquidationCollateral / blocksPerYear;
        return this.networkContractBalance / burnRatePerDay - liquidationCollateral ?? 0;
    }

    /**
     Gets new remaining days for account after deposit or withdraw
     * @param newBalance
     */
    @action.bound
    getNewRemainingDays(newBalance: number | undefined): number {
        if (!newBalance) return 0;
        const blocksPerDay = config.GLOBAL_VARIABLE.BLOCKS_PER_DAY;
        const blocksPerYear = config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR;
        const burnRatePerDay = this.accountBurnRate * blocksPerDay;
        const liquidationCollateral = this.liquidationCollateral / blocksPerYear;
        return newBalance / burnRatePerDay - liquidationCollateral ?? 0;
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
        return config.CONTRACTS[contractType].ADDRESS;
    }

    /**
     * Deposit ssv
     * @param amount
     */
    @action.bound
    async deposit(amount: string) {
        return new Promise<boolean>((resolve) => {
            const walletStore: WalletStore = this.getStore('Wallet');
            const ssvAmount = walletStore.web3.utils.toWei(amount);
            walletStore.getContract().methods
                .deposit(ssvAmount).send({ from: this.accountAddress })
                .then(() => {
                    this.getSsvContractBalance().then(() => {
                        resolve(true);
                    });
                }).catch(() => {
                resolve(false);
            });
        });
    }

    /**
     * Fetch operators
     */
    @action.bound
    async fetchAccountOperators() {
        return new Promise<boolean>((resolve) => {
            const walletStore: WalletStore = this.getStore('Wallet');
            walletStore.getContract().methods
                .getOperatorsByOwnerAddress(this.accountAddress).call()
                .then((operators: any) => {
                    this.userOperators = operators;
                    resolve(true);
                }).catch(() => {
                resolve(false);
            });
        });
    }

    /**
     * Fetch validators
     */
    @action.bound
    async fetchAccountValidators() {
        return new Promise<boolean>((resolve) => {
            const walletStore: WalletStore = this.getStore('Wallet');
            walletStore.getContract().methods
                .getValidatorsByOwnerAddress(this.accountAddress).call()
                .then((validators: any) => {
                    this.userState = 'validator';
                    this.userValidators = validators;
                    resolve(true);
                }).catch(() => {
                resolve(false);
            });
        });
    }

    /**
     * Deposit ssv
     * @param amount
     */
    @action.bound
    async withdrawSsv(amount: string) {
        return new Promise<boolean>((resolve) => {
            const walletStore: WalletStore = this.getStore('Wallet');
            const ssvAmount = walletStore.web3.utils.toWei(amount);
            walletStore.getContract().methods.withdraw(ssvAmount).send({ from: this.accountAddress })
                .then(() => {
                    this.getNetworkContractBalance().then((balance: any) => {
                        this.networkContractBalance = balance;
                    });
                }).catch(() => {
                resolve(false);
            });
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
            }).catch((e: any) => {
                console.log(e);
            });
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

    /**
     * Get account balance on ssv contract
     */
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

    /**
     * Get account balance on network contract
     */
    @action.bound
    async getNetworkContractBalance(): Promise<any> {
        return new Promise((resolve, reject) => {
            const walletStore: WalletStore = this.getStore('Wallet');
            walletStore.getContract()
                .methods
                .totalBalanceOf(this.accountAddress)
                .call()
                .then((balance: any) => {
                    const ssvBalance = parseFloat(String(this.getStore('Wallet').web3.utils.fromWei(balance, 'ether')));
                    this.networkContractBalance = ssvBalance;
                    resolve(ssvBalance);
                    this.dataLoaded = true;
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    /**
     * Get network fee
     */
    @action.bound
    async getNetworkFees() {
        const walletStore: WalletStore = this.getStore('Wallet');
        const networkContract = walletStore.getContract();
        await networkContract.methods.minimumBlocksBeforeLiquidation().call().then((response: any) => {
            // hardcoded should be replace
            this.networkFee = 0.00001755593086049;
            this.liquidationCollateral = response;
        });
    }

    /**
     * Get operator revenue
     */
    @action.bound
    async getOperatorRevenue(): Promise<any> {
        return new Promise((resolve) => {
            const walletStore: WalletStore = this.getStore('Wallet');
            const networkContract = walletStore.getContract();
            networkContract.methods.totalEarningsOf(this.accountAddress).call().then((response: any) => {
                resolve(walletStore.web3.utils.fromWei(response.toString()));
            });
        });
    }

    /**
     * Get account burn rate
     */
    @action.bound
    async getAccountBurnRate(): Promise<any> {
        return new Promise((resolve, reject) => {
            const walletStore: WalletStore = this.getStore('Wallet');
            walletStore.getContract()
                .methods
                .burnRate(this.accountAddress)
                .call()
                .then((burnRate: any) => {
                    this.accountBurnRate = this.getStore('Wallet').web3.utils.fromWei(burnRate);
                    resolve(burnRate);
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

export default SsvStore;
