import { Contract } from 'web3-eth-contract';
import { action, makeObservable, observable } from 'mobx';
import { Encryption, EthereumKeyStore, Threshold } from 'ssv-keys';
import Operator from '~lib/api/Operator';
import config from '~app/common/config';
import ApiParams from '~lib/api/ApiParams';
import Validator from '~lib/api/Validator';
import BaseStore from '~app/common/stores/BaseStore';
import { addNumber, multiplyNumber, propertyCostByPeriod } from '~lib/utils/numbers';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import Decimal from 'decimal.js';

type KeyShareError = {
  id: number,
  name: string,
  errorMessage: string,
};

const annotations = {
  isJsonFile: action.bound,
  keyStoreFile: observable,
  keyShareFile: observable,
  setKeyStore: action.bound,
  fundingPeriod: observable,
  createPayLoad: action.bound,
  updateValidator: action.bound,
  addNewValidator: action.bound,
  keyStorePublicKey: observable,
  keySharePublicKey: observable,
  removeValidator: action.bound,
  setKeyShareFile: action.bound,
  keyStorePrivateKey: observable,
  newValidatorReceipt: observable,
  extractKeyStoreData: action.bound,
  getKeyStorePublicKey: action.bound,
  clearKeyShareFlowData: action.bound,
  clearKeyStoreFlowData: action.bound,
  validatorPublicKeyExist: observable,
  validateKeySharePayload: action.bound,
  processValidatorPublicKey: observable,
};

class ValidatorStore extends BaseStore {
  // general
  fundingPeriod: any = null;
  newValidatorReceipt: any = null;

  // Key Stores flow
  keyStorePublicKey: string = '';
  keyStorePrivateKey: string = '';
  keyStoreFile: File | null = null;
  validatorPublicKeyExist: boolean = false;

  // key shares flow
  keySharePayload: any;
  keySharePublicKey: string = '';
  keyShareFile: File | null = null;

  // process data (single validator flow)
  processValidatorPublicKey: string = '';


  constructor() {
    super();
    makeObservable(this, annotations);
  }

  clearKeyStoreFlowData() {
    this.keyStorePublicKey = '';
    this.keyStorePrivateKey = '';
    this.newValidatorReceipt = null;
    this.validatorPublicKeyExist = false;
  }

  clearKeyShareFlowData() {
    this.keyShareFile = null;
    this.keySharePublicKey = '';
    this.validatorPublicKeyExist = false;
  }

  async extractKeyStoreData(keyStorePassword: string): Promise<any> {
    const fileTextPlain: string | undefined = await this.keyStoreFile?.text();
    // @ts-ignore
    const ethereumKeyStore = new EthereumKeyStore(fileTextPlain);
    this.keyStorePrivateKey = await ethereumKeyStore.getPrivateKey(keyStorePassword);
    this.keyStorePublicKey = ethereumKeyStore.getPublicKey();
  }

