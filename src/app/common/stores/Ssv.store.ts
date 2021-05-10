import axios from 'axios';
import { Contract } from 'web3-eth-contract';
import { action, observable, computed } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Wallet.store';
import EthereumKeyStore from '~lib/crypto/EthereumKeyStore';
import NotificationsStore from '~app/common/stores/Notifications.store';
import Threshold, { IShares, ISharesKeyPairs } from '~lib/crypto/Threshold';

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

class SsvStore extends BaseStore {
  public static OPERATORS_SELECTION_GAP = 66.66;

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

  /**
   * Returns true if wallet is ready
   * Otherwise returns false
   */
  checkIfWalletReady() {
    const wallet: WalletStore = this.getStore('wallet');
    const notifications: NotificationsStore = this.getStore('notifications');
    if (!wallet.connected) {
      notifications.showMessage('Please connect your wallet first!', 'error');
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
            this.setValidatorPrivateKey(answer);
          });
        } catch (error) {
          const notifications: NotificationsStore = this.getStore('notifications');
          notifications.showMessage('something went wrong..', 'error');
        }
      });
  }

  @action.bound
  async verifyOperatorPublicKey() {
    const wallet: WalletStore = this.getStore('wallet');
    await wallet.connect();
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  @action.bound
  async addNewValidator() {
    this.setIsLoading(true);
    const notifications: NotificationsStore = this.getStore('notifications');
    try {
      if (!this.checkIfWalletReady()) {
        return;
      }
      this.newValidatorReceipt = null;
      this.addingNewValidator = true;
      const wallet: WalletStore = this.getStore('wallet');
      await wallet.connect();
      const contract: Contract = await wallet.getContract();
      const ownerAddress: string = wallet.accountAddress;
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
          return operator.pubkey.startsWith('0x') ? operator.pubkey.substr(2) : operator.pubkey;
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
          this.newValidatorReceipt = receipt;
        })
        .on('error', (error: any) => {
          this.addingNewValidator = false;
          notifications.showMessage(error.message, 'error');
          console.debug('Contract Error', error);
          this.setIsLoading(false);
        })
        .catch((error: any) => {
          this.addingNewValidator = false;
          if (error) {
            notifications.showMessage(error.message, 'error');
          }
          console.debug('Contract Error', error);
          this.setIsLoading(false);
        });

      // Listen for final event when it's added
      contract.events
        .ValidatorAdded({}, (error: any, event: any) => {
          this.addingNewValidator = false;
          if (error) {
            notifications.showMessage(error.message, 'error');
          } else {
            notifications.showMessage('You successfully added validator!', 'success');
          }
          console.debug({ error, event });
          this.setIsLoading(false);
        })
        .on('error', (error: any, receipt: any) => {
          if (error) {
            notifications.showMessage(error.message, 'error');
          }
          console.debug({ error, receipt });
          this.setIsLoading(false);
        });
    } catch (error) {
      console.error('Register Validator Error:', error);
      notifications.showMessage(error.message, 'error');
      this.addingNewValidator = false;
      this.setIsLoading(false);
    }
  }

  @action.bound
  async addNewOperator(transaction: INewOperatorTransaction) {
    const notifications: NotificationsStore = this.getStore('notifications');
    const wallet: WalletStore = this.getStore('wallet');
    try {
      if (!this.checkIfWalletReady()) {
        return;
      }
      this.newOperatorReceipt = null;
      this.addingNewOperator = true;

      console.debug('Register Operator Transaction Data:', transaction);
      await wallet.connect();
      const contract: Contract = await wallet.getContract();
      const address: string = wallet.accountAddress;

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
          notifications.showMessage(error.message, 'error');
          console.debug('Contract Error', error);
          this.setIsLoading(false);
        })
        .catch((error: any) => {
          this.addingNewOperator = false;
          if (error) {
            notifications.showMessage(error.message, 'error');
          }
          console.debug('Contract Error', error);
          this.setIsLoading(false);
        });

      // Listen for final event when it's added
      contract.events
        .OperatorAdded({}, (error: any, event: any) => {
          this.addingNewOperator = false;
          if (error) {
            notifications.showMessage(error.message, 'error');
          } else {
            notifications.showMessage('You successfully added operator!', 'success');
          }
          console.debug({ error, event });
          this.setIsLoading(false);
        })
        .on('error', (error: any, receipt: any) => {
          if (error) {
            notifications.showMessage(error.message, 'error');
          }
          console.debug({ error, receipt });
          this.setIsLoading(false);
        });
    } catch (error: any) {
      console.error('Register Operator Error:', error);
      notifications.showMessage(error.message, 'error');
      this.addingNewOperator = false;
      this.setIsLoading(false);
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
      if (this.operators[i].pubkey === publicKey) {
        return { operator: this.operators[i], index: i };
      }
    }
    return { operator: null, index: -1 };
  }

  @action.bound
  isOperatorSelected(publicKey: string): boolean {
    const { operator } = this.findOperator(publicKey);
    return operator ? Boolean(operator.selected) : false;
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
    while (selectedPercents < SsvStore.OPERATORS_SELECTION_GAP) {
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
    return this.stats.selected >= config.FEATURE.OPERATORS.SELECT_MINIMUM_OPERATORS;
  }

  @action.bound
  async loadOperators() {
    this.loadingOperators = true;
    const query = `
    {
      operators(first: ${config.FEATURE.OPERATORS.REQUEST_MINIMUM_OPERATORS}) {
        id
        name
        pubkey
      }
    }`;
    const operatorsEndpointUrl = String(process.env.REACT_APP_OPERATORS_ENDPOINT);
    const res = await axios.post(operatorsEndpointUrl, { query });
    this.operators = res.data?.data?.operators ?? [];
  }
}

export default SsvStore;
