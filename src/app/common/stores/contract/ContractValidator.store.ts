import { Contract } from 'web3-eth-contract';
import { action, observable, computed } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Wallet.store';
import EthereumKeyStore from '~lib/crypto/EthereumKeyStore';
import PriceEstimation from '~lib/utils/contract/PriceEstimation';
import ApplicationStore from '~app/common/stores/Application.store';
import NotificationsStore from '~app/common/stores/Notifications.store';
import Threshold, { IShares, ISharesKeyPairs } from '~lib/crypto/Threshold';
import ContractOperator, { IOperator } from '~app/common/stores/contract/ContractOperator.store';
import Encryption, { EncryptShare } from '~lib/crypto/Encryption/Encryption';
import config from '~app/common/config';

class ContractValidator extends BaseStore {
  public static OPERATORS_SELECTION_GAP = 66.66;
  private keyStore: EthereumKeyStore | undefined;

  @observable validatorPrivateKey: string = '';
  @observable validatorPrivateKeyFile: File | null = null;
  @observable validatorKeyStorePassword: Buffer = Buffer.alloc(0);

  @observable addingNewValidator: boolean = false;
  @observable newValidatorReceipt: any = null;

  @observable estimationGas: number = 0;
  @observable dollarEstimationGas: number = 0;

  @observable createValidatorPayLoad: (string | string[])[] | undefined = undefined;

  @action.bound
  cleanPrivateData() {
    for (let i = 0; i < this.validatorKeyStorePassword.length; i += 1) {
      this.validatorKeyStorePassword[i] = parseInt(String(Math.ceil(Math.random() * 50)), 16);
    }
    this.validatorKeyStorePassword = Buffer.from('');
  }

  @action.bound
  isJsonFile(): boolean {
    return this.validatorPrivateKeyFile?.type === 'application/json';
  }

  @computed
  get password() {
    return this.validatorKeyStorePassword.toString().trim();
  }

  @action.bound
  setPassword(value: string) {
    this.validatorKeyStorePassword = Buffer.from(value);
  }

  /**
   * Return validator public key
   */
  @computed
  get validatorPublicKey() {
    if (!this.keyStore) {
      return false;
    }
    return this.keyStore.getPublicKey();
  }

  /**
   * Extract validator private key from keystore file
   */
  @action.bound
  async extractPrivateKey(): Promise<string> {
    return new Promise((resolve, reject) => {
      const applicationStore: ApplicationStore = this.getStore('Application');
      applicationStore.setIsLoading(true);
      this.validatorPrivateKeyFile?.text().then(async (string) => {
        try {
          this.keyStore = new EthereumKeyStore(string);
          const privateKey = await this.keyStore.getPrivateKey(this.password);
          this.setValidatorPrivateKey(privateKey);
          applicationStore.setIsLoading(false);
          resolve(privateKey);
        } catch (error) {
          this.setValidatorPrivateKey('');
          applicationStore.setIsLoading(false);
          reject(error.message);
        }
      });
    });
  }