  /**
   * Add new validator
   */
  async removeValidator(publicKey: string): Promise<boolean> {
    const walletStore: WalletStore = this.getStore('Wallet');
    const applicationStore: ApplicationStore = this.getStore('Application');
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    const contract: Contract = walletStore.getContract;
    const ownerAddress: string = walletStore.accountAddress;
    applicationStore.setIsLoading(true);
    const myAccountStore: MyAccountStore = this.getStore('MyAccount');
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      // eslint-disable-next-line no-param-reassign
      publicKey = publicKey.startsWith('0x') ? publicKey : `0x${publicKey}`;
      await contract.methods.removeValidator(publicKey).send({ from: ownerAddress })
          .on('receipt', async () => {
            ApiParams.initStorage(true);
            let iterations = 0;
            while (iterations <= MyAccountStore.CHECK_UPDATES_MAX_ITERATIONS) {
              // Reached maximum iterations
              if (iterations >= MyAccountStore.CHECK_UPDATES_MAX_ITERATIONS) {
                // eslint-disable-next-line no-await-in-loop
                await this.refreshOperatorsAndValidators(resolve, true);
                break;
              }
              iterations += 1;
              // eslint-disable-next-line no-await-in-loop
              if (!(await myAccountStore.checkEntityInAccount('validator', 'public_key', publicKey.replace(/^(0x)/gi, '')))) {
                // eslint-disable-next-line no-await-in-loop
                await this.refreshOperatorsAndValidators(resolve, true);
                break;
              } else {
                console.log('Validator is still in API..');
              }
              // eslint-disable-next-line no-await-in-loop
              await myAccountStore.delay();
            }
          })
          .on('transactionHash', (txHash: string) => {
            applicationStore.txHash = txHash;
            applicationStore.showTransactionPendingPopUp(true);
          })
          .on('error', (error: any) => {
            applicationStore.setIsLoading(false);
            notificationsStore.showMessage(error.message, 'error');
            applicationStore.showTransactionPendingPopUp(false);
            resolve(false);
          });
    });
  }

  /**
   * Update validator
   */
  async updateValidator() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const walletStore: WalletStore = this.getStore('Wallet');
      const applicationStore: ApplicationStore = this.getStore('Application');
      const contract: Contract = walletStore.getContract;
      const payload: (string | string[])[] = await this.createKeystorePayload(true);
      if (!payload) {
        applicationStore.setIsLoading(false);
        applicationStore.showTransactionPendingPopUp(false);
        resolve(false);
        return;
      }
      const myAccountStore: MyAccountStore = this.getStore('MyAccount');
      const validatorBefore = await Validator.getInstance().getValidator(`0x${payload[0]}`);

      const response = await contract.methods.updateValidator(...payload).send({ from: walletStore.accountAddress })
          .on('receipt', async (receipt: any) => {
            // eslint-disable-next-line no-prototype-builtins
            const event: boolean = receipt.hasOwnProperty('events');
            if (event) {
              this.keyStoreFile = null;
              this.newValidatorReceipt = payload[1];
              console.debug('Contract Receipt', receipt);
              let iterations = 0;
              while (iterations <= MyAccountStore.CHECK_UPDATES_MAX_ITERATIONS) {
                // Reached maximum iterations
                if (iterations >= MyAccountStore.CHECK_UPDATES_MAX_ITERATIONS) {
                  // eslint-disable-next-line no-await-in-loop
                  await this.refreshOperatorsAndValidators(resolve, true);
                  break;
                }
                iterations += 1;
                // eslint-disable-next-line no-await-in-loop
                const changed = await myAccountStore.checkEntityChangedInAccount(
                    async () => {
                      return Validator.getInstance().getValidator(`0x${payload[0]}`);
                    },
                    validatorBefore,
                );
                if (changed) {
                  // eslint-disable-next-line no-await-in-loop
                  await this.refreshOperatorsAndValidators(resolve, true);
                  break;
                } else {
                  console.log('Validator still not updated in API..');
                }
                // eslint-disable-next-line no-await-in-loop
                await myAccountStore.delay();
              }
            }
          })
          .on('transactionHash', (txHash: string) => {
            applicationStore.txHash = txHash;
            applicationStore.showTransactionPendingPopUp(true);
          })
          .on('error', (error: any) => {
            console.debug('Contract Error', error.message);
            applicationStore.setIsLoading(false);
            applicationStore.showTransactionPendingPopUp(false);
            resolve(false);
          });
      console.log(response);
    });
  }

  async addNewValidator(keyShare?: boolean) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const payload: any = keyShare ? await this.createKeySharePayLoad() : await this.createKeystorePayload();
      const walletStore: WalletStore = this.getStore('Wallet');
      const applicationStore: ApplicationStore = this.getStore('Application');
      const notificationsStore: NotificationsStore = this.getStore('Notifications');
      const contract: Contract = walletStore.getContract;
      const ownerAddress: string = walletStore.accountAddress;

      this.newValidatorReceipt = null;

      if (!payload) resolve(false);

      const myAccountStore: MyAccountStore = this.getStore('MyAccount');
      console.debug('Add Validator Payload: ', payload);

      // Send add operator transaction
      contract.methods.registerValidator(...payload).send({ from: ownerAddress })
          .on('receipt', async (receipt: any) => {
            // eslint-disable-next-line no-prototype-builtins
            const event: boolean = receipt.hasOwnProperty('events');
            if (event) {
              this.keyStoreFile = null;
              this.newValidatorReceipt = payload[1];
              GoogleTagManager.getInstance().sendEvent({
                category: 'validator_register',
                action: 'register_tx',
                label: 'success',
              });
              console.debug('Contract Receipt', receipt);
              let iterations = 0;
              while (iterations <= MyAccountStore.CHECK_UPDATES_MAX_ITERATIONS) {
                // Reached maximum iterations
                if (iterations >= MyAccountStore.CHECK_UPDATES_MAX_ITERATIONS) {
                  // eslint-disable-next-line no-await-in-loop
                  await this.refreshOperatorsAndValidators(resolve, true);
                  break;
                }
                iterations += 1;
                // eslint-disable-next-line no-await-in-loop
                if (await myAccountStore.checkEntityInAccount('validator', 'public_key', payload[0].replace(/^(0x)/gi, ''))) {
                  // eslint-disable-next-line no-await-in-loop
                  await this.refreshOperatorsAndValidators(resolve, true);
                  break;
                } else {
                  console.log('Validator is still not in API..');
                }
                // eslint-disable-next-line no-await-in-loop
                await myAccountStore.delay();
              }
            }
          })
          .on('transactionHash', (txHash: string) => {
            applicationStore.txHash = txHash;
            applicationStore.showTransactionPendingPopUp(true);
          })
          .on('error', (error: any) => {
            // eslint-disable-next-line no-prototype-builtins
            const isRejected: boolean = error.hasOwnProperty('code');
            GoogleTagManager.getInstance().sendEvent({
              category: 'validator_register',
              action: 'register_tx',
              label: isRejected ? 'rejected' : 'error',
            });
            console.debug('Contract Error', error.message);
            applicationStore.setIsLoading(false);
            resolve(false);
          })
          .catch((error: any) => {
            applicationStore.setIsLoading(false);
            if (error) {
              notificationsStore.showMessage(error.message, 'error');
              GoogleTagManager.getInstance().sendEvent({
                category: 'validator_register',
                action: 'register_tx',
                label: 'error',
              });
              resolve(false);
            }
            console.debug('Contract Error', error);
            resolve(true);
          });
    });
  }

  async createKeystorePayload(update: boolean = false): Promise<any> {
    const threshold: Threshold = new Threshold();
    const ssvStore: SsvStore = this.getStore('SSV');
    const walletStore: WalletStore = this.getStore('Wallet');
    const operatorStore: OperatorStore = this.getStore('Operator');
    const operatorIds: number[] = Object.values(operatorStore.selectedOperators).map((operator: IOperator) => {
      return operator.id;
    });
    const thresholdResult: any = await threshold.create(this.keyStorePrivateKey, operatorIds);
    let totalAmountOfSsv = '0';
    const networkFeeForYear = ssvStore.newGetFeeForYear(ssvStore.networkFee, 18);
    const operatorsFees = ssvStore.newGetFeeForYear(operatorStore.getSelectedOperatorsFee, 18);
    const liquidationCollateral = multiplyNumber(
        addNumber(
            ssvStore.networkFee,
            operatorStore.getSelectedOperatorsFee,
        ),
        1,
    ).toFixed().toString();
    if (new Decimal(liquidationCollateral).isZero()) {
      totalAmountOfSsv = networkFeeForYear;
    } else {
      totalAmountOfSsv = new Decimal(addNumber(addNumber(liquidationCollateral, networkFeeForYear), operatorsFees)).toFixed();
    }

    return new Promise((resolve) => {
      try {
        // Get list of selected operator's public keys
        const operatorPublicKeys: string[] = Object.values(operatorStore.selectedOperators).map((operator: IOperator) => {
          return operator.public_key;
        });

        // Collect all public keys from shares
        const sharePublicKeys: string[] = thresholdResult.shares.map((share: any) => {
          return share.publicKey;
        });

        const encryptedShares: any[] = new Encryption(operatorPublicKeys, thresholdResult.shares).encrypt();
        // Collect all private keys from shares
        const encryptedKeys: string[] = encryptedShares.map((share: any) => {
          return walletStore.encodeKey(share.privateKey);
        });

        const payLoad = [
          `0x${this.keyStorePublicKey}`,
          operatorIds.map(String),
          sharePublicKeys,
          encryptedKeys,
        ];
        payLoad.push(ssvStore.prepareSsvAmountToTransfer(walletStore.toWei(update ? 0 : totalAmountOfSsv)));
        resolve(payLoad);
      } catch (e: any) {
        console.log(e.message);
        resolve(false);
      }
    });
  }

  async createKeySharePayLoad(update: boolean = false): Promise<any> {
    update;
    return new Promise((resolve) => {
      try {
        const payLoad = [
          this.keySharePublicKey,
          this.keySharePayload?.operatorIds.split(','),
          `0x${this.keySharePayload?.shares}`,
          `${this.keySharePayload?.ssvAmount}`,
          {
            validatorCount: 0,
            networkFee: 0,
            networkFeeIndex: 0,
            index: 0,
            balance: 0,
            disabled: false,
          },
        ];
        resolve(payLoad);
      } catch (e: any) {
        console.log(e.message);
        resolve(false);
      }
    });
  }

  /**
   * Set keystore file
   * @param keyStore
   * @param callBack
   */
  async setKeyStore(keyStore: any, callBack?: any) {
    try {
      this.keyStorePrivateKey = '';
      this.keyStoreFile = keyStore;
      this.keyStorePublicKey = await this.getKeyStorePublicKey();
      this.validatorPublicKeyExist = !!(await Validator.getInstance().getValidator(this.keyStorePublicKey, true));
    } catch (e: any) {
      console.log(e.message);
    }
    !!callBack && callBack();
  }

  /**
   * Set keystore file
   * @param keyShare
   * @param callBack
   */
  async setKeyShareFile(keyShare: any, callBack?: any) {
    try {
      this.keyShareFile = keyShare;
      console.log(this.keyShareFile);
    } catch (e: any) {
      console.log(e.message);
    }
    !!callBack && callBack();
  }

  /**
   * Updating operators and validators data
   * @param resolve
   * @param showError
   */
  async refreshOperatorsAndValidators(resolve: any, showError?: boolean) {
    const myAccountStore: MyAccountStore = this.getStore('MyAccount');
    const applicationStore: ApplicationStore = this.getStore('Application');
    const notificationsStore: NotificationsStore = this.getStore('Notifications');

    return Promise.all([
      myAccountStore.getOwnerAddressValidators({}),
      myAccountStore.getOwnerAddressOperators({}),
    ])
        .then(() => {
          applicationStore.setIsLoading(false);
          applicationStore.showTransactionPendingPopUp(false);
          resolve(true);
        })
        .catch((error) => {
          applicationStore.setIsLoading(false);
          if (showError) {
            notificationsStore.showMessage(error.message, 'error');
          }
          applicationStore.showTransactionPendingPopUp(false);
          resolve(false);
        });
  }

  async getKeyStorePublicKey(): Promise<string> {
    try {
      const fileJson = await this.keyStoreFile?.text();
      // @ts-ignore
      return JSON.parse(fileJson).pubkey;
    } catch (e: any) {
      return '';
    }
  }

  async validateKeySharePayload(): Promise<KeyShareError> {
    const okResponse = { id: 0, name: '', errorMessage: '' };
    const validatorExistResponse = { id: 3, name: 'validator_not_exit', errorMessage: 'validator not exist' };
    const operatorNotExistResponse = { id: 1, name: 'operator_not_exist', errorMessage: 'Operators data incorrect, check operator data and re-generate keyshares.json.' };
    const liquidationWarningResponse = { id: 2, name: 'liquidation_warning', errorMessage: 'make sure the amount of SSV in file does not put cluster into liquidation.' };
    try {
      const fileJson = await this.keyShareFile?.text();
      const ssvStore: SsvStore = this.getStore('SSV');
      const walletStore: WalletStore = this.getStore('Wallet');
      const operatorStore: OperatorStore = this.getStore('Operator');
      // @ts-ignore
      const payload = JSON.parse(fileJson).payload.readable;
      this.keySharePayload = payload;
      this.keySharePublicKey = payload.validatorPublicKey;
      const validatorExist = !!(await Validator.getInstance().getValidator(payload.validatorPublicKey, true));
      const selectedOperators = await Operator.getInstance().getOperatorsByIds(payload.operatorIds.split(','));
      if (validatorExist) return validatorExistResponse;
      if (!selectedOperators) return operatorNotExistResponse;
      // @ts-ignore
      operatorStore.selectOperators(selectedOperators);
      const burnRate = operatorStore.getSelectedOperatorsFee + ssvStore.networkFee;
      const liquidationCollateralCost = propertyCostByPeriod(operatorStore.getSelectedOperatorsFee + ssvStore.networkFee, ssvStore.liquidationCollateralPeriod);
      const runwayPeriod = (walletStore.fromWei(payload.ssvAmount) - liquidationCollateralCost) / burnRate / config.GLOBAL_VARIABLE.BLOCKS_PER_DAY;
      this.fundingPeriod = runwayPeriod;
      if (runwayPeriod < 30) return liquidationWarningResponse;
      return okResponse;
      // @ts-ignore
    } catch (e: any) {
      return okResponse;
    }
  }

  isJsonFile(file: any): boolean {
    return file?.type === 'application/json';
  }
}

export default ValidatorStore;
