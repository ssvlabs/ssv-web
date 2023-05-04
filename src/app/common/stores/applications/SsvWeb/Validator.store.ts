import Decimal from 'decimal.js';
import { Contract } from 'web3-eth-contract';
import { SSVKeys, ISharesKeyPairs } from 'ssv-keys';
import { action, makeObservable, observable } from 'mobx';
import Operator from '~lib/api/Operator';
import ApiParams from '~lib/api/ApiParams';
import Validator from '~lib/api/Validator';
import { translations } from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import { propertyCostByPeriod } from '~lib/utils/numbers';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import ClusterStore from '~app/common/stores/applications/SsvWeb/Cluster.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import ProcessStore, { SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';
import { RegisterValidator } from '~app/common/stores/applications/SsvWeb/processes/RegisterValidator';

type KeyShareError = {
  id: number,
  name: string,
  errorMessage: string,
  subErrorMessage?: string,
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
        this.keyStorePublicKey = ssvKeys.publicKey;
        resolve(true);
      } catch (e: any) {
        reject(e);
      }
    });
  }

  /**
   * Add new validator
   */
  async removeValidator(validator: any): Promise<boolean> {
    const walletStore: WalletStore = this.getStore('Wallet');
    const clusterStore: ClusterStore = this.getStore('Cluster');
    const applicationStore: ApplicationStore = this.getStore('Application');
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    const contract: Contract = walletStore.setterContract;
    const ownerAddress: string = walletStore.accountAddress;
    applicationStore.setIsLoading(true);
    const myAccountStore: MyAccountStore = this.getStore('MyAccount');
    // @ts-ignore
    const operatorsIds = validator.operators.map(({ id }) => Number(id)).sort((a: number, b: number) => a - b);
    validator.publicKey = validator.public_key.startsWith('0x') ? validator.public_key : `0x${validator.public_key}`;
    const clusterData = await clusterStore.getClusterData(clusterStore.getClusterHash(validator.operators));
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      // eslint-disable-next-line no-param-reassign
      await contract.methods.removeValidator(validator.publicKey, operatorsIds, clusterData).send({ from: ownerAddress })
          .on('receipt', async () => {
            ApiParams.initStorage(true);
            let iterations = 0;
            while (iterations <= MyAccountStore.CHECK_UPDATES_MAX_ITERATIONS) {
              // Reached maximum iterations
              if (iterations >= MyAccountStore.CHECK_UPDATES_MAX_ITERATIONS) {
                // eslint-disable-next-line no-await-in-loop
                await this.refreshOperatorsAndClusters(resolve, true);
                break;
              }
              iterations += 1;
              // eslint-disable-next-line no-await-in-loop
              if (!(await myAccountStore.checkEntityInAccount('cluster', 'public_key', validator.publicKey.replace(/^(0x)/gi, '')))) {
                // eslint-disable-next-line no-await-in-loop
                await this.refreshOperatorsAndClusters(resolve, true);
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
      const contract: Contract = walletStore.setterContract;
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
                  await this.refreshOperatorsAndClusters(resolve, true);
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
                  await this.refreshOperatorsAndClusters(resolve, true);
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
      const myAccountStore: MyAccountStore = this.getStore('MyAccount');
      const applicationStore: ApplicationStore = this.getStore('Application');
      const notificationsStore: NotificationsStore = this.getStore('Notifications');
      const contract: Contract = walletStore.setterContract;
      const ownerAddress: string = walletStore.accountAddress;

      this.newValidatorReceipt = null;

      if (!payload) resolve(false);

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
              let iterations = 0;
              while (iterations <= MyAccountStore.CHECK_UPDATES_MAX_ITERATIONS) {
                // Reached maximum iterations
                if (iterations >= MyAccountStore.CHECK_UPDATES_MAX_ITERATIONS) {
                  // eslint-disable-next-line no-await-in-loop
                  await this.refreshOperatorsAndClusters(resolve, true);
                  break;
                }
                iterations += 1;
                // eslint-disable-next-line no-await-in-loop
                if (await myAccountStore.checkEntityInAccount('cluster', 'validator_count', payload[4].validatorCount)) {
                  // eslint-disable-next-line no-await-in-loop
                  await this.refreshOperatorsAndClusters(resolve, true);
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

  async reactivateCluster(amount: string) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const walletStore: WalletStore = this.getStore('Wallet');
      const clusterStore: ClusterStore = this.getStore('Cluster');
      const processStore: ProcessStore = this.getStore('Process');
      const myAccountStore: MyAccountStore = this.getStore('MyAccount');
      const applicationStore: ApplicationStore = this.getStore('Application');
      const notificationsStore: NotificationsStore = this.getStore('Notifications');
      const contract: Contract = walletStore.setterContract;
      const process: SingleCluster = <SingleCluster>processStore.process;
      const cluster = process.item;
      const ownerAddress: string = walletStore.accountAddress;
      // @ts-ignore
      const operatorsIds = cluster.operators.map(({ id }) => Number(id)).sort((a: number, b: number) => a - b);
      const clusterData = await clusterStore.getClusterData(clusterStore.getClusterHash(cluster.operators));

      contract.methods.reactivate(operatorsIds, walletStore.toWei(amount), clusterData).send({ from: ownerAddress })
          .on('receipt', async (receipt: any) => {
            // eslint-disable-next-line no-prototype-builtins
            const event: boolean = receipt.hasOwnProperty('events');
            if (event) {
              this.keyStoreFile = null;
              GoogleTagManager.getInstance().sendEvent({
                label: 'success',
                category: 'single_cluster',
                action: 'reactivate_cluster',
              });
              console.debug('Contract Receipt', receipt);
              resolve(true);
              let iterations = 0;
              while (iterations <= MyAccountStore.CHECK_UPDATES_MAX_ITERATIONS) {
                // Reached maximum iterations
                if (iterations >= MyAccountStore.CHECK_UPDATES_MAX_ITERATIONS) {
                  // eslint-disable-next-line no-await-in-loop
                  await this.refreshOperatorsAndClusters(resolve, true);
                  break;
                }
                iterations += 1;
                // eslint-disable-next-line no-await-in-loop
                if (await myAccountStore.checkEntityInAccount('cluster', 'active', true)) {
                  // eslint-disable-next-line no-await-in-loop
                  await this.refreshOperatorsAndClusters(resolve, true);
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
              category: 'single_cluster',
              action: 'reactivate_cluster',
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
                label: 'error',
                category: 'single_cluster',
                action: 'reactivate_cluster',
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
    const clusterStore: ClusterStore = this.getStore('Cluster');
    const processStore: ProcessStore = this.getStore('Process');
    const operatorStore: OperatorStore = this.getStore('Operator');
    const process: RegisterValidator | SingleCluster = <RegisterValidator | SingleCluster>processStore.process;
    const selectedOperators = Object.values(operatorStore.selectedOperators).sort((a: any, b: any) => a.id - b.id);
    const {
      operatorsIds,
      publicKeys,
    } = selectedOperators.reduce((aggr, operator: IOperator) => {
      // @ts-ignore
      aggr.operatorsIds.push(operator.id);
      // @ts-ignore
      aggr.publicKeys.push(operator.public_key);
      return aggr;
    }, {
      operatorsIds: [],
      publicKeys: [],
    });

    return new Promise(async (resolve) => {
      try {
        const threshold: ISharesKeyPairs = await ssvKeys.createThreshold(this.keyStorePrivateKey, operatorsIds);
        const shares = await ssvKeys.encryptShares(publicKeys, threshold.shares);
        let totalCost = 'registerValidator' in process ? ssvStore.prepareSsvAmountToTransfer(walletStore.toWei(process.registerValidator?.depositAmount)) : 0;
        if ('fundingPeriod' in process) {
          const networkCost = propertyCostByPeriod(ssvStore.networkFee, process.fundingPeriod);
          const operatorsCost = propertyCostByPeriod(operatorStore.getSelectedOperatorsFee, process.fundingPeriod);
          const liquidationCollateralCost = new Decimal(operatorStore.getSelectedOperatorsFee).add(ssvStore.networkFee).mul(ssvStore.liquidationCollateralPeriod);
          totalCost = ssvStore.prepareSsvAmountToTransfer(walletStore.toWei(liquidationCollateralCost.add(networkCost).add(operatorsCost).toString()));
        }
        try {
          await ssvKeys.buildPayload({
            publicKey: threshold.publicKey,
            operatorIds: operatorsIds,
            encryptedShares: shares,
          });
        } catch (e: any) {
          console.log('<<<<<<<<<<<<<<<<<<<<here3>>>>>>>>>>>>>>>>>>>>');
          console.log(threshold.publicKey);
          console.log(e.message);
          console.log('<<<<<<<<<<<<<<<<<<<<here3>>>>>>>>>>>>>>>>>>>>');
        }
        const { readable } = await ssvKeys.buildPayload({
          publicKey: threshold.publicKey,
          operatorIds: operatorsIds,
          encryptedShares: shares,
        });

        resolve([
          this.keyStorePublicKey,
          readable?.operatorIds.sort((a: number, b: number) => a - b),
          readable.shares,
          `${totalCost}`,
          await clusterStore.getClusterData(clusterStore.getClusterHash(operatorsIds)),
        ]);
      } catch (e: any) {
        console.log(e.message);
        resolve(false);
      }
    });
  }

  async createKeySharePayLoad(update: boolean = false): Promise<any> {
    update;
    return new Promise(async (resolve) => {
      const ssvStore: SsvStore = this.getStore('SSV');
      const walletStore: WalletStore = this.getStore('Wallet');
      const clusterStore: ClusterStore = this.getStore('Cluster');
      const processStore: ProcessStore = this.getStore('Process');
      const operatorStore: OperatorStore = this.getStore('Operator');
      const process: RegisterValidator | SingleCluster = <RegisterValidator | SingleCluster>processStore.process;
      let totalCost = 'registerValidator' in process ? process.registerValidator?.depositAmount : 0;
      if ('fundingPeriod' in process) {
        const networkCost = propertyCostByPeriod(ssvStore.networkFee,  process.fundingPeriod);
        const operatorsCost = propertyCostByPeriod(operatorStore.getSelectedOperatorsFee, process.fundingPeriod);
        const liquidationCollateralCost = new Decimal(operatorStore.getSelectedOperatorsFee).add(ssvStore.networkFee).mul(ssvStore.liquidationCollateralPeriod);
        totalCost = ssvStore.prepareSsvAmountToTransfer(walletStore.toWei(liquidationCollateralCost.add(networkCost).add(operatorsCost).toString()));
      }
      try {
        const payLoad = [
          this.keySharePublicKey,
          this.keySharePayload?.operatorIds.map(Number).sort((a: number, b: number) => a - b),
          this.keySharePayload?.shares,
          `${totalCost}`,
          await clusterStore.getClusterData(clusterStore.getClusterHash(this.keySharePayload?.operatorIds.sort())),
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
  async refreshOperatorsAndClusters(resolve: any, showError?: boolean) {
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
    const OK_RESPONSE_ID = 0;
    const ERROR_RESPONSE_ID = 4;
    const VALIDATOR_EXIST_ID = 3;
    const PUBLIC_KEY_ERROR_ID = 5;
    const OPERATOR_NOT_EXIST_ID = 1;
    const OPERATOR_NOT_MATCHING_ID = 2;
    const processStore: ProcessStore = this.getStore('Process');
    const { OK_RESPONSE, OPERATOR_NOT_EXIST_RESPONSE, OPERATOR_NOT_MATCHING_RESPONSE, CATCH_ERROR_RESPONSE, VALIDATOR_EXIST_RESPONSE, VALIDATOR_PUBLIC_KEY_ERROR } = translations.VALIDATOR.KEYSHARE_RESPONSE;
    try {
      const fileJson = await this.keyShareFile?.text();
      const operatorStore: OperatorStore = this.getStore('Operator');
      // @ts-ignore
      const payload = JSON.parse(fileJson).payload.readable;
      this.keySharePayload = payload;
      this.keySharePublicKey = payload.publicKey;
      const keyShareOperators = payload.operatorIds.sort();
      if (this.keySharePublicKey.length < 98) {
        return { ...VALIDATOR_PUBLIC_KEY_ERROR, id: PUBLIC_KEY_ERROR_ID };
      }
      if (processStore.secondRegistration) {
        const process: SingleCluster = processStore.process;
        const clusterOperatorsIds = process.item.operators.map((operator: any) => operator.id ).sort();
        if (!clusterOperatorsIds.every((val: number, index: number) => val === keyShareOperators[index])) {
          return { ...OPERATOR_NOT_MATCHING_RESPONSE, id: OPERATOR_NOT_MATCHING_ID };
        }
      } else {
        const selectedOperators = await Operator.getInstance().getOperatorsByIds(keyShareOperators);
        if (!selectedOperators) return { ...OPERATOR_NOT_EXIST_RESPONSE, id: OPERATOR_NOT_EXIST_ID };
        // @ts-ignore
        operatorStore.selectOperators(selectedOperators);
      }
      const validatorExist = !!(await Validator.getInstance().getValidator(payload.publicKey, true));
      if (validatorExist) return { ...VALIDATOR_EXIST_RESPONSE, id: VALIDATOR_EXIST_ID };

      return { ...OK_RESPONSE, id: OK_RESPONSE_ID };
      // @ts-ignore
    } catch (e: any) {
      return { ...CATCH_ERROR_RESPONSE, id: ERROR_RESPONSE_ID };
    }
  }

  isJsonFile(file: any): boolean {
    return file?.type === 'application/json';
  }
}

export default ValidatorStore;
