import Decimal from 'decimal.js';
import { Contract } from 'ethers';
import { action, computed, makeObservable, observable } from 'mobx';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import ApiParams from '~lib/api/ApiParams';
import BaseStore from '~app/common/stores/BaseStore';
import { isMainnet, NETWORKS } from '~lib/utils/envHelper';
import { EContractName } from '~app/model/contracts.model';
import ContractEventGetter from '~lib/api/ContractEventGetter';
import { executeAfterEvent } from '~root/services/events.service';
import { fromWei, prepareSsvAmountToTransfer, toWei } from '~root/services/conversions.service';
import { getContractByName } from '~root/services/contracts.service';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { equalsAddresses } from '~lib/utils/strings';
import { store } from '~app/store';
import { setIsLoading, setIsShowTxPendingPopup, setTxHash } from '~app/redux/appState.slice';
import { IOperator } from '~app/model/operator.model';

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

class OperatorStore extends BaseStore {
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
    // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
    super();

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
      removeOperator: action.bound,
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
      getOperatorRevenue: action.bound,
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
      updateOperatorAddressWhitelist: observable,
      newOperatorRegisterSuccessfully: observable,
      updateOperatorValidatorsLimit: action.bound,
      hasOperatorReachedValidatorLimit: action.bound,
    });
  }

  /**
   * Updating operators and validators data
   * @param resolve
   * @param showError
   */
  async refreshOperatorsAndClusters(resolve: any, showError?: boolean) {
    const myAccountStore: MyAccountStore = this.getStore('MyAccount');
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    return Promise.all([
      myAccountStore.getOwnerAddressClusters({}),
      myAccountStore.getOwnerAddressOperators({}),
    ])
      .then(() => {
        store.dispatch(setIsLoading(false));
        store.dispatch(setIsShowTxPendingPopup(false));
        resolve(true);
      })
      .catch((error) => {
        store.dispatch(setIsLoading(false));
        if (showError) {
          notificationsStore.showMessage(error.message, 'error');
        }
        store.dispatch(setIsShowTxPendingPopup(false));
        resolve(false);
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

  /**
   * Check if selected necessary minimum of operators
   */
  get selectedEnoughOperators(): boolean {
    return this.stats.selected >= this.clusterSize;
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
    const operatorStore: OperatorStore = this.getStore('Operator');
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
      const testNets = [NETWORKS.GOERLI, NETWORKS.HOLESKY];
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

  /**
   * Check if operator is whitelisted
   * @param accountAddress queried account
   */
  async isOperatorWhitelisted(accountAddress: string): Promise<boolean> {
    if (!isMainnet) {
      return true;
    }
    const contract = getContractByName(EContractName.SETTER);
    try {
      const response = await contract.getRegisterAuth(accountAddress);
      return response.authOperators;
    }
  catch (e: any) {
    console.error(`Failed to check if operator ${accountAddress} is whitelisted: ${e.message}`);
    return false;
  }
}

  /**
   * update operator address whitelist
   */
  async updateOperatorAddressWhitelist(operatorId: string, address: string) {
    const myAccountStore: MyAccountStore = this.getStore('MyAccount');
    const notificationsStore: NotificationsStore = this.getStore('Notifications');

    return new Promise(async (resolve) => {
      try {
        const contractInstance = getContractByName(EContractName.SETTER);
        const tx = await contractInstance.setOperatorWhitelist(operatorId, address);
        if (tx.hash) {
          store.dispatch(setTxHash(tx.hash));
          store.dispatch(setIsShowTxPendingPopup(true));
        }
        const receipt = await tx.wait();
        if (receipt.blockHash) {
          const event: boolean = receipt.hasOwnProperty('events');
          if (event) {
            await executeAfterEvent(async () => {
              const operator = await Operator.getInstance().getOperator(operatorId);
              return equalsAddresses(operator.address_whitelist.toString(), address.toString());
            }, async () => this.refreshOperatorsAndClusters(resolve, true), myAccountStore.delay);
            store.dispatch(setIsLoading(false));
            store.dispatch(setIsShowTxPendingPopup(false));
            resolve(true);
          }
        }
      } catch (e: any) {
        console.debug('Contract Error', e.message);
        notificationsStore.showMessage(e.message, 'error');
        resolve(false);
      } finally {
        store.dispatch(setIsLoading(false));
        store.dispatch(setIsShowTxPendingPopup(false));
      }
    });
  }

  /**
   * Get operator balance
   */
  async getOperatorBalance(id: number): Promise<any> {
    return new Promise((resolve) => {
      const contract = getContractByName(EContractName.GETTER);
      contract.getOperatorEarnings(id).then((response: any) => {
        resolve(fromWei(response));
      }).catch(() => resolve(true));
    });
  }

  /**
   * Cancel change fee process for operator
   */
  async cancelChangeFeeProcess(operatorId: number): Promise<any> {
    const myAccountStore: MyAccountStore = this.getStore('MyAccount');
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    await this.syncOperatorFeeInfo(operatorId);
    const operatorDataBefore = {
      operatorFutureFee: this.operatorFutureFee,
      operatorApprovalEndTime: this.operatorApprovalEndTime,
      operatorApprovalBeginTime: this.operatorApprovalBeginTime,
    };
    return new Promise(async (resolve) => {
      try {
        const contract: Contract = getContractByName(EContractName.SETTER);
        const tx = await contract.cancelDeclaredOperatorFee(operatorId);
        if (tx.hash) {
          store.dispatch(setTxHash(tx.hash));
          store.dispatch(setIsShowTxPendingPopup(true));
        }
        const receipt = await tx.wait();
        if (receipt.blockHash) {
          const event: boolean = receipt.hasOwnProperty('events');
          if (event) {
            ApiParams.initStorage(true);
            console.debug('Contract Receipt', receipt);

            await executeAfterEvent(async () => await myAccountStore.checkEntityChangedInAccount(
              async () => {
                await this.syncOperatorFeeInfo(operatorId);
                return {
                  operatorFutureFee: this.operatorFutureFee,
                  operatorApprovalEndTime: this.operatorApprovalEndTime,
                  operatorApprovalBeginTime: this.operatorApprovalBeginTime,
                };
              },
              operatorDataBefore,
            ), async () => this.refreshOperatorsAndClusters(resolve, true), myAccountStore.delay);
          }
        }
      } catch (e: any) {
        notificationsStore.showMessage(e.message, 'error');
        resolve(false);
      } finally {
        store.dispatch(setIsLoading(false));
        store.dispatch(setIsShowTxPendingPopup(false));
      }
    });
  }

  /**
   * get validators of operator
   */
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

  /**
   * Get operator revenue
   */
  async getOperatorRevenue(operatorId: number): Promise<any> {
    try {
      const contract = getContractByName(EContractName.GETTER);
      const response = await contract.totalEarningsOf(operatorId);
      return fromWei(response.toString());
    } catch (e: any) {
      return 0;
    }
  }

  /**
   * Check if operator already exists in the contract
   * @param operatorId
   * @param newFee
   */
  async updateOperatorFee(operatorId: number, newFee: any): Promise<boolean> {
    const myAccountStore: MyAccountStore = this.getStore('MyAccount');
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    return new Promise(async (resolve) => {
      try {
        const contractInstance = getContractByName(EContractName.SETTER);
        const formattedFee = prepareSsvAmountToTransfer(
          toWei(
            new Decimal(newFee).dividedBy(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).toFixed().toString(),
          ),
        );
        await this.syncOperatorFeeInfo(operatorId);
        const operatorDataBefore = {
          operatorFutureFee: this.operatorFutureFee,
          operatorApprovalEndTime: this.operatorApprovalEndTime,
          operatorApprovalBeginTime: this.operatorApprovalBeginTime,
        };
        const tx = await contractInstance.declareOperatorFee(operatorId, formattedFee);
        if (tx.hash) {
          store.dispatch(setTxHash(tx.hash));
          store.dispatch(setIsShowTxPendingPopup(true));
        }
        const receipt = await tx.wait();
        if (receipt.blockHash) {
          const event: boolean = receipt.hasOwnProperty('events');
          if (event) {

            await executeAfterEvent(async () => await myAccountStore.checkEntityChangedInAccount(
              async () => {
                await this.syncOperatorFeeInfo(operatorId);
                return {
                  operatorFutureFee: this.operatorFutureFee,
                  operatorApprovalEndTime: this.operatorApprovalEndTime,
                  operatorApprovalBeginTime: this.operatorApprovalBeginTime,
                };
              },
              operatorDataBefore,
            ), async () => this.refreshOperatorsAndClusters(resolve, true), myAccountStore.delay);
          }
        }
      } catch (e: any) {
        console.debug('Contract Error', e.message);
        notificationsStore.showMessage(e.message, 'error');
        resolve(false);
      } finally {
        store.dispatch(setIsLoading(false));
        store.dispatch(setIsShowTxPendingPopup(false));
      }
    });
  }

  async decreaseOperatorFee(operatorId: number, newFee: any): Promise<boolean> {
    const myAccountStore: MyAccountStore = this.getStore('MyAccount');
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    return new Promise(async (resolve) => {
      try {
        const contractInstance = getContractByName(EContractName.SETTER);
        const formattedFee = prepareSsvAmountToTransfer(
          toWei(
            new Decimal(newFee).dividedBy(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).toFixed().toString(),
          ),
        );
        const { id, fee } = await Operator.getInstance().getOperator(operatorId);
        const operatorBefore = { id, fee };
        const tx = await contractInstance.reduceOperatorFee(operatorId, formattedFee);
        if (tx.hash) {
          store.dispatch(setTxHash(tx.hash));
          store.dispatch(setIsShowTxPendingPopup(true));
        }
        const receipt = await tx.wait();
        if (receipt.blockHash) {
          const event: boolean = receipt.hasOwnProperty('events');
          if (event) {
            await executeAfterEvent(async () => await myAccountStore.checkEntityChangedInAccount(
              async () => {
                const operatorAfter = await Operator.getInstance().getOperator(operatorId);
                return {
                  id: operatorAfter.id,
                  fee: operatorAfter.fee,
                };
              },
              operatorBefore,
            ), async () => this.refreshOperatorsAndClusters(resolve, true), myAccountStore.delay);
          }
        }
      } catch (e: any) {
        notificationsStore.showMessage(e.message, 'error');
        resolve(false);
      } finally {
        store.dispatch(setIsLoading(false));
        store.dispatch(setIsShowTxPendingPopup(false));
      }
    });
  }

  /**
   * Check if operator already exists in the contract
   * @param operatorId
   */
  async approveOperatorFee(operatorId: number): Promise<boolean> {
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    return new Promise(async (resolve) => {
      try {
        const myAccountStore: MyAccountStore = this.getStore('MyAccount');
        let operatorBefore = await Operator.getInstance().getOperator(operatorId);
        operatorBefore = {
          id: operatorBefore.id,
          declared_fee: operatorBefore.declared_fee,
          previous_fee: operatorBefore.previous_fee,
        };
        const contract = getContractByName(EContractName.SETTER);
        const tx = await contract.executeOperatorFee(operatorId);
        if (tx.hash) {
          store.dispatch(setTxHash(tx.hash));
          store.dispatch(setIsShowTxPendingPopup(true));
        }
        const receipt = await tx.wait();
        if (receipt.blockHash) {
          const event: boolean = receipt.hasOwnProperty('events');
          if (event) {

            await executeAfterEvent(async () => await myAccountStore.checkEntityChangedInAccount(
                async () => {
                  const operatorAfter = await Operator.getInstance().getOperator(operatorId);
                  return {
                    id: operatorAfter.id,
                    declared_fee: operatorAfter.declared_fee,
                    previous_fee: operatorAfter.previous_fee,
                  };
                },
                operatorBefore,
              ), async () => this.refreshOperatorsAndClusters(resolve, true), myAccountStore.delay);
          }
        }
      } catch (e: any) {
        notificationsStore.showMessage(e.message, 'error');
        resolve(false);
      } finally {
        store.dispatch(setIsLoading(false));
        store.dispatch(setIsShowTxPendingPopup(false));
      }
    });
  }

  /**
   * Remove Operator
   * @param operatorId
   */
  async removeOperator(operatorId: number): Promise<any> {
    const myAccountStore: MyAccountStore = this.getStore('MyAccount');
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    const contractInstance = getContractByName(EContractName.SETTER);
    return new Promise(async (resolve) => {
      try {
        const tx = await contractInstance.removeOperator(operatorId);
        if (tx.hash) {
          store.dispatch(setTxHash(tx.hash));
          store.dispatch(setIsShowTxPendingPopup(true));
        }
        const receipt = await tx.wait();
        if (receipt.blockHash) {
          const event: boolean = receipt.hasOwnProperty('events');
          if (event) {
            ApiParams.initStorage(true);
            await executeAfterEvent(async () => {
              console.log(await ContractEventGetter.getInstance().getEventByTxHash(receipt.transactionHash));
              return await ContractEventGetter.getInstance().getEventByTxHash(receipt.transactionHash);
            }, async () => this.refreshOperatorsAndClusters(resolve, true), myAccountStore.delay);
          }
        }
      } catch (e: any) {
        notificationsStore.showMessage(e.message, 'error');
        return false;
      } finally {
        store.dispatch(setIsLoading(false));
        store.dispatch(setIsShowTxPendingPopup(false));
      }
    });
  }

  async addNewOperator() {
    const myAccountStore: MyAccountStore = this.getStore('MyAccount');
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    return new Promise(async (resolve, reject) => {
      try {
        const payload: any[] = [];
        const contract: Contract = getContractByName(EContractName.SETTER);
        const transaction: NewOperator = this.newOperatorKeys;
        const feePerBlock = new Decimal(transaction.fee).dividedBy(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).toFixed().toString();

        // Send add operator transaction
        payload.push(transaction.publicKey, prepareSsvAmountToTransfer(toWei(feePerBlock)));
        try {
          const tx = await contract.registerOperator(...payload);
          if (tx.hash) {
            store.dispatch(setTxHash(tx.hash));
            store.dispatch(setIsShowTxPendingPopup(true));
          }
          const receipt = await tx.wait();
          if (receipt.blockHash) {
            await executeAfterEvent(async () =>  !!await ContractEventGetter.getInstance().getEventByTxHash(receipt.transactionHash), async () => this.refreshOperatorsAndClusters(resolve, true), myAccountStore.delay);
            resolve(true);
          }
        } catch (err: any) {
          console.error(`Error during setting fee recipient: ${err.message}`);
          notificationsStore.showMessage(err.message, 'error');
          resolve(false);
        }
      } catch (e) {
        reject(false);
      } finally {
        store.dispatch(setIsShowTxPendingPopup(false));
      }
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

