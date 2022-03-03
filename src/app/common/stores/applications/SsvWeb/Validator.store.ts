import { Contract } from 'web3-eth-contract';
import { action, observable, computed } from 'mobx';
import EthereumKeyStore from 'eth2-keystore-js';
import config from '~app/common/config';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import BaseStore from '~app/common/stores/BaseStore';
import { roundCryptoValueString } from '~lib/utils/numbers';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import PriceEstimation from '~lib/utils/contract/PriceEstimation';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import Threshold, { IShares, ISharesKeyPairs } from '~lib/crypto/Threshold';
import Encryption, { EncryptShare } from '~lib/crypto/Encryption/Encryption';
import OperatorStore, { IOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';

class ValidatorStore extends BaseStore {
  @observable estimationGas: number = 0;
  @observable newValidatorReceipt: any = null;
  @observable dollarEstimationGas: number = 0;
  @observable keyStoreFile: File | null = null;
  @observable createValidatorPayLoad: (string | string[])[] | undefined = undefined;

  public static OPERATORS_SELECTION_GAP = 66.66;
  private keyStore: EthereumKeyStore | undefined;

  @action.bound
  clearValidatorData() {
    this.keyStoreFile = null;
    this.createValidatorPayLoad = undefined;
  }

  @action.bound
  async extractKeyStoreData(): Promise<void> {
    const fileTextPlain: string | undefined = await this.keyStoreFile?.text();
    const ethereumKeyStore = new EthereumKeyStore(fileTextPlain);
    ethereumKeyStore;
  }

  /**
   * Extract validator private key from keystore file
   */
  @action.bound
  async keyStorePrivateKey(): Promise<string> {
    try {
      const fileTextPlain: string | undefined = await this.keyStoreFile?.text();
      if (!fileTextPlain) return '';
      const ethereumKeyStore = new EthereumKeyStore(fileTextPlain);
      return await ethereumKeyStore.getPrivateKey();
    } catch (e: any) {
      return e.message;
    }
  }

  /**
   * Extract validator private key from keystore file
   */
  @action.bound
  async extractPublicKey(): Promise<string> {
    try {
      const fileTextPlain: string | undefined = await this.keyStoreFile?.text();
      if (!fileTextPlain) return '';
      const ethereumKeyStore = new EthereumKeyStore(fileTextPlain);
      return ethereumKeyStore.getPublicKey();
    } catch (e: any) {
      return e.message;
    }
  }

  /**
   * Add new validator
   * @param getGasEstimation
   * @param callBack
   */
  @action.bound
  // eslint-disable-next-line no-unused-vars
  async addNewValidator(getGasEstimation?: boolean, callBack?: (txHash: string) => void) {
    const walletStore: WalletStore = this.getStore('Wallet');
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    const gasEstimation: PriceEstimation = new PriceEstimation();
    const contract: Contract = walletStore.getContract;
    const ownerAddress: string = walletStore.accountAddress;

    this.newValidatorReceipt = null;

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
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
                reject(error);
              });
        } else {
          // Send add operator transaction
          this.conditionalContractFunction(contract, payload)
              .send({ from: ownerAddress })
          .on('receipt', (receipt: any) => {
                // eslint-disable-next-line no-prototype-builtins
                const event: boolean = receipt.hasOwnProperty('events');
                if (event) {
                  console.debug('Contract Receipt', receipt);
                  this.newValidatorReceipt = payload[1];
                  this.clearValidatorData();
                  resolve(event);
                }
              })
              .on('transactionHash', (txHash: string) => {
                callBack && callBack(txHash);
              })
              .on('error', (error: any) => {
                console.debug('Contract Error', error);
                reject(error);
              })
              .catch((error: any) => {
                if (error) {
                  notificationsStore.showMessage(error.message, 'error');
                  reject(error);
                }
                console.debug('Contract Error', error);
                resolve(true);
              });
        }
    });
  }

  @action.bound
  async createPayLoad(): Promise<(string | string[])[]> {
    if (this.createValidatorPayLoad) return this.createValidatorPayLoad;
    const ssvStore: SsvStore = this.getStore('SSV');
    const walletStore: WalletStore = this.getStore('Wallet');
    const operatorStore: OperatorStore = this.getStore('Operator');
    const threshold: Threshold = new Threshold();
    const privateKey = await this.keyStorePrivateKey();
    const thresholdResult: ISharesKeyPairs = await threshold.create(privateKey);
    let totalAmountOfSsv = 0;
    if (process.env.REACT_APP_NEW_STAGE) {
      const operatorsFees = ssvStore.getFeeForYear(operatorStore.getSelectedOperatorsFee);
      const liquidationCollateral = (ssvStore.networkFee + operatorStore.getSelectedOperatorsFee) * ssvStore.liquidationCollateral;
       totalAmountOfSsv = liquidationCollateral + ssvStore.getFeeForYear(ssvStore.networkFee) + operatorsFees;
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
      const encryptedShares: EncryptShare[] = new Encryption(decodeOperatorsKey, thresholdResult.shares).encrypt();
      // Collect all private keys from shares
      const encryptedKeys: string[] = encryptedShares.map((share: IShares) => {
        return walletStore.encodeKey(share.privateKey);
      });
      const payLoad = [
        thresholdResult.validatorPublicKey,
        operatorPublicKeys,
        sharePublicKeys,
        encryptedKeys,
      ];
      if (process.env.REACT_APP_NEW_STAGE) {
        payLoad.push(walletStore.web3.utils.toWei(roundCryptoValueString(totalAmountOfSsv)));
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
  setKeyStore(keyStore: any) {
    this.keyStoreFile = keyStore;
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
