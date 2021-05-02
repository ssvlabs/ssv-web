import { Contract } from 'web3-eth-contract';
import { action, observable, computed } from 'mobx';
import config from '~app/common/config';
import WalletStore from '~app/common/stores/Wallet.store';
import StoresProvider from '~app/common/stores/StoresProvider';
import NotificationsStore from '~app/common/stores/Notifications.store';

export interface INewOperatorTransaction {
  name: string,
  pubKey: string,
}

export interface INewValidatorTransaction {

}

export interface IOperator {
  name: string,
  publicKey: string,
  score: number,
  selected: boolean
  autoSelected: boolean
}

class SSVStore {
  public static OPERATORS_SELECTION_GAP = 66.66;

  protected wallet: WalletStore;
  protected notifications: NotificationsStore;

  @observable validatorPrivateKey: string = '';

  @observable operators: IOperator[] = [];
  @observable loadingOperators: boolean = false;

  @observable addingNewOperator: boolean = false;
  @observable newOperatorReceipt: any = null;

  @observable addingNewValidator: boolean = false;
  @observable newValidatorReceipt: any = null;

  constructor() {
    const storesProvider = StoresProvider.getInstance();
    this.wallet = storesProvider.getStore('wallet');
    this.notifications = storesProvider.getStore('notifications');
  }

  @action.bound
  async addNewValidator() {
    try {
      await this.wallet.connect();
      if (this.wallet.ready) {
        this.newValidatorReceipt = null;
        this.addingNewValidator = true;

        const encryptedKeys: string[] = [];

        console.debug('Register Validator Transaction Data:', {
          encryptedKeys,
        });

        return; // TODO: uncomment
        const contract: Contract = this.wallet.getContract();
        const address: string = await this.wallet.getUserAccount();

        // TODO: split shares
        // TODO: encode shares

        // Send add operator transaction
        contract.methods
          .addValidator(
            // TODO: provide all params
          )
          .send({ from: address })
          .on('receipt', (receipt: any) => {
            console.debug('Contract Receipt', receipt);
            this.newValidatorReceipt = receipt;
          })
          .on('error', (error: any) => {
            this.addingNewValidator = false;
            this.notifications.showMessage(error.message, 'error');
            console.debug('Contract Error', error);
          })
          .catch((error: any) => {
            this.addingNewValidator = false;
            if (error) {
              this.notifications.showMessage(error.message, 'error');
            }
            console.debug('Contract Error', error);
          });

        // Listen for final event when it's added
        contract.events
          .ValidatorAdded({}, (error: any, event: any) => {
            this.addingNewValidator = false;
            if (error) {
              this.notifications.showMessage(error.message, 'error');
            } else {
              this.notifications.showMessage('You successfully added validator!', 'success');
            }
            console.debug({ error, event });
          })
          .on('error', (error: any, receipt: any) => {
            if (error) {
              this.notifications.showMessage(error.message, 'error');
            }
            console.debug({ error, receipt });
          });
      }
    } catch (error) {
      console.error('Register Validator Error:', error);
      this.notifications.showMessage(error.message, 'error');
      this.addingNewValidator = false;
    }
  }

