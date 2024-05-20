import Decimal from 'decimal.js';
import { Contract } from 'ethers';
import { action, computed, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import { EContractName } from '~app/model/contracts.model';
import { fromWei, prepareSsvAmountToTransfer, toWei } from '~root/services/conversions.service';
import { getContractByName } from '~root/services/contracts.service';
import { getStoredNetwork, testNets } from '~root/providers/networkInfo.provider';
import { IOperator } from '~app/model/operator.model';
import { transactionExecutor } from '~root/services/transaction.service';

export interface Operators {
  [page: number]: OperatorFee;
}

interface OperatorFee {
  ssv: number;
  dollar: number;
}

interface OperatorsFees {
  [publicKey: string]: OperatorFee;
}

class OperatorStore {
  // Process data
  processOperatorId = 0;

  operators: IOperator[] = [];
  operatorsFees: OperatorsFees = {};
  selectedOperators = new Map<string, IOperator>();

  // Operator update fee process
  maxFeeIncrease = 0;
  operatorCurrentFee: null | number = null;
  operatorFutureFee: null | number = null;
  getSetOperatorFeePeriod: null | number = null;
  operatorApprovalEndTime: null | number = null;
  declaredOperatorFeePeriod: null | number = null;
  operatorApprovalBeginTime: null | number = null;

  estimationGas = 0;
  dollarEstimationGas = 0;

  loadingOperators = false;

  operatorValidatorsLimit: number = 0;
  maxOperatorFeePerYear: number = 0;
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
      clearSettings: action.bound,
      setClusterSize: action.bound,
      getOperatorFee: action.bound,
      loadingOperators: observable,
      selectOperator: action.bound,
      processOperatorId: observable,
      selectedOperators: observable,
      operatorFutureFee: observable,
      selectOperators: action.bound,
      operatorCurrentFee: observable,
      unselectOperator: action.bound,
      dollarEstimationGas: observable,
      updateOperatorFee: action.bound,
      syncOperatorFeeInfo: action.bound,
      isOperatorSelected: action.bound,
      getSelectedOperatorsFee: computed,
      maxOperatorFeePerYear: observable,
      selectedEnoughOperators: computed,
      unselectAllOperators: action.bound,
      clearOperatorFeeInfo: action.bound,
      operatorValidatorsLimit: observable,
      getSetOperatorFeePeriod: observable,
      operatorApprovalEndTime: observable,
      cancelChangeFeeProcess: action.bound,
      declaredOperatorFeePeriod: observable,
      operatorApprovalBeginTime: observable,
      unselectOperatorByPublicKey: action.bound,
      updateOperatorValidatorsLimit: action.bound,
      hasOperatorReachedValidatorLimit: action.bound
    });
  }

  clearOperatorFeeInfo() {
    this.operatorFutureFee = null;
    this.operatorApprovalBeginTime = null;
    this.operatorApprovalEndTime = null;
  }

  get getSelectedOperatorsFee(): number {
    let fee = 0;
    this.selectedOperators.forEach((operator) => {
      fee = fee + fromWei(operator.fee);
    });
    return fee;
  }

  get selectedEnoughOperators(): boolean {
    return this.stats.selected >= this.clusterSize;
  }

  /**
   * Get selection stats
   */
  get stats(): { total: number; selected: number; selectedPercents: number } {
    const selected = this.selectedOperators.size;
    return {
      selected,
      total: this.operators.length,
      selectedPercents: (selected / this.operators.length) * 100.0
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
   * Get max operator fee
   */
  async updateOperatorMaxFee(): Promise<void> {
    const contract = getContractByName(EContractName.GETTER);
    if (!contract) {
      return;
    }
    try {
      if (this.maxOperatorFeePerYear === 0) {
        const res =  await contract.getMaximumOperatorFee();
        this.maxOperatorFeePerYear = Number(fromWei(res));
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
      return {
        operatorFutureFee: this.operatorFutureFee,
        operatorApprovalBeginTime: this.operatorApprovalBeginTime,
        operatorApprovalEndTime: this.operatorApprovalEndTime
      };
    } catch (e: any) {
      console.error(`Failed to get operator fee details from the contract: ${e.message}`);
      this.clearOperatorFeeInfo();
    }
  }

  async cancelChangeFeeProcess({ operator, isContractWallet, dispatch }: { operator: IOperator; isContractWallet: boolean; dispatch: Function }): Promise<boolean> {
    const contract: Contract = getContractByName(EContractName.SETTER);
    if (!contract) {
      return false;
    }

    return await transactionExecutor({
      contractMethod: contract.cancelDeclaredOperatorFee,
      payload: [operator.id],
      isContractWallet,
      getterTransactionState: async () => await this.syncOperatorFeeInfo(operator.id),
      prevState: await this.syncOperatorFeeInfo(operator.id),
      dispatch
    });
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

  async updateOperatorFee({ operator, newFee, isContractWallet, dispatch }: { operator: IOperator; newFee: any; isContractWallet: boolean; dispatch: Function }): Promise<boolean> {
    const contract: Contract = getContractByName(EContractName.SETTER);
    if (!contract) {
      return false;
    }
    const formattedFee = prepareSsvAmountToTransfer(toWei(new Decimal(newFee).dividedBy(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).toFixed().toString()));

    return await transactionExecutor({
      contractMethod: contract.declareOperatorFee,
      payload: [operator.id, formattedFee],
      isContractWallet,
      getterTransactionState: async () => await this.syncOperatorFeeInfo(operator.id),
      prevState: await this.syncOperatorFeeInfo(operator.id),
      dispatch
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
  unselectOperatorByPublicKey(operator: IOperator) {
    this.selectedOperators.delete(`${operator.id}`);
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

  selectOperators(operators: IOperator[]) {
    operators
      .sort((operator: IOperator) => operator.id)
      .forEach((value: IOperator, index: number) => {
        this.selectedOperators.set(`${index}`, value);
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

export const operatorStore = new OperatorStore();
export default OperatorStore;
