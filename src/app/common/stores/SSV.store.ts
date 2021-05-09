import { Contract } from 'web3-eth-contract';
import { action, observable, computed } from 'mobx';
import config from '~app/common/config';
import WalletStore from '~app/common/stores/Wallet.store';
import EthereumKeyStore from '~lib/crypto/EthereumKeyStore';
import StoresProvider from '~app/common/stores/StoresProvider';
import NotificationsStore from '~app/common/stores/Notifications.store';
import Threshold, { IShares, ISharesKeyPairs } from '~lib/crypto/Threshold';

export interface INewOperatorTransaction {
  name: string,
  pubKey: string,
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
  @observable validatorPrivateKeyFile: File | null = null;
  @observable validatorKeyStorePassword: string = '';

  @observable operators: IOperator[] = [];
  @observable loadingOperators: boolean = false;

  @observable addingNewOperator: boolean = false;
  @observable newOperatorReceipt: any = null;

  @observable addingNewValidator: boolean = false;
  @observable newValidatorReceipt: any = null;

  @observable isLoading: boolean = false;

  constructor() {
    const storesProvider = StoresProvider.getInstance();
    this.wallet = storesProvider.getStore('wallet');
    this.notifications = storesProvider.getStore('notifications');
  }

  /**
   * Returns true if wallet is ready
   * Otherwise returns false
   */
  checkIfWalletReady() {
    if (!this.wallet.connected) {
      this.notifications.showMessage('Please connect your wallet first!', 'error');
      return false;
    }
    return true;
  }

  @action.bound
  setIsLoading(status: boolean) {
    this.isLoading = status;
  }

  @action.bound
  async extractPrivateKey() {
    this.setIsLoading(true);
      await this.validatorPrivateKeyFile?.text().then((string) => {
        try {
          const keyStore = new EthereumKeyStore(string);
          return keyStore.getPrivateKey(this.validatorKeyStorePassword).then((answer) => {
              if (typeof answer === 'string') {
                this.setValidatorPrivateKey(answer);
              }
          });
        } catch (error) {
          this.notifications.showMessage('something went wrong..', 'error');
        }
      });
  }

  @action.bound
  async verifyOperatorPublicKey() {
    await this.wallet.connect();
    // const contract: Contract = await this.wallet.getContract();
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  @action.bound
  async addNewValidator() {
    this.setIsLoading(true);
    try {
      if (!this.checkIfWalletReady()) {
        return;
      }
      this.newValidatorReceipt = null;
      this.addingNewValidator = true;
      await this.wallet.connect();
      const contract: Contract = await this.wallet.getContract();
      const ownerAddress: string = this.wallet.accountAddress;
      // PrivateKey example: 45df68ab75bb7ed1063b7615298e81c1ca1b0c362ef2e93937b7bba9d7c43a94
      const threshold: Threshold = new Threshold();
      const thresholdResult: ISharesKeyPairs = await threshold.create(this.validatorPrivateKey);

      // Get list of selected operator's public keys
      const indexes: number[] = [];
      const operatorPublicKeys: string[] = this.operators
        .filter((operator: IOperator) => {
          return operator.selected;
        })
        .map((operator: IOperator, operatorIndex: number) => {
          indexes.push(operatorIndex);
          return operator.publicKey.startsWith('0x') ? operator.publicKey.substr(2) : operator.publicKey;
        });
      // Collect all public keys from shares
      const sharePublicKeys: string[] = thresholdResult.shares.map((share: IShares) => {
        return share.publicKey.startsWith('0x') ? share.publicKey.substr(2) : share.publicKey;
      });
      // Collect all private keys from shares
      const sharePrivateKeys: string[] = thresholdResult.shares.map((share: IShares) => {
        return share.privateKey.startsWith('0x') ? share.privateKey.substr(2) : share.privateKey;
      });

      // TODO: https://bloxxx.atlassian.net/browse/BLOXSSV-56
      const encryptedKeys: string[] = sharePrivateKeys;

      const payload = [
        thresholdResult.validatorPublicKey.startsWith('0x')
          ? thresholdResult.validatorPublicKey.substr(2)
          : thresholdResult.validatorPublicKey,
        operatorPublicKeys,
        indexes,
        sharePublicKeys,
        encryptedKeys,
        ownerAddress,
      ];

      console.debug('Add Validator Payload: ', payload);

      // Send add operator transaction
      contract.methods
        .addValidator(...payload)
        .send({ from: ownerAddress })
        .on('receipt', (receipt: any) => {
          console.debug('Contract Receipt', receipt);
          this.setIsLoading(false);
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
    } catch (error) {
      console.error('Register Validator Error:', error);
      this.notifications.showMessage(error.message, 'error');
      this.addingNewValidator = false;
    }
  }

  @action.bound
  async addNewOperator(transaction: INewOperatorTransaction) {
    try {
      if (!this.checkIfWalletReady()) {
        return;
      }
      this.newOperatorReceipt = null;
      this.addingNewOperator = true;

      console.debug('Register Operator Transaction Data:', transaction);
      await this.wallet.connect();
      const contract: Contract = await this.wallet.getContract();
      const address: string = this.wallet.accountAddress;

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

  @action.bound
  setValidatorPrivateKeyFile(validatorPrivateKeyFile: any) {
    this.validatorPrivateKeyFile = validatorPrivateKeyFile;
    this.validatorPrivateKey = '';
  }

  @action.bound
  setValidatorKeyStorePassword(validatorKeyStorePassword: string) {
    this.validatorKeyStorePassword = validatorKeyStorePassword;
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
            publicKey: '0x1a1b7a4e12a5554bf00d74d0a4df5ef7420599574ee3eca102aee47bc14d5669',
            score: 0.1,
            selected: false,
            autoSelected: false,
          },
          {
            name: 'Operator #2',
            publicKey: '0x2a1b7a4e12a5554bf00d74d0a4df5ef7420599574ee3eca102aee47bc14d5669',
            score: 0.2,
            selected: false,
            autoSelected: false,
          },
          {
            name: 'Operator #3',
            publicKey: '0x3a1b7a4e12a5554bf00d74d0a4df5ef7420599574ee3eca102aee47bc14d5669',
            score: 0.9,
            selected: false,
            autoSelected: false,
          },
          {
            name: 'Operator #4',
            publicKey: '0x4a1b7a4e12a5554bf00d74d0a4df5ef7420599574ee3eca102aee47bc14d5669',
            score: 0.4,
            selected: false,
            autoSelected: false,
          },
          {
            name: 'Operator #5',
            publicKey: '0x5a1b7a4e12a5554bf00d74d0a4df5ef7420599574ee3eca102aee47bc14d5669',
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