  @action.bound
  async addNewOperator(transaction: INewOperatorTransaction) {
    try {
      await this.wallet.connect();
      if (this.wallet.ready) {
        this.newOperatorReceipt = null;
        this.addingNewOperator = true;

        console.debug('Register Operator Transaction Data:', transaction);
        const contract: Contract = this.wallet.getContract();
        const address: string = await this.wallet.getUserAccount();

        // Send add operator transaction
        contract.methods
          .addOperator(
            transaction.name,
            transaction.pubKey,
            config.CONTRACT.PAYMENT_ADDRESS,
          )
          .send({ from: address })
          .on('receipt', (receipt: any) => {
            console.debug('Contract Receipt', receipt);
            this.newOperatorReceipt = receipt;
          })
          .on('error', (error: any) => {
            this.addingNewOperator = false;
            this.notifications.showMessage(error.message, 'error');
            console.debug('Contract Error', error);
          })
          .catch((error: any) => {
            this.addingNewOperator = false;
            if (error) {
              this.notifications.showMessage(error.message, 'error');
            }
            console.debug('Contract Error', error);
          });

        // Listen for final event when it's added
        contract.events
          .OperatorAdded({}, (error: any, event: any) => {
            this.addingNewOperator = false;
            if (error) {
              this.notifications.showMessage(error.message, 'error');
            } else {
              this.notifications.showMessage('You successfully added operator!', 'success');
            }
            console.debug({ error, event });
          })
          .on('error', (error: any, receipt: any) => {
            if (error) {
              this.notifications.showMessage(error.message, 'error');
            }
            console.debug({ error, receipt });
          });
      }
    } catch (error: any) {
      console.error('Register Operator Error:', error);
      this.notifications.showMessage(error.message, 'error');
      this.addingNewOperator = false;
    }
  }

  @action.bound
  setValidatorPrivateKey(validatorPrivateKey: string) {
    this.validatorPrivateKey = validatorPrivateKey;
  }

  /**
   * Find operator by publicKey
   * @param publicKey
   */
  findOperator(publicKey: string): { operator: IOperator | null, index: number } {
    for (let i = 0; i < this.operators?.length || 0; i += 1) {
      if (this.operators[i].publicKey === publicKey) {
        return { operator: this.operators[i], index: i };
      }
    }
    return { operator: null, index: -1 };
  }

  @action.bound
  isOperatorSelected(publicKey: string): boolean {
    const { operator } = this.findOperator(publicKey);
    return operator ? operator.selected : false;
  }

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
    for (let i = 0; i < this.operators.length; i += 1) {
      this.operators[i].selected = false;
      this.operators[i].autoSelected = false;
    }

    // Select as many as necessary so the gap would be reached
    let selectedIndex = 0;
    let selectedPercents = 0.0;
    while (selectedPercents < SSVStore.OPERATORS_SELECTION_GAP) {
      this.operators[selectedIndex].selected = true;
      this.operators[selectedIndex].autoSelected = true;
      selectedPercents = (((selectedIndex + 1) / this.operators.length) * 100.0);
      selectedIndex += 1;
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
    return this.stats.selectedPercents >= SSVStore.OPERATORS_SELECTION_GAP;
  }

  @action.bound
  async loadOperators() {
    this.loadingOperators = true;
    return new Promise((resolve => {
      setTimeout(() => {
        const operators = [
          {
            name: 'Operator #1',
            publicKey: '0x1a1b7a4e12a5554bf00d74d0a4df5ef7420599574ee3eca102aee47bc14d56692',
            score: 0.1,
            selected: false,
            autoSelected: false,
          },
          {
            name: 'Operator #2',
            publicKey: '0x2a1b7a4e12a5554bf00d74d0a4df5ef7420599574ee3eca102aee47bc14d56692',
            score: 0.2,
            selected: false,
            autoSelected: false,
          },
          {
            name: 'Operator #3',
            publicKey: '0x3a1b7a4e12a5554bf00d74d0a4df5ef7420599574ee3eca102aee47bc14d56692',
            score: 0.9,
            selected: false,
            autoSelected: false,
          },
          {
            name: 'Operator #4',
            publicKey: '0x4a1b7a4e12a5554bf00d74d0a4df5ef7420599574ee3eca102aee47bc14d56692',
            score: 0.4,
            selected: false,
            autoSelected: false,
          },
          {
            name: 'Operator #5',
            publicKey: '0x5a1b7a4e12a5554bf00d74d0a4df5ef7420599574ee3eca102aee47bc14d56692',
            score: 0.7,
            selected: false,
            autoSelected: false,
          },
        ];

        this.operators = operators.sort((a, b) => {
          if (a.score > b.score) return -1;
          if (b.score > a.score) return 1;
          return 0;
        });

        resolve(true);
        this.loadingOperators = false;
      }, 1000);
    }));
  }
}

export default SSVStore;
