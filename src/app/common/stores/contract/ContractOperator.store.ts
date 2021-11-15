import { Contract } from 'web3-eth-contract';
import { action, observable, computed } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import operators from '~lib/utils/testOperators.json';
// import ApiRequest, { RequestData } from '~lib/utils/ApiRequest';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import PriceEstimation from '~lib/utils/contract/PriceEstimation';
import { roundCryptoValueString } from '~lib/utils/numbers';

export interface INewOperatorTransaction {
    name: string,
    fee: number,
    pubKey: string,
    address: string,
}

interface NewOperatorKeys extends Omit<INewOperatorTransaction, 'address'> {
    address?: string
}

export interface IOperator {
    selectedPosition: number;
    name: string,
    pubkey: string,
    ownerAddress: string,
    paymentAddress?: string,
    score?: number,
    selected?: boolean
    autoSelected?: boolean
    verified?: boolean
    dappNode?: boolean
    fee?: number,
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

class ContractOperator extends BaseStore {
    public static OPERATORS_SELECTION_GAP = 66.66;

    @observable operators: IOperator[] = [];
    @observable operatorsFees: OperatorsFees = {};
    @observable selectedOperators: SelectedOperators = {};
    @observable operatorsLoaded: boolean = false;

    @observable newOperatorReceipt: any = null;

    @observable newOperatorKeys: INewOperatorTransaction = { name: '', pubKey: '', address: '', fee: 0 };
    @observable newOperatorRegisterSuccessfully: boolean = false;

    @observable estimationGas: number = 0;
    @observable dollarEstimationGas: number = 0;

    @observable loadingOperator: boolean = false;

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
        this.newOperatorRegisterSuccessfully = false;
    }

    /**
     * Set operator keys
     * @param publicKey
     */
    @action.bound
    getOperatorFee(publicKey: string): number {
        const walletStore: WalletStore = this.getStore('Wallet');
        if (publicKey.startsWith('0x', 0)) {
            // eslint-disable-next-line no-param-reassign
            publicKey = walletStore.decodeKey(publicKey);
        }
        return this.operatorsFees[publicKey].ssv;
    }

    @computed
    get getSelectedOperatorsFee(): number {
        let sum: number = 0;
        // @ts-ignore
        Object.keys(this.selectedOperators).forEach((index: number) => {
            // @ts-ignore
            sum += parseFloat(this.selectedOperators[index].fee);
        });
        return sum;
    }

    /**
     * Set operator keys
     * @param publicKey
     */
    @action.bound
    async setOperatorFee(publicKey: string) {
        if (this.operatorsFees[publicKey]) {
            return this.operatorsFees[publicKey];
        }
        const walletStore: WalletStore = this.getStore('Wallet');
        if (!walletStore.web3.utils || !publicKey) return;
        const contract: Contract = walletStore.getContract();
        return contract.methods.getOperatorCurrentFee(publicKey).call().then((response: any) => {
            const ssv = walletStore.web3.utils.fromWei(response);
            this.operatorsFees[publicKey] = { ssv, dollar: 0 };
            return ssv;
        }).catch(() => {
            this.operatorsFees[publicKey] = { ssv: 0, dollar: 0 };
            return 0;
        });
    }

    /**
     * Set operator keys
     * @param transaction
     */
    @action.bound
    setOperatorKeys(transaction: NewOperatorKeys) {
        this.newOperatorKeys = {
            pubKey: transaction.pubKey,
            name: transaction.name,
            address: transaction.address || this.newOperatorKeys.address,
            fee: transaction.fee || this.newOperatorKeys.fee,
        };
    }

    /**
     * Check if operator already exists in the contract
     * @param publicKey
     * @param contract
     */
    @action.bound
    async checkIfOperatorExists(publicKey: string, contract?: Contract): Promise<boolean> {
        const walletStore: WalletStore = this.getStore('Wallet');
        try {
            const contractInstance = contract ?? walletStore.getContract();
            const encodeOperatorKey = await walletStore.encodeKey(publicKey);
            this.setOperatorKeys({ name: this.newOperatorKeys.name, pubKey: encodeOperatorKey, fee: this.newOperatorKeys.fee });
            const result = await contractInstance.methods.operators(encodeOperatorKey).call({ from: this.newOperatorKeys.address });
            return result[1] !== '0x0000000000000000000000000000000000000000';
        } catch (e) {
            console.error('Exception from operator existence check:', e);
            return true;
        }
    }

