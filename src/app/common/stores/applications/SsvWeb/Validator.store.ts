import Decimal from 'decimal.js';
import { ethers } from 'ethers';
import { KeySharesItem } from 'ssv-keys';
import { SSVKeys, KeyShares } from 'ssv-keys';
import { action, makeObservable, observable } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';
import { propertyCostByPeriod } from '~lib/utils/numbers';
import { EContractName } from '~app/model/contracts.model';
import { prepareSsvAmountToTransfer, toWei } from '~root/services/conversions.service';
import { executeAfterEvent } from '~root/services/events.service';
import { getContractByName } from '~root/services/contracts.service';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ProcessStore, { SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';
import { RegisterValidator } from '~app/common/stores/applications/SsvWeb/processes/RegisterValidator';
import { store } from '~app/store';
import { setIsLoading, setIsShowTxPendingPopup, setTxHash } from '~app/redux/appState.slice';
import { IOperator } from '~app/model/operator.model';
import { getClusterData, getClusterHash, getSortedOperatorsIds } from '~root/services/cluster.service';
import { getValidator } from '~root/services/validator.service';
import { getEventByTxHash } from '~root/services/contractEvent.service';
import { translations } from '~app/common/config';
import { getOwnerNonce } from '~root/services/account.service';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import { checkEntityChangedInAccount, delay } from '~root/services/utils.service';

type ClusterDataType = {
  active: boolean;
  balance: number;
  index: number;
  networkFeeIndex: number;
  validatorCount: number;
};

const PAYLOAD_KEYS = {
  KEYSTORE_PUBLIC_KEY: 'keyStorePublicKey',
  OPERATOR_IDS: 'operatorIds',
  SHARES_DATA: 'sharesData',
  TOTAL_COST: 'totalCost',
  CLUSTER_DATA: 'clusterData',
};

// eslint-disable-next-line no-unused-vars
enum Mode {
  KEYSHARE = 0,
  KEYSTORE = 1,
}

const annotations = {
  isJsonFile: action.bound,
  keyStoreFile: observable,
  registerValidatorsPublicKeys: observable,
  keyShareFile: observable,
  setKeyStore: action.bound,
  registrationMode: observable,
  updateValidator: action.bound,
  addNewValidator: action.bound,
  keyStorePublicKey: observable,
  keySharePublicKey: observable,
  setKeySharePublicKey: action.bound,
  removeValidator: action.bound,
  bulkRemoveValidators: action.bound,
  exitValidator: action.bound,
  bulkExitValidators: action.bound,
  setKeyShareFile: action.bound,
  setRegisterValidatorsPublicKeys: action.bound,
  keyStorePrivateKey: observable,
  newValidatorReceipt: observable,
  extractKeyStoreData: action.bound,
  getKeyStorePublicKey: action.bound,
  clearKeyShareFlowData: action.bound,
  clearKeyStoreFlowData: action.bound,
  bulkRegistration: action.bound,
  validatorPublicKeyExist: observable,
  isMultiSharesMode: observable,
  setMultiSharesMode: action.bound,
  validatorsCount: observable,
  processedKeyShare: observable,
  setProcessedKeyShare: action.bound,
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

  // New key shares flow.
  isMultiSharesMode: boolean = false;
  processedKeyShare: KeyShares | null = null;
  validatorsCount: number = 0;
  registerValidatorsPublicKeys: string[] = [];

  constructor() {
    super();
    makeObservable(this, annotations);
  }

  setKeySharePublicKey(keySharePublicKey: string) {
    this.keySharePublicKey = keySharePublicKey;
  }

  setMultiSharesMode(validatorsCount: number) {
    this.isMultiSharesMode = validatorsCount > 1;
    this.validatorsCount = validatorsCount;
  }

  setRegisterValidatorsPublicKeys(validatorPublicKeys: string[]) {
    this.registerValidatorsPublicKeys = validatorPublicKeys;
  }

  setProcessedKeyShare(processedKeyShare: KeyShares) {
    this.processedKeyShare = processedKeyShare;
    this.validatorsCount = processedKeyShare.list().length;
  }

  clearKeyStoreFlowData() {
    this.setMultiSharesMode(0);
    this.keyStorePublicKey = '';
    this.keyStorePrivateKey = '';
    this.newValidatorReceipt = null;
    this.validatorPublicKeyExist = false;
  }

  clearKeyShareFlowData() {
    this.keyShareFile = null;
    this.keySharePublicKey = '';
    this.validatorPublicKeyExist = false;
    this.isMultiSharesMode = false;
    this.processedKeyShare = null;
    this.validatorsCount = 0;
  }

  async extractKeyStoreData(keyStorePassword: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const fileTextPlain: string | undefined = await this.keyStoreFile?.text();
        const ssvKeys = new SSVKeys();
        // @ts-ignore
        const { privateKey, publicKey } = await ssvKeys.extractKeys(fileTextPlain, keyStorePassword);
        this.keyStorePrivateKey = privateKey;
        this.keyStorePublicKey = publicKey;
        resolve(true);
      } catch (e: any) {
        reject(e);
      }
    });
  }

  async removeValidator(publicKey: string, operatorIds: number[]): Promise<boolean> {
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    const contract = getContractByName(EContractName.SETTER);
    store.dispatch(setIsLoading(true));
    const walletStore: WalletStore = this.getStore('Wallet');
    const ssvStore: SsvStore = this.getStore('SSV');
    const sortedOperatorIds = getSortedOperatorsIds(operatorIds);
    const clusterData = await getClusterData(getClusterHash(operatorIds, walletStore.accountAddress), ssvStore.liquidationCollateralPeriod, ssvStore.minimumLiquidationCollateral);
    return new Promise(async (resolve) => {
      try {
        const tx = await contract.removeValidator(publicKey, sortedOperatorIds, clusterData);
        if (tx.hash) {
          store.dispatch(setTxHash(tx.hash));
          store.dispatch(setIsShowTxPendingPopup(true));
        }
        if (walletStore.isContractWallet) {
          resolve(true);
        }
        const receipt = await tx.wait();
        if (receipt.blockHash) {
          await executeAfterEvent(async () => !!await getEventByTxHash(receipt.transactionHash), async () => this.refreshOperatorsAndClusters(resolve, true), delay);
        } else {
          resolve(false);
        }
      } catch (e: any) {
        notificationsStore.showMessage(e.message || translations.DEFAULT.DEFAULT_ERROR_MESSAGE, 'error');
        resolve(false);
      } finally {
        store.dispatch(setIsLoading(false));
        store.dispatch(setIsShowTxPendingPopup(false));
      }
    });
  }

  /**
   * Bulk remove validators
   */
  async bulkRemoveValidators(validators: string[], operatorIds: number[]): Promise<boolean> {
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    const contract = getContractByName(EContractName.SETTER);
    store.dispatch(setIsLoading(true));
    const walletStore: WalletStore = this.getStore('Wallet');
    const ssvStore: SsvStore = this.getStore('SSV');
    const clusterData = await getClusterData(getClusterHash(operatorIds, walletStore.accountAddress), ssvStore.liquidationCollateralPeriod, ssvStore.minimumLiquidationCollateral);
    return new Promise(async (resolve) => {
      try {
        const tx = await contract.bulkRemoveValidator(validators, operatorIds, clusterData);
        if (tx.hash) {
          store.dispatch(setTxHash(tx.hash));
          store.dispatch(setIsShowTxPendingPopup(true));
        }
        if (walletStore.isContractWallet) {
          resolve(true);
        }
        const receipt = await tx.wait();
        if (receipt.blockHash) {
          await executeAfterEvent(async () => !!await getEventByTxHash(receipt.transactionHash), async () => this.refreshOperatorsAndClusters(resolve, true), delay);
        } else {
          resolve(false);
        }
      } catch (e: any) {
        notificationsStore.showMessage(e.message || translations.DEFAULT.DEFAULT_ERROR_MESSAGE, 'error');
        resolve(false);
      } finally {
        store.dispatch(setIsLoading(false));
        store.dispatch(setIsShowTxPendingPopup(false));
      }
    });
  }

  /**
   * Exit validator
   */
  async exitValidator(publicKey: string, operatorIds: number[]): Promise<boolean> {
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    const walletStore: WalletStore = this.getStore('Wallet');
    const contract = getContractByName(EContractName.SETTER);
    store.dispatch(setIsLoading(true));

    return new Promise(async (resolve) => {
      try {
        const tx = await contract.exitValidator(publicKey, operatorIds);
        if (tx.hash) {
          store.dispatch(setTxHash(tx.hash));
          store.dispatch(setIsShowTxPendingPopup(true));
        }
        if (walletStore.isContractWallet) {
          resolve(true);
        }
        const receipt = await tx.wait();
        if (receipt.blockHash) {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (e: any) {
        notificationsStore.showMessage(e.message || translations.DEFAULT.DEFAULT_ERROR_MESSAGE, 'error');
        resolve(false);
      } finally {
        store.dispatch(setIsLoading(false));
        store.dispatch(setIsShowTxPendingPopup(false));
      }
    });
  }

  /**
   * Bulk exit validator
   */
  async bulkExitValidators(validators: string[], operatorIds: number[]): Promise<boolean> {
    const walletStore: WalletStore = this.getStore('Wallet');
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    const contract = getContractByName(EContractName.SETTER);
    store.dispatch(setIsLoading(true));

    return new Promise(async (resolve) => {
      try {
        const tx = await contract.bulkExitValidator(validators, operatorIds);
        if (tx.hash) {
          store.dispatch(setTxHash(tx.hash));
          store.dispatch(setIsShowTxPendingPopup(true));
        }
        if (walletStore.isContractWallet) {
          resolve(true);
        }
        const receipt = await tx.wait();
        if (receipt.blockHash) {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (e: any) {
        notificationsStore.showMessage(e.message || translations.DEFAULT.DEFAULT_ERROR_MESSAGE, 'error');
        resolve(false);
      } finally {
        store.dispatch(setIsLoading(false));
        store.dispatch(setIsShowTxPendingPopup(false));
      }
    });
  }

  /**
   * Update validator
   */
  async updateValidator() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const { KEYSTORE_PUBLIC_KEY, OPERATOR_IDS } = PAYLOAD_KEYS;
      const walletStore: WalletStore = this.getStore('Wallet');
      const contract = getContractByName(EContractName.SETTER);
      const payload = await this.createKeystorePayload();
      if (!payload) {
        store.dispatch(setIsLoading(false));
        store.dispatch(setIsShowTxPendingPopup(false));
        resolve(false);
        return;
      }
      const validatorBefore = await getValidator(`0x${payload.get(KEYSTORE_PUBLIC_KEY)}`);
      try {
        const tx = await contract.updateValidator(...payload.values()).send({ from: walletStore.accountAddress });
        if (tx.hash) {
          store.dispatch(setTxHash(tx.hash));
          store.dispatch(setIsShowTxPendingPopup(true));
        }
        if (walletStore.isContractWallet) {
          resolve(true);
        }
        const receipt = await tx.wait();
        const event: boolean = receipt.hasOwnProperty('events');
        if (event) {
          this.keyStoreFile = null;
          this.newValidatorReceipt = payload.get(OPERATOR_IDS);
          console.debug('Contract Receipt', receipt);
          await executeAfterEvent(async () => await checkEntityChangedInAccount(
            async () => {
              return getValidator(`0x${payload.get(KEYSTORE_PUBLIC_KEY)}`);
            },
            validatorBefore,
          ), async () => this.refreshOperatorsAndClusters(resolve, true), delay);
        } else {
          resolve(false);
        }
      } catch (e) {
        resolve(false);
      } finally {
        store.dispatch(setIsLoading(false));
        store.dispatch(setIsShowTxPendingPopup(false));
      }
    });
  }

  async bulkRegistration() {
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    const walletStore: WalletStore = this.getStore('Wallet');
    return new Promise(async (resolve) => {
      try {
        const { OPERATOR_IDS, CLUSTER_DATA } = PAYLOAD_KEYS;
        const contract = getContractByName(EContractName.SETTER);
        const payload = await this.createKeySharePayload();
        if (!payload) {
          resolve(false);
          return;
        }
        let tx = await contract.bulkRegisterValidator(...payload.values());
        if (tx.hash) {
          store.dispatch(setTxHash(tx.hash));
          store.dispatch(setIsShowTxPendingPopup(true));
        }
        if (walletStore.isContractWallet) {
          resolve(true);
        }
        const receipt = await tx.wait();
        if (receipt.blockHash) {
          const event: boolean = receipt.hasOwnProperty('events');
          if (event) {
            this.keyStoreFile = null;
            this.newValidatorReceipt = payload.get(OPERATOR_IDS);
            GoogleTagManager.getInstance().sendEvent({
              category: 'validators_register',
              action: 'register_tx',
              label: 'success',
            });
            await executeAfterEvent(async () => !!await getEventByTxHash(receipt.transactionHash), async () => this.refreshOperatorsAndClusters(resolve, true), delay);
          }
        } else {
          resolve(false);
        }
      } catch (e: any) {
        console.log(e.data);
        const isRejected: boolean = e.hasOwnProperty('code');
        GoogleTagManager.getInstance().sendEvent({
          category: 'validator_register',
          action: 'register_tx',
          label: isRejected ? 'rejected' : 'error',
        });
        notificationsStore.showMessage(e.message || translations.DEFAULT.DEFAULT_ERROR_MESSAGE, 'error');
        resolve(false);
      } finally {
        store.dispatch(setIsLoading(false));
        store.dispatch(setIsShowTxPendingPopup(false));
      }
    });
  }

  async addNewValidator() {
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    const walletStore: WalletStore = this.getStore('Wallet');
    return new Promise(async (resolve) => {
      try {
        const payload = this.registrationMode === 0 ? await this.createKeySharePayload() : await this.createKeystorePayload();
        const { OPERATOR_IDS, CLUSTER_DATA } = PAYLOAD_KEYS;
        const contract = getContractByName(EContractName.SETTER);
        if (!payload) {
          resolve(false);
          return;
        }

        this.newValidatorReceipt = null;

        console.debug('Add Validator Payload: ', payload);
        const gasLimit = 4075000;

        const provider = new ethers.providers.Web3Provider(walletStore.wallet.provider, 'any');
        console.warn('[addNewValidator] Estimating gas price');
        const gasPrice = await provider.getGasPrice();
        console.warn('[addNewValidator] Estimating gas limit. Gas price: ', gasPrice);
        // const gasLimit = await contract.estimateGas.registerValidator(...payload.values());
        const txParams = {
          gasLimit,
          gasPrice,
          // safeTxGas: gasPrice,
        };
        console.warn(txParams);
        // let tx = await contract.registerValidator(...payload.values(), txParams);
        let tx = await contract.registerValidator(...payload.values());

        if (tx.hash) {
          store.dispatch(setTxHash(tx.hash));
          store.dispatch(setIsShowTxPendingPopup(true));
        }
        if (walletStore.isContractWallet) {
          resolve(true);
        }
        const receipt = await tx.wait();
        if (receipt.blockHash) {
          const event: boolean = receipt.hasOwnProperty('events');
          if (event) {
            this.keyStoreFile = null;
            this.newValidatorReceipt = payload.get(OPERATOR_IDS);
            GoogleTagManager.getInstance().sendEvent({
              category: 'validator_register',
              action: 'register_tx',
              label: 'success',
            });
            await executeAfterEvent(async () =>  !!await getEventByTxHash(receipt.transactionHash), async () => this.refreshOperatorsAndClusters(resolve, true), delay);
          }
        } else {
          resolve(false);
        }
        resolve(false);
      } catch (e: any) {
        const isRejected: boolean = e.hasOwnProperty('code');
        GoogleTagManager.getInstance().sendEvent({
          category: 'validator_register',
          action: 'register_tx',
          label: isRejected ? 'rejected' : 'error',
        });
        notificationsStore.showMessage(e.message || translations.DEFAULT.DEFAULT_ERROR_MESSAGE, 'error');
        resolve(false);
      } finally {
        store.dispatch(setIsLoading(false));
        store.dispatch(setIsShowTxPendingPopup(false));
      }
    });
  }

  async reactivateCluster(amount: string) {
    const notificationsStore: NotificationsStore = this.getStore('Notifications');
    return new Promise(async (resolve) => {
      try {
        const processStore: ProcessStore = this.getStore('Process');
        const contract = getContractByName(EContractName.SETTER);
        const process: SingleCluster = <SingleCluster>processStore.process;
        const walletStore: WalletStore = this.getStore('Wallet');
        const ssvStore: SsvStore = this.getStore('SSV');
        const cluster = process.item;
        // @ts-ignore
        const operatorsIds = cluster.operators.map(({ id }) => Number(id)).sort((a: number, b: number) => a - b);
        const clusterData = await getClusterData(getClusterHash(cluster.operators, walletStore.accountAddress), ssvStore.liquidationCollateralPeriod, ssvStore.minimumLiquidationCollateral);
        const tx = await contract.reactivate(operatorsIds, toWei(amount), clusterData);
        if (tx.hash) {
          store.dispatch(setTxHash(tx.hash));
          store.dispatch(setIsShowTxPendingPopup(true));
        }
        if (walletStore.isContractWallet) {
          resolve(true);
        }
        const receipt = await tx.wait();
        if (receipt.blockHash) {
          const event: boolean = receipt.hasOwnProperty('events');
          if (event) {
            this.keyStoreFile = null;
            GoogleTagManager.getInstance().sendEvent({
              label: 'success',
              category: 'single_cluster',
              action: 'reactivate_cluster',
            });
            resolve(true);
            await executeAfterEvent(async () => !!await getEventByTxHash(receipt.transactionHash), async () => this.refreshOperatorsAndClusters(resolve, true), delay);
          }
        } else {
          resolve(false);
        }
      } catch (e: any) {
        const isRejected: boolean = e.hasOwnProperty('code');
        GoogleTagManager.getInstance().sendEvent({
          category: 'single_cluster',
          action: 'reactivate_cluster',
          label: isRejected ? 'rejected' : 'error',
        });
        notificationsStore.showMessage(e.message || translations.DEFAULT.DEFAULT_ERROR_MESSAGE, 'error');
        resolve(false);
      } finally {
        store.dispatch(setIsLoading(false));
        store.dispatch(setIsShowTxPendingPopup(false));
      }
    });
  }

  async createKeystorePayload(): Promise<Map<string, any> | null> {
    const ssvStore: SsvStore = this.getStore('SSV');
    const walletStore: WalletStore = this.getStore('Wallet');
    const processStore: ProcessStore = this.getStore('Process');
    const operatorStore: OperatorStore = this.getStore('Operator');
    const process: RegisterValidator | SingleCluster = <RegisterValidator | SingleCluster>processStore.process;
    const ownerNonce = await getOwnerNonce({ address: walletStore.accountAddress });
    if (ownerNonce === null) {
      // TODO: add proper error handling
      return null;
    }
    const operators = Object.values(operatorStore.selectedOperators)
      .sort((a: any, b: any) => a.id - b.id)
      .map(item => ({ id: item.id, operatorKey: item.public_key }));
    return new Promise(async (resolve) => {
      try {
        const ssvKeys = new SSVKeys();
        // const keyShares = new KeyShares();
        const { accountAddress } = walletStore;
        const threshold = await ssvKeys.createThreshold(this.keyStorePrivateKey, operators);
        const encryptedShares = await ssvKeys.encryptShares(operators, threshold.shares);
        let totalCost = 'registerValidator' in process ? prepareSsvAmountToTransfer(toWei(process.registerValidator?.depositAmount)) : 0;
        if (process && 'fundingPeriod' in process) {
          const networkCost = propertyCostByPeriod(ssvStore.networkFee, process.fundingPeriod);
          const operatorsCost = propertyCostByPeriod(operatorStore.getSelectedOperatorsFee, process.fundingPeriod);
          let liquidationCollateralCost = new Decimal(operatorStore.getSelectedOperatorsFee).add(ssvStore.networkFee).mul(ssvStore.liquidationCollateralPeriod);
          if (Number(liquidationCollateralCost) < ssvStore.minimumLiquidationCollateral) {
            liquidationCollateralCost = new Decimal(ssvStore.minimumLiquidationCollateral);
          }
          totalCost = prepareSsvAmountToTransfer(toWei(liquidationCollateralCost.add(networkCost).add(operatorsCost).toString()));
        }
        const keysharePayload = await (new KeySharesItem()).buildPayload({
            publicKey: threshold.publicKey,
            operators,
            encryptedShares,
          }, {
            ownerAddress: accountAddress,
            ownerNonce: ownerNonce as number,
            privateKey: this.keyStorePrivateKey,
          });

        const payload = this.createPayload(this.keyStorePublicKey,
          keysharePayload.operatorIds,
          keysharePayload.sharesData || keysharePayload.shares,
          `${totalCost}`,
          await getClusterData(getClusterHash(operators.map(item => item.id), walletStore.accountAddress), ssvStore.liquidationCollateralPeriod, ssvStore.minimumLiquidationCollateral));

        resolve(payload);
      } catch (e: any) {
        console.log(e.message);
        resolve(null);
      }
    });
  }

  async createKeySharePayload(): Promise<Map<string, any> | null> {
    return new Promise(async (resolve) => {
      const ssvStore: SsvStore = this.getStore('SSV');
      const processStore: ProcessStore = this.getStore('Process');
      const walletStore: WalletStore = this.getStore('Wallet');
      const operatorStore: OperatorStore = this.getStore('Operator');
      const process: RegisterValidator | SingleCluster = <RegisterValidator | SingleCluster>processStore.process;
      let totalCost = 'registerValidator' in process ? prepareSsvAmountToTransfer(toWei(process.registerValidator?.depositAmount)) : 0;
      if (process && 'fundingPeriod' in process) {
        const networkCost = propertyCostByPeriod(ssvStore.networkFee, process.fundingPeriod);
        const operatorsCost = propertyCostByPeriod(operatorStore.getSelectedOperatorsFee, process.fundingPeriod);
        let liquidationCollateralCost = new Decimal(operatorStore.getSelectedOperatorsFee).add(ssvStore.networkFee).mul(ssvStore.liquidationCollateralPeriod);
        if (Number(liquidationCollateralCost) < ssvStore.minimumLiquidationCollateral) {
          liquidationCollateralCost = new Decimal(ssvStore.minimumLiquidationCollateral);
        }
        totalCost = prepareSsvAmountToTransfer(toWei(liquidationCollateralCost.add(networkCost).add(operatorsCost).mul(this.isMultiSharesMode ? this.validatorsCount : 1).toString()));
      }
      try {
        const keysharePayload = this.processedKeyShare?.list().find((keyShare: any) => this.registerValidatorsPublicKeys.includes(keyShare.payload.publicKey))?.payload;
        let publicKeys;
        let sharesData;
        const operatorIds = Object.values(operatorStore.selectedOperators).map((operator: IOperator) => operator.id).sort((a: number, b: number) => a - b);

        const keyShares = this.processedKeyShare?.list();

        if (this.isMultiSharesMode && keyShares && keyShares.length > 1) {
          const filteredKeyShares = keyShares.filter((keyShare: any) => this.registerValidatorsPublicKeys.includes(keyShare.payload.publicKey));
          publicKeys = filteredKeyShares.map((keyShare) => keyShare.payload.publicKey);
          sharesData = filteredKeyShares.map((keyShare) => keyShare.payload.sharesData);
        } else if (keysharePayload) {
          publicKeys = keysharePayload?.publicKey;
          sharesData = keysharePayload.sharesData;
        } else {
          publicKeys = '';
          sharesData = [];
        }

        if (keysharePayload) {
          const payload = this.createPayload(
            publicKeys,
            operatorIds,
            sharesData, `${totalCost}`,
            await getClusterData(getClusterHash(operatorIds, walletStore.accountAddress), ssvStore.liquidationCollateralPeriod, ssvStore.minimumLiquidationCollateral));
          resolve(payload);
        }
        resolve(null);
      } catch (e: any) {
        console.log(e.message);
        resolve(null);
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
      this.validatorPublicKeyExist = !!(await getValidator(this.keyStorePublicKey, true));
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
    const notificationsStore: NotificationsStore = this.getStore('Notifications');

    return Promise.all([
      myAccountStore.getOwnerAddressClusters({}),
      myAccountStore.getOwnerAddressOperators({}),
    ])
      .then(() => {
        store.dispatch(setIsLoading(false));
        store.dispatch(setIsShowTxPendingPopup(false));
        resolve(true);
      })
      .catch((error) => {
        store.dispatch(setIsLoading(false));
        if (showError) {
          notificationsStore.showMessage(error.message || translations.DEFAULT.DEFAULT_ERROR_MESSAGE, 'error');
        }
        store.dispatch(setIsShowTxPendingPopup(false));
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

  createPayload(publicKey: string | string[], operatorIds: number[] | number[][], sharesData: string | string[], totalCost: string | string[], clusterData: ClusterDataType) {
    const payload = new Map<string, any>();
    payload.set('keyStorePublicKey', publicKey);
    payload.set('operatorIds', operatorIds);
    payload.set('sharesData', sharesData);
    payload.set('totalCost', `${totalCost}`);
    payload.set('clusterData', clusterData);
    return payload;
  }

  isJsonFile(file: any): boolean {
    return file?.type === 'application/json';
  }
}

export default ValidatorStore;
