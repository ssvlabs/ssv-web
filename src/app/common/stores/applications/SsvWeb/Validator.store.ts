import { Contract } from 'web3-eth-contract';
import EthereumKeyStore from 'eth2-keystore-js';
import { action, observable, computed } from 'mobx';
import config from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import { addNumber, multiplyNumber } from '~lib/utils/numbers';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import PriceEstimation from '~lib/utils/contract/PriceEstimation';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import Threshold, { IShares, ISharesKeyPairs } from '~lib/crypto/Threshold';
import Encryption, { EncryptShare } from '~lib/crypto/Encryption/Encryption';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import ApiParams from '~lib/api/ApiParams';

class ValidatorStore extends BaseStore {
  @observable estimationGas: number = 0;
  @observable dollarEstimationGas: number = 0;
  @observable newValidatorReceipt: any = null;
  @observable keyStoreFile: File | null = null;
  @observable createValidatorPayLoad: (string | string[])[] | undefined = undefined;

  // Key Stores keys
  @observable keyStorePublicKey: string = '';
  @observable keyStorePrivateKey: string = '';

  public static OPERATORS_SELECTION_GAP = 66.66;

  @action.bound
  clearValidatorData() {
    this.keyStorePublicKey = '';
    this.keyStorePrivateKey = '';
    this.newValidatorReceipt = null;
    this.createValidatorPayLoad = undefined;
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
    const ethereumKeyStore = new EthereumKeyStore(fileTextPlain);
    this.keyStorePrivateKey = await ethereumKeyStore.getPrivateKey(keyStorePassword);
    this.keyStorePublicKey = await ethereumKeyStore.getPublicKey();
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
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      await contract.methods.removeValidator(publicKey).send({ from: ownerAddress })
          .on('receipt', async () => {
            ApiParams.initStorage(true);
            applicationStore.setIsLoading(false);
            applicationStore.showTransactionPendingPopUp(false);
            resolve(true);
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
    const walletStore: WalletStore = this.getStore('Wallet');
    const applicationStore: ApplicationStore = this.getStore('Application');
    const contract: Contract = walletStore.getContract;
    const payload: (string | string[])[] = await this.createPayLoad(false);

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const response = await contract.methods.updateValidator(...payload).send({ from: walletStore.accountAddress })
          .on('receipt', (receipt: any) => {
            // eslint-disable-next-line no-prototype-builtins
            const event: boolean = receipt.hasOwnProperty('events');
            if (event) {
              this.keyStoreFile = null;
              this.newValidatorReceipt = payload[1];
              applicationStore.setIsLoading(false);
              applicationStore.showTransactionPendingPopUp(false);
              resolve(true);
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
   * @param callBack
   */
  @action.bound
  // eslint-disable-next-line no-unused-vars
  async addNewValidator(getGasEstimation?: boolean) {
    const walletStore: WalletStore = this.getStore('Wallet');
    const applicationStore: ApplicationStore = this.getStore('Application');
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    const gasEstimation: PriceEstimation = new PriceEstimation();
    const contract: Contract = walletStore.getContract;
    const ownerAddress: string = walletStore.accountAddress;

    this.newValidatorReceipt = null;

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
        const payload: (string | string[])[] = await this.createPayLoad();

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
                      .then((rate: number) => {
                        this.dollarEstimationGas = this.estimationGas * rate * 0;
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
          .on('receipt', (receipt: any) => {
                // eslint-disable-next-line no-prototype-builtins
                const event: boolean = receipt.hasOwnProperty('events');
                if (event) {
                  this.keyStoreFile = null;
                  this.newValidatorReceipt = payload[1];
                  applicationStore.setIsLoading(false);
                  console.debug('Contract Receipt', receipt);
                  resolve(true);
                }
              })
              .on('transactionHash', (txHash: string) => {
                applicationStore.txHash = txHash;
                applicationStore.showTransactionPendingPopUp(true);
              })
              .on('error', (error: any) => {
                console.debug('Contract Error', error.message);
                applicationStore.setIsLoading(false);
                resolve(false);
              })
              .catch((error: any) => {
                applicationStore.setIsLoading(false);
                if (error) {
                  notificationsStore.showMessage(error.message, 'error');
                  resolve(false);
                }
                console.debug('Contract Error', error);
                resolve(true);
              });
        }
    });
  }

  @action.bound
  async createPayLoad(update: boolean = false): Promise<(string | string[])[]> {
    if (this.createValidatorPayLoad) return this.createValidatorPayLoad;
    const ssvStore: SsvStore = this.getStore('SSV');
    const walletStore: WalletStore = this.getStore('Wallet');
    const operatorStore: OperatorStore = this.getStore('Operator');
    const threshold: Threshold = new Threshold();
    const thresholdResult: ISharesKeyPairs = await threshold.create(this.keyStorePrivateKey);
    let totalAmountOfSsv = '0';
    if (process.env.REACT_APP_NEW_STAGE) {
      const operatorsFees = ssvStore.newGetFeeForYear(operatorStore.getSelectedOperatorsFee);
      const liquidationCollateral = multiplyNumber(addNumber(ssvStore.networkFee, ssvStore.newGetFeeForYear(operatorStore.getSelectedOperatorsFee)), ssvStore.liquidationCollateral);
      totalAmountOfSsv = addNumber(addNumber(liquidationCollateral, ssvStore.newGetFeeForYear(ssvStore.networkFee, 11)), operatorsFees);
    }

    return new Promise((resolve) => {
      // Get list of selected operator's public keys
      const operatorPublicKeys: string[] = Object.values(operatorStore.selectedOperators).map((operator: IOperator) => {
        return walletStore.encodeKey(operator.public_key);
      });

      // Collect all public keys from shares
      const sharePublicKeys: string[] = thresholdResult.shares.map((share: IShares) => {
        return share.publicKey;
      });
      const decodeOperatorsKey: string[] = operatorPublicKeys.map((operatorKey: string) => {
        return atob(walletStore.decodeKey(operatorKey));
      });

      const operatorIds: string[] = Object.values(operatorStore.selectedOperators).map((operator: IOperator) => {
        return operator.operator_id;
      });

      const encryptedShares: EncryptShare[] = new Encryption(decodeOperatorsKey, thresholdResult.shares).encrypt();
      // Collect all private keys from shares
      const encryptedKeys: string[] = encryptedShares.map((share: IShares) => {
        return walletStore.encodeKey(share.privateKey);
      });

      const payLoad = [
        `0x${this.keyStorePublicKey}`,
        operatorIds,
        sharePublicKeys,
        encryptedKeys,
      ];
      if (process.env.REACT_APP_NEW_STAGE) {
        if (!update) payLoad.push(walletStore.toWei(totalAmountOfSsv));
      } else {
        payLoad.unshift(walletStore.accountAddress);
      }
      this.createValidatorPayLoad = payLoad;
      resolve(payLoad);
    });
  }

  /**
   * Set keystore file
   * @param keyStore
   */
  @action.bound
  async setKeyStore(keyStore: any) {
    this.keyStorePrivateKey = '';
    this.keyStoreFile = keyStore;
    this.keyStorePublicKey = await this.getKeyStorePublicKey();
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
