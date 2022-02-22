import { sha256 } from 'js-sha256';
import { Contract } from 'web3-eth-contract';
import { action, observable, computed } from 'mobx';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import BaseStore from '~app/common/stores/BaseStore';
import { roundCryptoValueString } from '~lib/utils/numbers';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import PriceEstimation from '~lib/utils/contract/PriceEstimation';

export interface NewOperator {
    name: string,
    fee: number,
    pubKey: string,
    address: string,
}

export interface IOperator {
    fee?: number,
    name: string,
    logo?: string,
    type?: string,
    pubkey: string,
    score?: number,
    selected?: boolean,
    verified?: boolean,
    dappNode?: boolean,
    ownerAddress: string,
    autoSelected?: boolean
    validatorsCount?: number,
}

export interface Operators {
    [page: number]: OperatorFee;
}

interface OperatorFee {
    ssv: number,
    dollar: number,
}

interface OperatorsFees {
    [publicKey: string]: OperatorFee;
}

interface SelectedOperators {
    [index: string]: IOperator;
}

interface HashedOperators {
    [pubkey: string]: IOperator;
}

class OperatorStore extends BaseStore {
    public static OPERATORS_SELECTION_GAP = 66.66;

    @observable operators: IOperator[] = [];
    @observable operatorsFees: OperatorsFees = {};
    @observable hashedOperators: HashedOperators = {};
    @observable selectedOperators: SelectedOperators = {};

    @observable newOperatorReceipt: any = null;

    @observable newOperatorKeys: NewOperator = { name: '', pubKey: '', address: '', fee: 0 };
    @observable newOperatorRegisterSuccessfully: string = '';

    @observable estimationGas: number = 0;
    @observable dollarEstimationGas: number = 0;

    @observable loadingOperators: boolean = false;

    @observable operatorValidatorsLimit: number = 0;

    @computed
    get getSelectedOperatorsFee(): number {
        let sum: number = 0;
        // @ts-ignore
        Object.keys(this.selectedOperators).forEach((index: number) => {
            const fee = this.operatorsFees[this.selectedOperators[index].pubkey].ssv;
            // @ts-ignore
            sum += parseFloat(fee);
        });
        return sum;
    }

    /**
     * Check if selected necessary minimum of operators
     */
    @computed
    get selectedEnoughOperators(): boolean {
        return this.stats.selected >= config.FEATURE.OPERATORS.SELECT_MINIMUM_OPERATORS;
    }

    /**
     * Get selection stats
     */
    @computed
    get stats(): { total: number, selected: number, selectedPercents: number } {
        const selected = Object.values(this.selectedOperators).length;
        return {
            total: this.operators.length,
            selected,
            selectedPercents: ((selected / this.operators.length) * 100.0),
        };
    }

    /**
     * Check if operator registrable
     */
    @action.bound
    isOperatorRegistrable(validatorsRegisteredCount: number) {
        // eslint-disable-next-line radix
        return this.operatorValidatorsLimit > validatorsRegisteredCount;
    }

    /**
     * get validators per operator limit
     */
    @action.bound
    async validatorsPerOperatorLimit(): Promise<any> {
        return new Promise((resolve) => {
            const walletStore: WalletStore = this.getStore('Wallet');
            const contract: Contract = walletStore.getContract;
            contract.methods.getValidatorsPerOperatorLimit().call().then((response: any) => {
                this.operatorValidatorsLimit = parseInt(response, 10);
                resolve(true);
            }).catch(() => resolve(true));
        });
    }

    /**
     * get validators of operator
     */
    @action.bound
    async getOperatorValidatorsCount(publicKey: string): Promise<any> {
        return new Promise((resolve) => {
            const walletStore: WalletStore = this.getStore('Wallet');
            const contract: Contract = walletStore.getContract;
            contract.methods.validatorsPerOperatorCount(publicKey).call().then((response: any) => {
                resolve(response);
            });
        });
    }

    /**
     * clear operator store
     */
    @action.bound
    clearOperatorData() {
        this.newOperatorKeys = {
            pubKey: '',
            name: '',
            address: '',
            fee: 0,
        };
        this.newOperatorRegisterSuccessfully = '';
    }

