import Decimal from 'decimal.js';
import { Contract } from 'ethers';
import { action, computed, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import { EContractName } from '~app/model/contracts.model';
import { fromWei, prepareSsvAmountToTransfer, toWei } from '~root/services/conversions.service';
import { getContractByName } from '~root/services/contracts.service';
import { getStoredNetwork, testNets } from '~root/providers/networkInfo.provider';
import { IOperator } from '~app/model/operator.model';
import { getOperator } from '~root/services/operator.service';
import { transactionExecutor } from '~root/services/transaction.service';
import { getEventByTxHash } from '~root/services/contractEvent.service';
import { rootStore } from '~root/stores.ts';

export interface NewOperator {
  id: number,
  fee: number,
  publicKey: string,
  address: string,
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

class OperatorStore {
  // Process data
  processOperatorId: number = 0;

  // Cancel dialog switcher
  openCancelDialog: boolean = false;

  operators: IOperator[] = [];
  operatorsFees: OperatorsFees = {};
  selectedOperators: SelectedOperators = {};

  // Operator update fee process
  maxFeeIncrease: number = 0;
  operatorCurrentFee: null | number = null;
  operatorFutureFee: null | number = null;
  getSetOperatorFeePeriod: null | number = null;
  operatorApprovalEndTime: null | number = null;
  declaredOperatorFeePeriod: null | number = null;
  operatorApprovalBeginTime: null | number = null;

  newOperatorKeys: NewOperator = { publicKey: '', address: '', fee: 0, id: 0 };
  newOperatorRegisterSuccessfully: string = '';

  estimationGas: number = 0;
  dollarEstimationGas: number = 0;

  loadingOperators: boolean = false;

  operatorValidatorsLimit: number = 0;
  clusterSize: number = 4;

  constructor() {
    makeObservable(this, {
      stats: computed,
      operators: observable,
      initUser: action.bound,
      clusterSize: observable,
      operatorsFees: observable,
      estimationGas: observable,
      maxFeeIncrease: observable,
      newOperatorKeys: observable,
      clearSettings: action.bound,
      setClusterSize: action.bound,
      openCancelDialog: observable,
      getOperatorFee: action.bound,
      loadingOperators: observable,
      addNewOperator: action.bound,
      selectOperator: action.bound,
      processOperatorId: observable,
      selectedOperators: observable,
      setOperatorKeys: action.bound,
      operatorFutureFee: observable,
      selectOperators: action.bound,
      operatorCurrentFee: observable,
      unselectOperator: action.bound,
      clearOperatorData: action.bound,
      dollarEstimationGas: observable,
      updateOperatorFee: action.bound,
      approveOperatorFee: action.bound,
      switchCancelDialog: action.bound,
      syncOperatorFeeInfo: action.bound,
      isOperatorSelected: action.bound,
      getSelectedOperatorsFee: computed,
      selectedEnoughOperators: computed,
      unselectAllOperators: action.bound,
      clearOperatorFeeInfo: action.bound,
      operatorValidatorsLimit: observable,
      getSetOperatorFeePeriod: observable,
      operatorApprovalEndTime: observable,
      cancelChangeFeeProcess: action.bound,
      declaredOperatorFeePeriod: observable,
      operatorApprovalBeginTime: observable,
      getOperatorValidatorsCount: action.bound,
      unselectOperatorByPublicKey: action.bound,
      refreshAndGetOperatorFeeInfo: action.bound,
      newOperatorRegisterSuccessfully: observable,
      updateOperatorValidatorsLimit: action.bound,
      hasOperatorReachedValidatorLimit: action.bound,
    });
  }

  clearOperatorFeeInfo() {
    this.operatorFutureFee = null;
    this.operatorApprovalBeginTime = null;
    this.operatorApprovalEndTime = null;
  }

  get getSelectedOperatorsFee(): number {
    return Object.values(this.selectedOperators).reduce(
      (previousValue: number, currentValue: IOperator) => previousValue + fromWei(currentValue.fee),
      0,
    );
  }

  get selectedEnoughOperators(): boolean {
    return this.stats.selected >= this.clusterSize;
  }

  async refreshAndGetOperatorFeeInfo(id: number) {
    await this.syncOperatorFeeInfo(id);
    return {
      operatorFutureFee: this.operatorFutureFee,
      operatorApprovalBeginTime: this.operatorApprovalBeginTime,
      operatorApprovalEndTime: this.operatorApprovalEndTime,
    };
  }

  /**
   * Get selection stats
   */
  get stats(): { total: number, selected: number, selectedPercents: number } {
    const selected = Object.values(this.selectedOperators).length;
    return {
      selected,
      total: this.operators.length,
      selectedPercents: ((selected / this.operators.length) * 100.0),
    };
  }

  /**
   * Get max validators count
   */
  async updateOperatorValidatorsLimit(): Promise<void> {
    const contract = getContractByName(EContractName.GETTER);
    if (!contract) {
      return;
    }
    try {
      if (this.operatorValidatorsLimit === 0) {
        this.operatorValidatorsLimit = await contract.getValidatorsPerOperatorLimit();
      }
    } catch (e) {
      console.error('Provided contract address is wrong', e);
    }
  }

  /**
   * Check if operator registrable
   */
  hasOperatorReachedValidatorLimit(validatorsRegisteredCount: number): boolean {
    // return this.operatorValidatorsLimit <= validatorsRegisteredCount + config.GLOBAL_VARIABLE.OPERATOR_VALIDATORS_LIMIT_PRESERVE;
    return this.operatorValidatorsLimit <= validatorsRegisteredCount;
  }

  /**
   * Check if operator registrable
   */
  switchCancelDialog() {
    this.openCancelDialog = !this.openCancelDialog;
  }

  /**
   * Check if operator registrable
   */
  async initUser() {
    const contract = getContractByName(EContractName.GETTER);
    if (!contract) return;
    const { declareOperatorFeePeriod, executeOperatorFeePeriod } = await contract.getOperatorFeePeriods();
    this.getSetOperatorFeePeriod = Number(executeOperatorFeePeriod);
    this.declaredOperatorFeePeriod = Number(declareOperatorFeePeriod);
    this.maxFeeIncrease = Number(await contract.getOperatorFeeIncreaseLimit()) / 100;
  }

  /**
   * Check if operator registrable
   */
  clearSettings() {
    this.maxFeeIncrease = 0;
    this.operatorFutureFee = null;
    this.operatorCurrentFee = null;
    this.getSetOperatorFeePeriod = null;
    this.operatorApprovalEndTime = null;
    this.declaredOperatorFeePeriod = null;
    this.operatorApprovalBeginTime = null;
    this.clearOperatorData();
  }

  /**
   * Retrieves the operator id
   */
  get getOperatorId(): number {
    const operatorStore: OperatorStore = rootStore.Operator;
    return operatorStore.newOperatorKeys.id;
  }

  /**
   * Check if operator registrable
   */
  async syncOperatorFeeInfo(operatorId: number) {
    const contract = getContractByName(EContractName.GETTER);
    try {
      this.operatorCurrentFee = await contract.getOperatorFee(operatorId);
      const response = await contract.getOperatorDeclaredFee(operatorId);
      if (response['0'] && testNets.indexOf(getStoredNetwork().networkId) !== -1) {
        this.operatorFutureFee = response['1'];
        this.operatorApprovalBeginTime = response['2'];
        this.operatorApprovalEndTime = response['3'];
      } else {
        this.operatorFutureFee = response['0'] === '0' ? null : response['0'];
        this.operatorApprovalBeginTime = response['1'] === '1' ? null : response['1'];
        this.operatorApprovalEndTime = response['2'] === '2' ? null : response['2'];
      }
    } catch (e: any) {
      console.error(`Failed to get operator fee details from the contract: ${e.message}`);
      this.clearOperatorFeeInfo();
    }
  }

  async cancelChangeFeeProcess({ operator, isContractWallet, dispatch }: { operator: IOperator, isContractWallet: boolean; dispatch: Function }): Promise<any> {
    const contract: Contract = getContractByName(EContractName.SETTER);
    if (!contract) {
      return false;
    }

    return await transactionExecutor({
      contractMethod: contract.cancelDeclaredOperatorFee,
      payload: [operator.id],
      isContractWallet,
      getterTransactionState: async () => await this.refreshAndGetOperatorFeeInfo(operator.id),
      prevState: await this.refreshAndGetOperatorFeeInfo(operator.id),
      dispatch,
    });
  }

  async getOperatorValidatorsCount(operatorId: number): Promise<any> {
    return new Promise((resolve) => {
      const contract = getContractByName(EContractName.GETTER);
      contract.validatorsPerOperatorCount(operatorId).then((response: any) => {
        resolve(response);
      });
    });
  }

  /**
   * clear operator store
   */
  clearOperatorData() {
    this.newOperatorKeys = {
      fee: 0,
      id: 0,
      publicKey: '',
      address: '',
    };
    this.newOperatorRegisterSuccessfully = '';
  }

  /**
   * Set operator keys
   * @param publicKey
   */
  async getOperatorFee(publicKey: string): Promise<any> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      try {
        const contract = getContractByName(EContractName.GETTER);
        contract.getOperatorFee(publicKey).then((response: any) => {
          const ssv = fromWei(response);
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
  setOperatorKeys(transaction: NewOperator) {
    this.newOperatorKeys = transaction;
  }

  async updateOperatorFee({ operator, newFee, isContractWallet, dispatch }: {
    operator: IOperator,
    newFee: any,
    isContractWallet: boolean,
    dispatch: Function,
  }): Promise<boolean> {
    const contract: Contract = getContractByName(EContractName.SETTER);
    if (!contract) {
      return false;
    }
    const formattedFee = prepareSsvAmountToTransfer(
      toWei(
        new Decimal(newFee).dividedBy(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).toFixed().toString(),
      ),
    );

    return await transactionExecutor({
      contractMethod: contract.declareOperatorFee,
      payload: [operator.id, formattedFee],
      isContractWallet,
      getterTransactionState: async () => await this.refreshAndGetOperatorFeeInfo(operator.id),
      prevState: await this.refreshAndGetOperatorFeeInfo(operator.id),
      dispatch,
    });
  }

  async decreaseOperatorFee({ operator, newFee, isContractWallet, dispatch }: {
    operator: IOperator,
    newFee: any,
    isContractWallet: boolean,
    dispatch: Function,
  }): Promise<boolean> {
    const contract: Contract = getContractByName(EContractName.SETTER);
    if (!contract) {
      return false;
    }
    const formattedFee = prepareSsvAmountToTransfer(toWei(new Decimal(newFee).dividedBy(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).toFixed().toString()));

    return await transactionExecutor({
      contractMethod: contract.reduceOperatorFee,
      payload: [operator.id, formattedFee],
      isContractWallet,
      getterTransactionState: async () => {
        const { id, fee } = await getOperator(operator.id);
        return { id, fee };
      },
      prevState: { id: operator.id, fee: operator.fee },
      dispatch,
    });
  }

  async approveOperatorFee({ operator, isContractWallet, dispatch }: {
    operator: IOperator,
    isContractWallet: boolean,
    dispatch: Function,
  }): Promise<boolean> {
    const contract: Contract = getContractByName(EContractName.SETTER);
    if (!contract) {
      return false;
    }

    return await transactionExecutor({
      contractMethod: contract.executeOperatorFee,
      payload: [operator.id],
      isContractWallet,
      getterTransactionState: async () => {
        const { id, fee } = await getOperator(operator.id);
        return { id, fee };
      },
      prevState: {
        id: operator.id,
        fee: operator.fee,
      },
      dispatch,
    });
  }

  async addNewOperator(isContractWallet: boolean, dispatch: Function) {
    const contract: Contract = getContractByName(EContractName.SETTER);
    if (!contract) {
      return false;
    }
    const transaction: NewOperator = this.newOperatorKeys;
    const feePerBlock = new Decimal(transaction.fee).dividedBy(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).toFixed().toString();

    return await transactionExecutor({
      contractMethod: contract.registerOperator,
      payload: [transaction.publicKey, prepareSsvAmountToTransfer(toWei(feePerBlock))],
      isContractWallet,
      getterTransactionState: async (txHash: string) => (await getEventByTxHash(txHash)).data,
      dispatch,
    });
  }

  /**
   * Unselect operator
   * @param index
   */
  unselectOperator(index: number) {
    delete this.selectedOperators[index];
  }

  /**
   * Unselect operator by public_key
   */
  unselectOperatorByPublicKey(operator: any) {
    Object.keys(this.selectedOperators).forEach((index) => {
      if (this.selectedOperators[index].id === operator.id) {
        delete this.selectedOperators[index];
      }
    });
  }

  selectOperator(operator: IOperator, selectedIndex: number, clusterBox: number[]) {
    let operatorExist = false;
    // eslint-disable-next-line no-restricted-syntax
    for (const index of clusterBox) {
      if (this.selectedOperators[index]?.address + this.selectedOperators[index]?.id === operator.address + operator.id) {
        operatorExist = true;
      }
    }
    if (!operatorExist) this.selectedOperators[selectedIndex] = operator;
  }

  /**
   * Select operator
   * @param operators
   */
  selectOperators(operators: IOperator[]) {
    this.selectedOperators = {};
    operators.sort((operator: IOperator) => operator.id).forEach((value: IOperator, index: number) => {
      this.selectedOperators[index] = value;
    });
  }

  /**
   * Check if operator selected
   * @param id
   */
  isOperatorSelected(id: number): boolean {
    let exist = false;
    Object.values(this.selectedOperators).forEach((operator: IOperator) => {
      if (operator.id === id) exist = true;
    });

    return exist;
  }

  unselectAllOperators() {
    this.selectedOperators = {};
  }

  setClusterSize(size: number) {
    this.clusterSize = size;
  }
}

export default OperatorStore;

