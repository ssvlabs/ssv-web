import Decimal from 'decimal.js';
import { Contract } from 'web3-eth-contract';
import { action, computed, observable } from 'mobx';
import { Encryption, EthereumKeyStore, Threshold } from 'ssv-keys';
import config from '~app/common/config';
import ApiParams from '~lib/api/ApiParams';
import Validator from '~lib/api/Validator';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import { addNumber, multiplyNumber } from '~lib/utils/numbers';
import PriceEstimation from '~lib/utils/contract/PriceEstimation';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';

class ValidatorStore extends BaseStore {
  @observable estimationGas: number = 0;
  @observable dollarEstimationGas: number = 0;
  @observable newValidatorReceipt: any = null;
  @observable keyStoreFile: File | null = null;

  // Key Stores keys
  @observable keyStorePublicKey: string = '';
  @observable keyStorePrivateKey: string = '';
  @observable validatorPublicKeyExist: boolean = false;

  // process data
  @observable processValidatorPublicKey: string = '';

  public static OPERATORS_SELECTION_GAP = 66.66;

  @action.bound
  clearValidatorData() {
    this.keyStorePublicKey = '';
    this.keyStorePrivateKey = '';
    this.newValidatorReceipt = null;
    this.validatorPublicKeyExist = false;
  }

  @action.bound
  async getKeyStorePublicKey(): Promise<string> {
    try {
      const fileJson = await this.keyStoreFile?.text();
      // @ts-ignore
      return JSON.parse(fileJson).pubkey;
    } catch (e: any) {
      return '';
    }
  }

  @action.bound
  async extractKeyStoreData(keyStorePassword: string): Promise<any> {
    const fileTextPlain: string | undefined = await this.keyStoreFile?.text();
    // @ts-ignore
    const ethereumKeyStore = new EthereumKeyStore(fileTextPlain);
    this.keyStorePrivateKey = await ethereumKeyStore.getPrivateKey(keyStorePassword);
    this.keyStorePublicKey = ethereumKeyStore.getPublicKey();
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

  /**
   * Add new validator
   */
  @action.bound
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
  @action.bound
  async updateValidator() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const walletStore: WalletStore = this.getStore('Wallet');
      const applicationStore: ApplicationStore = this.getStore('Application');
      const contract: Contract = walletStore.getContract;
      const payload: (string | string[])[] = await this.createPayLoad(true);
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

  /**
   * Add new validator
   * @param getGasEstimation
   */
  @action.bound
  // eslint-disable-next-line no-unused-vars
  async addNewValidator(getGasEstimation?: boolean) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const payload: any = await this.createPayLoad();
      const walletStore: WalletStore = this.getStore('Wallet');
      const applicationStore: ApplicationStore = this.getStore('Application');
      const notificationsStore: NotificationsStore = this.getStore('Notifications');
      const gasEstimation: PriceEstimation = new PriceEstimation();
      const contract: Contract = walletStore.getContract;
      const ownerAddress: string = walletStore.accountAddress;

      this.newValidatorReceipt = null;

      if (!payload) resolve(false);

      const myAccountStore: MyAccountStore = this.getStore('MyAccount');
      console.debug('Add Validator Payload: ', payload);

      if (getGasEstimation) {
        // Send add operator transaction
        this.conditionalContractFunction(contract, payload)
          .estimateGas({ from: ownerAddress })
          .then((gasAmount: any) => {
            this.estimationGas = gasAmount * 0.000000001;
            if (config.FEATURE.DOLLAR_CALCULATION) {
              gasEstimation
                .estimateGasInUSD(this.estimationGas)
                .then(() => {
                  // this.dollarEstimationGas = this.estimationGas * rate * 0;
                  resolve(true);
                })
                .catch(() => {
                  resolve(true);
                });
            } else {
              this.dollarEstimationGas = 0;
              resolve(true);
            }
          })
          .catch((error: any) => {
            resolve(error);
          });
      } else {
        // Send add operator transaction
        this.conditionalContractFunction(contract, payload).send({ from: ownerAddress })
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
      }
    });
  }

  @action.bound
  async createPayLoad(update: boolean = false): Promise<any> {
    const threshold: Threshold = new Threshold();
    const ssvStore: SsvStore = this.getStore('SSV');
    const walletStore: WalletStore = this.getStore('Wallet');
    const operatorStore: OperatorStore = this.getStore('Operator');
    const operatorIds: number[] = Object.values(operatorStore.selectedOperators).map((operator: IOperator) => {
      return operator.id;
    });
    const thresholdResult: any = await threshold.create(this.keyStorePrivateKey, operatorIds);
    let totalAmountOfSsv = '0';
    if (process.env.REACT_APP_NEW_STAGE) {
      const networkFeeForYear = ssvStore.newGetFeeForYear(ssvStore.networkFee, 18);
      const operatorsFees = ssvStore.newGetFeeForYear(operatorStore.getSelectedOperatorsFee, 18);
      const liquidationCollateral = multiplyNumber(
        addNumber(
          ssvStore.networkFee,
          operatorStore.getSelectedOperatorsFee,
        ),
        ssvStore.liquidationCollateral,
      ).toFixed().toString();
      if (new Decimal(liquidationCollateral).isZero()) {
        totalAmountOfSsv = networkFeeForYear;
      } else {
        totalAmountOfSsv = new Decimal(addNumber(addNumber(liquidationCollateral, networkFeeForYear), operatorsFees)).toFixed();
      }
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
        if (process.env.REACT_APP_NEW_STAGE) {
          payLoad.push(ssvStore.prepareSsvAmountToTransfer(walletStore.toWei(update ? 0 : totalAmountOfSsv)));
        } else {
          payLoad.unshift(walletStore.accountAddress);
        }
        resolve(payLoad);
      } catch (e) {
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
  @action.bound
  async setKeyStore(keyStore: any, callBack?: any) {
    try {
      this.keyStorePrivateKey = '';
      this.keyStoreFile = keyStore;
      this.keyStorePublicKey = await this.getKeyStorePublicKey();
      this.validatorPublicKeyExist = !!await Validator.getInstance().getValidator(this.keyStorePublicKey, true);
    } catch (e: any) {
      console.log(e.message);
    }
    !!callBack && callBack();
  }

  @computed
  get isJsonFile(): boolean {
    return this.keyStoreFile?.type === 'application/json';
  }

  conditionalContractFunction(contract: any, payload: any[]) {
    if (process.env.REACT_APP_NEW_STAGE) return contract.methods.registerValidator(...payload);
    return contract.methods.addValidator(...payload);
  }
}

export default ValidatorStore;
