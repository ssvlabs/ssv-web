import { Contract } from 'web3-eth-contract';
import { SSVKeys, ISharesKeyPairs } from 'ssv-keys';
import { action, makeObservable, observable } from 'mobx';
import Operator from '~lib/api/Operator';
import ApiParams from '~lib/api/ApiParams';
import Validator from '~lib/api/Validator';
import BaseStore from '~app/common/stores/BaseStore';
import { propertyCostByPeriod } from '~lib/utils/numbers';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import { RegisterValidator } from '~app/common/stores/applications/SsvWeb/processes/RegisterValidator';

type KeyShareError = {
  id: number,
  name: string,
  errorMessage: string,
};

// eslint-disable-next-line no-unused-vars
enum Mode {
  // eslint-disable-next-line no-unused-vars
  KEYSHARE = 0,
  // eslint-disable-next-line no-unused-vars
  KEYSTORE = 1,
}

const annotations = {
  isJsonFile: action.bound,
  keyStoreFile: observable,
  keyShareFile: observable,
  setKeyStore: action.bound,
  registrationMode: observable,
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
};

class ValidatorStore extends BaseStore {
  // general
  registrationMode: Mode = 0;
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
    return new Promise(async (resolve, reject) => {
      try {
        const fileTextPlain: string | undefined = await this.keyStoreFile?.text();
        const ssvKeys = new SSVKeys(SSVKeys.VERSION.V3);
        // @ts-ignore
        const response = await ssvKeys.getPrivateKeyFromKeystoreData(fileTextPlain, keyStorePassword);
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        if (typeof response === 'object') throw (response);
        this.keyStorePrivateKey = response;
        this.keyStorePublicKey = ssvKeys.validatorPublicKey;
        resolve(true);
      } catch (e: any) {
        reject(e);
      }
    });
  }

  /**
   * Add new validator
   */
  async removeValidator(publicKey: string): Promise<boolean> {
    const walletStore: WalletStore = this.getStore('Wallet');
    const applicationStore: ApplicationStore = this.getStore('Application');
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    const contract: Contract = walletStore.getterContract;
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
      const contract: Contract = walletStore.getterContract;
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

  async addNewValidator() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const payload: any = this.registrationMode === 0 ? await this.createKeySharePayLoad() : await this.createKeystorePayload();
      const walletStore: WalletStore = this.getStore('Wallet');
      const applicationStore: ApplicationStore = this.getStore('Application');
      const notificationsStore: NotificationsStore = this.getStore('Notifications');
      const contract: Contract = walletStore.getterContract;
      const ownerAddress: string = walletStore.accountAddress;

      this.newValidatorReceipt = null;

      if (!payload) resolve(false);

      const myAccountStore: MyAccountStore = this.getStore('MyAccount');
      myAccountStore;
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
              resolve(true);
              // let iterations = 0;
              // while (iterations <= MyAccountStore.CHECK_UPDATES_MAX_ITERATIONS) {
              //   // Reached maximum iterations
              //   if (iterations >= MyAccountStore.CHECK_UPDATES_MAX_ITERATIONS) {
              //     // eslint-disable-next-line no-await-in-loop
              //     await this.refreshOperatorsAndValidators(resolve, true);
              //     break;
              //   }
              //   iterations += 1;
              //   // eslint-disable-next-line no-await-in-loop
              //   if (await myAccountStore.checkEntityInAccount('validator', 'public_key', payload[0].replace(/^(0x)/gi, ''))) {
              //     // eslint-disable-next-line no-await-in-loop
              //     await this.refreshOperatorsAndValidators(resolve, true);
              //     break;
              //   } else {
              //     console.log('Validator is still not in API..');
              //   }
              //   // eslint-disable-next-line no-await-in-loop
              //   await myAccountStore.delay();
              // }
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
    update;
    const ssvKeys = new SSVKeys(SSVKeys.VERSION.V3);
    const ssvStore: SsvStore = this.getStore('SSV');
    const walletStore: WalletStore = this.getStore('Wallet');
    const processStore: ProcessStore = this.getStore('Process');
    const operatorStore: OperatorStore = this.getStore('Operator');
    const process: RegisterValidator = <RegisterValidator>processStore.process;
    const {
      operatorsIds,
      publicKeys,
    } = Object.values(operatorStore.selectedOperators).reduce((aggr, operator: IOperator) => {
      // @ts-ignore
      aggr.operatorsIds.push(operator.id);
      // @ts-ignore
      aggr.publicKeys.push(operator.public_key);
      return aggr;
    }, {
      operatorsIds: [],
      publicKeys: [],
    });
    console.log('<<<<<<<<<<<<<<<<<<here>>>>>>>>>>>>>>>>>>');
    console.log(operatorsIds);
    console.log('<<<<<<<<<<<<<<<<<<here>>>>>>>>>>>>>>>>>>');

    return new Promise(async (resolve) => {
      try {
        const threshold: ISharesKeyPairs = await ssvKeys.createThreshold(this.keyStorePrivateKey, operatorsIds);
        const shares = await ssvKeys.encryptShares(publicKeys, threshold.shares);
        const networkCost = propertyCostByPeriod(ssvStore.networkFee, process.fundingPeriod);
        const operatorsCost = propertyCostByPeriod(operatorStore.getSelectedOperatorsFee, process.fundingPeriod);
        const liquidationCollateralCost = propertyCostByPeriod(operatorStore.getSelectedOperatorsFee + ssvStore.networkFee, ssvStore.liquidationCollateralPeriod);

        const { readable } = await ssvKeys.buildPayload(
            threshold.validatorPublicKey,
            operatorsIds,
            shares,
            walletStore.toWei(networkCost + operatorsCost + liquidationCollateralCost),
        );
        resolve([
          this.keyStorePublicKey,
          readable?.operatorIds.split(','),
          readable.shares,
          `${ssvStore.prepareSsvAmountToTransfer(readable?.ssvAmount)}`,
          {
            validatorCount: 0,
            networkFee: 0,
            networkFeeIndex: 0,
            index: 0,
            balance: 0,
            disabled: false,
          },
        ]);
      } catch (e: any) {
        console.log(e.message);
        resolve(false);
      }
    });
  }

  async createKeySharePayLoad(update: boolean = false): Promise<any> {
    const ssvStore: SsvStore = this.getStore('SSV');
    console.log('<<<<<<<<<<<<<<<<<<here>>>>>>>>>>>>>>>>>>');
    console.log(this.keySharePayload?.operatorIds.split(','));
    console.log('<<<<<<<<<<<<<<<<<<here>>>>>>>>>>>>>>>>>>');
    update;
    return new Promise((resolve) => {
      try {
        const payLoad = [
          this.keySharePublicKey,
          this.keySharePayload?.operatorIds.split(','),
          this.keySharePayload?.shares,
          `${ssvStore.prepareSsvAmountToTransfer(this.keySharePayload?.ssvAmount)}`,
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
      myAccountStore.getOwnerAddressClusters({}),
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
    const validatorExistResponse = { id: 3, name: 'validator_exit', errorMessage: 'Validator is already registered to the network, <br/> please try a different keystore file.' };
    const operatorNotExistResponse = { id: 1, name: 'operator_not_exist', errorMessage: 'Operators data incorrect, check operator data and re-generate keyshares.json.' };
    try {
      const fileJson = await this.keyShareFile?.text();
      // const ssvKeys = new SSVKeys(SSVKeys.VERSION.V3);
      // console.log(ssvKeys.keyShares.fromJson(fileJson));
      const operatorStore: OperatorStore = this.getStore('Operator');
      // @ts-ignore
      const payload = JSON.parse(fileJson).payload.readable;
      this.keySharePayload = payload;
      this.keySharePublicKey = payload.publicKey;
      const validatorExist = !!(await Validator.getInstance().getValidator(payload.publicKey, true));
      const selectedOperators = await Operator.getInstance().getOperatorsByIds(payload.operatorIds.split(','));
      if (validatorExist) return validatorExistResponse;
      if (!selectedOperators) return operatorNotExistResponse;
      // @ts-ignore
      operatorStore.selectOperators(selectedOperators);
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