    /**
     * Set operator keys
     * @param publicKey
     */
    @action.bound
    async getOperatorFee(publicKey: string): Promise<any> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
            try {
                const walletStore: WalletStore = this.getStore('Wallet');
                const contract: Contract = walletStore.getContract;
                contract.methods.getOperatorCurrentFee(publicKey).call().then((response: any) => {
                    const ssv = walletStore.web3.utils.fromWei(response);
                    this.operatorsFees[publicKey] = { ssv, dollar: 0 };
                    resolve(ssv);
                });
            } catch {
                this.operatorsFees[publicKey] = { ssv: 0, dollar: 0 };
                resolve(0);
            }
        });
    }

    /**
     * Set operator keys
     * @param transaction
     */
    @action.bound
    setOperatorKeys(transaction: NewOperator) {
        this.newOperatorKeys = transaction;
    }

    /**
     * Check if operator already exists in the contract
     * @param publicKey
     * @param contract
     */
    @action.bound
    async checkIfOperatorExists(publicKey: string): Promise<boolean> {
        const walletStore: WalletStore = this.getStore('Wallet');
        try {
            const contractInstance = walletStore.getContract;
            const result = await contractInstance.methods.operators(publicKey).call({ from: this.newOperatorKeys.address });
            return result[1] !== '0x0000000000000000000000000000000000000000';
        } catch (e) {
            console.error('Exception from operator existence check:', e);
            return true;
        }
    }

    /**
     * Add new operator
     * @param getGasEstimation
     * @param callBack
     */
    @action.bound
    // eslint-disable-next-line no-unused-vars
    async addNewOperator(getGasEstimation: boolean = false, callBack?: (txHash: string) => void) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                const payload: any[] = [];
                const walletStore: WalletStore = this.getStore('Wallet');
                const contract: Contract = walletStore.getContract;
                const address: string = this.newOperatorKeys.address;
                const transaction: NewOperator = this.newOperatorKeys;
                const gasEstimation: PriceEstimation = new PriceEstimation();
                this.newOperatorReceipt = null;

                // Send add operator transaction
                if (process.env.REACT_APP_NEW_STAGE) {
                    payload.push(
                        transaction.name,
                        transaction.pubKey,
                        walletStore.web3.utils.toWei(roundCryptoValueString(transaction.fee)),
                    );
                } else {
                    payload.push(
                        transaction.name,
                        transaction.address,
                        transaction.pubKey,
                    );
                }

                console.debug('Register Operator Transaction Data:', payload);
                if (getGasEstimation) {
                    const gasAmount = await this.conditionalContractFunction(contract, payload).estimateGas({ from: walletStore.accountAddress });
                    this.estimationGas = gasAmount * 0.000000001;
                    if (config.FEATURE.DOLLAR_CALCULATION) {
                        const rate = await gasEstimation.estimateGasInUSD(this.estimationGas);
                        this.dollarEstimationGas = this.estimationGas * rate * 0;
                        resolve(true);
                    } else {
                        this.dollarEstimationGas = 0;
                        resolve(true);
                    }
                } else {
                    this.conditionalContractFunction(contract, payload)
                        .send({ from: address })
                        .on('receipt', async (receipt: any) => {
                            // eslint-disable-next-line no-prototype-builtins
                            const event: boolean = receipt.hasOwnProperty('events');
                            if (event) {
                                console.debug('Contract Receipt', receipt);
                                this.newOperatorReceipt = receipt;
                                this.newOperatorRegisterSuccessfully = sha256(walletStore.decodeKey(transaction.pubKey));
                                resolve(true);
                            }
                        })
                        .on('transactionHash', (txHash: string) => {
                            callBack && callBack(txHash);
                        })
                        .on('error', (error: any) => {
                            console.debug('Contract Error', error);
                            // eslint-disable-next-line prefer-promise-reject-errors
                            reject(false);
                        });
                }
            } catch {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject(false);
            }
        });
    }

    /**
     * Unselect operator
     * @param index
     */
    @action.bound
    unselectOperator(index: number) {
        delete this.selectedOperators[index];
    }

    /**
     * Unselect operator by pubkey
     * @param index
     */
    @action.bound
    unselectOperatorByPublicKey(pubkey: string) {
        Object.keys(this.selectedOperators).forEach((index) => {
            if (this.selectedOperators[index].pubkey === pubkey) {
                delete this.selectedOperators[index];
            }
        });
    }

    /**
     * Select operator
     * @param operator
     * @param selectedIndex
     */
    @action.bound
    selectOperator(operator: IOperator, selectedIndex: number) {
        let operatorExist = false;
        // eslint-disable-next-line no-restricted-syntax
        for (const index of [1, 2, 3, 4]) {
            if (this.selectedOperators[index]?.pubkey === operator.pubkey) {
                operatorExist = true;
            }
        }
        if (!operatorExist) this.selectedOperators[selectedIndex] = operator;
    }

    /**
     * Check if operator selected
     * @param publicKey
     */
    @action.bound
    isOperatorSelected(publicKey: string): boolean {
        let exist = false;
        Object.values(this.selectedOperators).forEach((operator: IOperator) => {
            // @ts-ignore
            if (operator.pubkey === publicKey) exist = true;
        });

        return exist;
    }

    @action.bound
    unselectAllOperators() {
        this.selectedOperators = {};
    }

    /**
     * Load operators from external source
     */
    @action.bound
    async loadOperators(page: number = 1) {
        this.loadingOperators = true;
        const operators = await Operator.getInstance().getOperators(page);
        this.loadingOperators = false;
        if (process.env.REACT_APP_NEW_STAGE) {
            this.operators = await Promise.all(operators.map(async (operator: any): Promise<any> => {
                const operatorStore: OperatorStore = this.getStore('Operator');
                const operatorsAdapted = this.operatorAdapter(operator);
                operatorsAdapted.fee = await operatorStore.getOperatorFee(operatorsAdapted.pubkey);
                console.log('2');
                this.hashedOperators[operator.public_key] = operatorsAdapted;
                return operatorsAdapted;
            }));
        } else {
            this.operators = operators.map((operator: any) => {
                const adaptedOperator = this.operatorAdapter(operator);
                this.hashedOperators[operator.public_key] = adaptedOperator;
                return adaptedOperator;
            });
        }

        return this.operators;
    }

     operatorAdapter(_object: any) {
        const walletStore: WalletStore = this.getStore('Wallet');
        const encodePublicKey = walletStore.encodeKey(_object.public_key);
        return {
            fee: 0,
            name: _object.name,
            logo: _object.logo,
            type: _object.type,
            pubkey: encodePublicKey,
            ownerAddress: _object.owner_address,
            dappNode: _object.type === 'dapp_node',
            validatorsCount: _object.validators_count,
            verified: _object.type === 'verified_operator',
        };
    }

    conditionalContractFunction(contract: any, payload: any[]) {
        if (process.env.REACT_APP_NEW_STAGE) return contract.methods.registerOperator(...payload);
        return contract.methods.addOperator(...payload);
    }
}

export default OperatorStore;
