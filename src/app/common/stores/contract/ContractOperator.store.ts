import { Contract } from 'web3-eth-contract';
import { action, observable, computed } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import ApiRequest, { RequestData } from '~lib/utils/ApiRequest';
import PriceEstimation from '~lib/utils/contract/PriceEstimation';
import ApplicationStore from '~app/common/stores/Application.store';
import NotificationsStore from '~app/common/stores/Notifications.store';

export interface INewOperatorTransaction {
  name: string,
  pubKey: string,
}

export interface IOperator {
  name: string,
  pubkey: string,
  paymentAddress?: string,
  score?: number,
  selected?: boolean
  autoSelected?: boolean
}

class ContractOperator extends BaseStore {
  public static OPERATORS_SELECTION_GAP = 66.66;

  @observable operators: IOperator[] = [];
  @observable operatorsLoaded: boolean = false;

  @observable addingNewOperator: boolean = false;
  @observable newOperatorReceipt: any = null;

  @observable newOperatorKeys: INewOperatorTransaction = { name: '', pubKey: '' };
  @observable newOperatorRegisterSuccessfully: boolean = false;

  @observable estimationGas: number = 0;
  @observable dollarEstimationGas: number = 0;

  /**
   * Set operator keys
   * @param transaction
   */
  @action.bound
  setOperatorKeys(transaction: INewOperatorTransaction) {
    this.newOperatorKeys = { pubKey: transaction.pubKey, name: transaction.name };
  }

  @action.bound
  setAddingNewOperator(status: boolean) {
    this.addingNewOperator = status;
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
      await walletStore.connect();
      const contractInstance = contract ?? await walletStore.getContract();
      const encodeOperatorKey = await walletStore.encodeOperatorKey(publicKey);
      this.setOperatorKeys({ name: this.newOperatorKeys.name, pubKey: encodeOperatorKey });
      const result = await contractInstance.methods.operators(encodeOperatorKey).call({ from: walletStore.accountAddress });
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
  async addNewOperator(getGasEstimation: boolean = false) {
    const walletStore: WalletStore = this.getStore('Wallet');
    const applicationStore: ApplicationStore = this.getStore('Application');
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    const gasEstimation: PriceEstimation = new PriceEstimation();
    const contract: Contract = await walletStore.getContract();
    const address: string = walletStore.accountAddress;
    applicationStore.setIsLoading(true);

    return new Promise((resolve, reject) => {
      if (!walletStore.checkIfWalletReady()) {
        applicationStore.setIsLoading(false);
        reject();
      }

      const transaction: INewOperatorTransaction = this.newOperatorKeys;
      this.newOperatorReceipt = null;
      this.setAddingNewOperator(true);

      // Send add operator transaction
      const payload = [
        transaction.name,
        address,
        transaction.pubKey,
      ];
      console.debug('Register Operator Transaction Data:', payload);

      if (getGasEstimation) {
        contract.methods.addOperator(...payload)
          .estimateGas({ from: address })
          .then((gasAmount: any) => {
            this.setAddingNewOperator(true);
            this.estimationGas = gasAmount * 0.000000001;
            if (config.FEATURE.DOLLAR_CALCULATION) {
              gasEstimation
                  .estimateGasInUSD(this.estimationGas)
                  .then((rate: number) => {
                    this.dollarEstimationGas = this.estimationGas * rate;
                    resolve(true);
                  })
                  .catch((error: any) => {
                    applicationStore.displayUserError(error);
                  });
            } else {
              this.dollarEstimationGas = this.estimationGas * 3377;
              resolve(true);
            }
          })
          .catch((error: any) => {
            applicationStore.displayUserError(error);
          });
      } else {
        contract.methods.addOperator(...payload)
          .send({ from: address })
          .on('receipt', async (receipt: any) => {
            const event: boolean = 'OperatorAdded' in receipt.events;
            if (event) {
              console.debug('Contract Receipt', receipt);
              this.newOperatorReceipt = receipt;
              applicationStore.setIsLoading(false);
              this.newOperatorRegisterSuccessfully = true;
              resolve(event);
            }
          })
          .on('error', (error: any) => {
            this.setAddingNewOperator(false);
            notificationsStore.showMessage(error.message, 'error');
            console.debug('Contract Error', error);
            applicationStore.setIsLoading(false);
            reject(error);
          });
      }
    });
  }

  /**
   * Find operator by publicKey
   * @param publicKey
   */
  findOperator(publicKey: string): { operator: IOperator | null, index: number } {
    for (let i = 0; i < this.operators?.length || 0; i += 1) {
      if (this.operators[i].pubkey === publicKey) {
        return { operator: this.operators[i], index: i };
      }
    }
    return { operator: null, index: -1 };
  }

  /**
   * Check if operator is selected
   * @param publicKey
   */
  @action.bound
  isOperatorSelected(publicKey: string): boolean {
    const { operator } = this.findOperator(publicKey);
    return operator ? Boolean(operator.selected) : false;
  }

  /**
   * Unselect operator
   * @param publicKey
   */
  @action.bound
  unselectOperator(publicKey: string) {
    if (this.isOperatorSelected(publicKey)) {
      const { operator, index } = this.findOperator(publicKey);
      if (operator) {
        operator.selected = false;
        operator.autoSelected = false;
        this.operators[index] = operator;
        this.operators = Array.from(this.operators);
      }
    }
  }

  /**
   * Select operator
   * @param publicKey
   */
  @action.bound
  selectOperator(publicKey: string) {
    const { operator, index } = this.findOperator(publicKey);
    if (operator) {
      operator.selected = true;
      operator.autoSelected = false;
      this.operators[index] = operator;
      this.operators = Array.from(this.operators);
    }
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
    for (let i = 0; i < this.operators.length; i += 1) {
      this.operators[i].selected = false;
      this.operators[i].autoSelected = false;
    }
    this.operators = Array.from(this.operators);
  }

  /**
   * Get selection stats
   */
  @computed
  get stats(): { total: number, selected: number, selectedPercents: number } {
    const selected = this.operators.filter((op: IOperator) => op.selected).length;
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
    const query = `
    {
      operators(first: ${config.FEATURE.OPERATORS.REQUEST_MINIMUM_OPERATORS}) {
        id
        name
        pubkey
      }
    }`;
    const operatorsEndpointUrl = String(process.env.REACT_APP_OPERATORS_ENDPOINT);

    const requestInfo: RequestData = {
      url: operatorsEndpointUrl,
      method: 'POST',
      headers: [
        { name: 'content-type', value: 'application/json' },
        { name: 'accept', value: 'application/json' },
      ],
      data: { query },
    };
    this.operators = await new ApiRequest(requestInfo)
      .sendRequest()
      .then((response: any) => {
        this.operatorsLoaded = true;
        return response.data?.operators ?? [];
      });
  }
}

export default ContractOperator;