  /**
   * Add new validator
   * @param getGasEstimation
   */
  @action.bound
  async addNewValidator(getGasEstimation?: boolean) {
    const walletStore: WalletStore = this.getStore('Wallet');
    const applicationStore: ApplicationStore = this.getStore('Application');
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    const gasEstimation: PriceEstimation = new PriceEstimation();
    this.newValidatorReceipt = null;
    this.addingNewValidator = true;
    await walletStore.connect();
    const contract: Contract = await walletStore.getContract();
    const ownerAddress: string = walletStore.accountAddress;

    if (!walletStore.accountAddress) return;

    applicationStore.setIsLoading(true);

    const payload: (string | string[])[] = await this.createPayLoad();

    return new Promise((resolve, reject) => {
      if (!walletStore.checkIfWalletReady()) {
        reject();
      }

      console.debug('Add Validator Payload: ', payload);

      if (getGasEstimation) {
        // Send add operator transaction
        contract.methods
          .addValidator(...payload)
          .estimateGas({ from: ownerAddress })
          .then((gasAmount: any) => {
            this.addingNewValidator = true;
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
            reject(error);
          });
      } else {
        // Send add operator transaction
        contract.methods
          .addValidator(...payload)
          .send({ from: ownerAddress })
          .on('receipt', (receipt: any) => {
            console.debug('Contract Receipt', receipt);
            this.newValidatorReceipt = receipt;
            applicationStore.setIsLoading(false);
          })
          .on('error', (error: any) => {
            this.addingNewValidator = false;
            notificationsStore.showMessage(error.message, 'error');
            console.debug('Contract Error', error);
            applicationStore.setIsLoading(false);
            reject(error);
          })
          .catch((error: any) => {
            this.addingNewValidator = false;
            if (error) {
              notificationsStore.showMessage(error.message, 'error');
              reject(error);
            }
            console.debug('Contract Error', error);
            applicationStore.setIsLoading(false);
            resolve(true);
          });

        // Listen for final event when it's added
        contract.events
          .ValidatorAdded({}, (error: any, event: any) => {
            this.addingNewValidator = false;
            if (error) {
              notificationsStore.showMessage(error.message, 'error');
              reject(error);
            } else {
              console.debug('Contract Receipt', event);
              this.newValidatorReceipt = event;
              notificationsStore.showMessage('You successfully added validator!', 'success');
              resolve(event);
            }
            console.debug({ error, event });
            applicationStore.setIsLoading(false);
          })
          .on('error', (error: any, receipt: any) => {
            if (error) {
              notificationsStore.showMessage(error.message, 'error');
              console.debug({ error, receipt });
              reject(error);
            }
            applicationStore.setIsLoading(false);
          });
      }
    });
  }

  @action.bound
  async createPayLoad(): Promise<(string | string[])[]> {
    if (this.createValidatorPayLoad) return this.createValidatorPayLoad;
    const walletStore: WalletStore = this.getStore('Wallet');
    const operatorStore: ContractOperator = this.getStore('contract/ContractOperator');
    const ownerAddress: string = walletStore.accountAddress;
    const threshold: Threshold = new Threshold();
    const thresholdResult: ISharesKeyPairs = await threshold.create(this.validatorPrivateKey);

    return new Promise((resolve, reject) => {
      if (!walletStore.checkIfWalletReady() && !thresholdResult) {
        reject();
      }
      // Get list of selected operator's public keys
      const operatorPublicKeys: string[] = operatorStore.operators
          .filter((operator: IOperator) => {
            return operator.selected;
          })
          .map((operator: IOperator) => {
            return operator.pubkey;
          });
      // Collect all public keys from shares
      const sharePublicKeys: string[] = thresholdResult.shares.map((share: IShares) => {
        return share.publicKey;
      });
      const decodeOperatorsKey: string[] = operatorPublicKeys.map((operatorKey: string) => {
        return atob(walletStore.decodeOperatorKey(operatorKey));
      });
      const encryptedShares: EncryptShare[] = new Encryption(decodeOperatorsKey, thresholdResult.shares).encrypt();
      // Collect all private keys from shares
      const encryptedKeys: string[] = encryptedShares.map((share: IShares) => {
        return walletStore.encodeOperatorKey(share.privateKey);
      });
      const payLoad = [
        ownerAddress,
        thresholdResult.validatorPublicKey,
        operatorPublicKeys,
        sharePublicKeys,
        encryptedKeys,
      ];
      this.createValidatorPayLoad = payLoad;
      resolve(payLoad);
    });
  }

  /**
   * Set validator private key
   * @param validatorPrivateKey
   */
  @action.bound
  setValidatorPrivateKey(validatorPrivateKey: string) {
    this.validatorPrivateKey = validatorPrivateKey;
  }

  /**
   * Set keystore file
   * @param validatorPrivateKeyFile
   */
  @action.bound
  setValidatorPrivateKeyFile(validatorPrivateKeyFile: any) {
    this.validatorPrivateKeyFile = validatorPrivateKeyFile;
    this.validatorPrivateKey = '';
  }
}

export default ContractValidator;