    /**
     * Add new operator
     * @param getGasEstimation
     */
    @action.bound
    // eslint-disable-next-line no-unused-vars
    async addNewOperator(getGasEstimation: boolean = false, callBack?: (txHash: string) => void) {
        const walletStore: WalletStore = this.getStore('Wallet');
        const gasEstimation: PriceEstimation = new PriceEstimation();
        const contract: Contract = walletStore.getContract();
        const address: string = this.newOperatorKeys.address;

        return new Promise((resolve, reject) => {
            const transaction: INewOperatorTransaction = this.newOperatorKeys;
            this.newOperatorReceipt = null;

            // Send add operator transaction
            const payload = [
                transaction.name,
                transaction.pubKey,
                // @ts-ignore
                walletStore.web3.utils.toWei(roundCryptoValueString(transaction.fee)),
            ];
            console.debug('Register Operator Transaction Data:', payload);
            if (getGasEstimation) {
                contract.methods.registerOperator(...payload)
                    .estimateGas({ from: walletStore.accountAddress })
                    .then((gasAmount: any) => {
                        this.estimationGas = gasAmount * 0.000000001;
                        if (config.FEATURE.DOLLAR_CALCULATION) {
                            gasEstimation
                                .estimateGasInUSD(this.estimationGas)
                                .then((rate: number) => {
                                    this.dollarEstimationGas = this.estimationGas * rate * 0;
                                    resolve(true);
                                });
                        } else {
                            this.dollarEstimationGas = 0;
                            resolve(true);
                        }
                    }).catch((e: any) => {
                    console.log(e);
                });
            } else {
                contract.methods.registerOperator(...payload)
                    .send({ from: address })
                    .on('receipt', async (receipt: any) => {
                        // eslint-disable-next-line no-prototype-builtins
                        const event: boolean = receipt.hasOwnProperty('events');
                        if (event) {
                            console.debug('Contract Receipt', receipt);
                            this.newOperatorReceipt = receipt;
                            this.newOperatorRegisterSuccessfully = true;
                            resolve(event);
                        }
                    })
                    .on('transactionHash', (txHash: string) => {
                        callBack && callBack(txHash);
                    })
                    .on('error', (error: any) => {
                        console.debug('Contract Error', error);
                        reject(error);
                    });
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
     * Select operator
     * @param operator
     * @param selectedIndex
     */
    @action.bound
    selectOperator(operator: IOperator, selectedIndex: number) {
        this.selectedOperators[selectedIndex] = operator;
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

    /**
     * Automatically select necessary number of operators to reach gap requirements
     */
    @action.bound
    autoSelectOperators() {
        if (!this.operators.length) {
            return;
        }
        // Deselect already selected once
        this.unselectAllOperators();

        // Select as many as necessary so the gap would be reached
        let selectedIndex = 0;
        while (!this.selectedEnoughOperators) {
            this.operators[selectedIndex].selected = true;
            this.operators[selectedIndex].autoSelected = true;
            selectedIndex += 1;
        }
        this.operators = Array.from(this.operators);
    }

    @action.bound
    unselectAllOperators() {
      this.selectedOperators = {};
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
     * Check if selected necessary minimum of operators
     */
    @computed
    get selectedEnoughOperators(): boolean {
        return this.stats.selected >= config.FEATURE.OPERATORS.SELECT_MINIMUM_OPERATORS;
    }

    /**
     * Load operators from external source
     */
    @action.bound
    async loadOperators() {
        if (this.operators.length !== 0) return this.operators;
        this.loadingOperator = true;
    //     const query = `
    // {
    //   operators(first: ${config.FEATURE.OPERATORS.REQUEST_MINIMUM_OPERATORS}) {
    //     id
    //     name
    //     pubkey
    //     ownerAddress
    //   }
    // }`;
        // const operatorsEndpointUrl = `${String(process.env.REACT_APP_OPERATORS_ENDPOINT)}?randomize=true`;

        // const requestInfo: RequestData = {
        //     url: operatorsEndpointUrl,
        //     method: 'GET',
        //     headers: [
        //         { name: 'content-type', value: 'application/json' },
        //         { name: 'accept', value: 'application/json' },
        //     ],
        //     data: { query },
        // };
        this.operators = await Promise.all(operators.map(async (operator: any): Promise<any> => {
            const operatorsAdapted = this.operatorAdapter(operator);
            return operatorsAdapted;
        }));

        // @ts-ignore
        // this.operators = await new ApiRequest(requestInfo)
        //     .sendRequest()
        //     .then(async (response: any) => {
        //         this.loadingOperator = false;
        //         this.operatorsLoaded = true;
        //         this.operators = await Promise.all(operators.map(async (operator: any): Promise<any> => {
        //             const operatorsAdapted = this.operatorAdapter(operator);
        //             return operatorsAdapted;
        //         }));
        //         // const adaptedOperators = await Promise.all(response.operators.map(async (operator: any): Promise<any> => {
        //         //     const operatorsAdapted = this.operatorAdapter(operator);
        //         //     return operatorsAdapted;
        //         // }));
        //         return adaptedOperators;
        //     });
    }

    async operatorAdapter(_object: { name: any; owner_address: any; public_key: any; type: any; }) {
        // const walletStore: WalletStore = this.getStore('Wallet');
        const operatorFee = await this.setOperatorFee(_object.public_key);
        return {
            name: _object.name,
            ownerAddress: _object.owner_address,
            pubkey: _object.public_key,
            fee: operatorFee,
            verified: _object.type === 'verified_operator',
            dappNode: _object.type === 'dapp_node',
        };
    }
}

export default ContractOperator;
