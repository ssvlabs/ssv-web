import Decimal from 'decimal.js';
import { KeySharesItem } from 'ssv-keys';
import { SSVKeys, KeyShares } from 'ssv-keys';
import { action, makeObservable, observable } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';
import { propertyCostByPeriod } from '~lib/utils/numbers';
import { EContractName } from '~app/model/contracts.model';
import { prepareSsvAmountToTransfer, toWei } from '~root/services/conversions.service';
import { getContractByName } from '~root/services/contracts.service';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import { IOperator } from '~app/model/operator.model';
import { getClusterData, getClusterHash, getSortedOperatorsIds } from '~root/services/cluster.service';
import { getLiquidationCollateralPerValidator, getValidator } from '~root/services/validator.service';
import { getOwnerNonce } from '~root/services/account.service';
import { SingleCluster, RegisterValidator } from '~app/model/processes.model';
import { transactionExecutor } from '~root/services/transaction.service';
import { createPayload } from '~root/utils/dkg.utils';
import { getEventByTxHash } from '~root/services/contractEvent.service';

const annotations = {
  keyStoreFile: observable,
  registerValidatorsPublicKeys: observable,
  keyShareFile: observable,
  setKeyStore: action.bound,
  registrationMode: observable,
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
  extractKeyStoreData: action.bound,
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
  registrationMode = 0;

  // Key Stores flow
  keyStorePublicKey: string = '';
  keyStorePrivateKey: string = '';
  keyStoreFile: File | null = null;
  validatorPublicKeyExist: boolean = false;

  // key shares flow
  // keySharePayload: any;
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

  async removeValidator({ accountAddress, isContractWallet, publicKey, operators, liquidationCollateralPeriod, minimumLiquidationCollateral, dispatch }:
                          { accountAddress: string; isContractWallet: boolean; publicKey: string; operators: IOperator[]; liquidationCollateralPeriod: number; minimumLiquidationCollateral: number; dispatch: Function; }): Promise<boolean> {
    const sortedOperatorIds = getSortedOperatorsIds(operators);
    const clusterData = await getClusterData(getClusterHash(operators, accountAddress), liquidationCollateralPeriod, minimumLiquidationCollateral);
    const payload =  [publicKey, sortedOperatorIds, clusterData] ;
    const contract = getContractByName(EContractName.SETTER);
    if (!payload) {
      return false;
    }
    return await transactionExecutor({
      contractMethod: contract.removeValidator,
      payload,
      getterTransactionState: async () => !await getValidator(publicKey),
      isContractWallet,
      dispatch,
    });
  }

  /**
   * Bulk remove validators
   */
  async bulkRemoveValidators({ accountAddress, isContractWallet, validatorPks, operators, liquidationCollateralPeriod, minimumLiquidationCollateral, dispatch }:
                               { accountAddress: string; isContractWallet: boolean; validatorPks: string[]; operators: IOperator[]; liquidationCollateralPeriod: number; minimumLiquidationCollateral: number; dispatch: Function; }): Promise<boolean> {
    const sortedOperatorIds = getSortedOperatorsIds(operators);
    const clusterData = await getClusterData(getClusterHash(operators, accountAddress), liquidationCollateralPeriod, minimumLiquidationCollateral);
    const payload = [validatorPks, sortedOperatorIds, clusterData];
    const contract = getContractByName(EContractName.SETTER);
    if (!payload) {
      return false;
    }
    return await transactionExecutor({
      contractMethod: contract.bulkRemoveValidator,
      payload,
      getterTransactionState: async () => !await getValidator(validatorPks[0]),
      isContractWallet,
      dispatch,
    });
  }

  /**
   * Exit validator
   */
  async exitValidator({ isContractWallet, publicKey, operatorIds, dispatch }: { isContractWallet: boolean; publicKey: string; operatorIds: number[]; dispatch: Function; }): Promise<boolean> {
    const payload = [publicKey, operatorIds];
    const contract = getContractByName(EContractName.SETTER);
    return await transactionExecutor({
      contractMethod: contract.exitValidator,
      payload,
      isContractWallet: isContractWallet,
      dispatch,
    });
  }

  /**
   * Bulk exit validator
   */
  async bulkExitValidators({ isContractWallet, validatorIds, operatorIds, dispatch }: { isContractWallet: boolean; validatorIds: string[]; operatorIds: number[]; dispatch: Function; }): Promise<boolean> {
    const payload = [validatorIds, operatorIds];
    const contract = getContractByName(EContractName.SETTER);
    return await transactionExecutor({
      contractMethod: contract.bulkExitValidator,
      payload,
      isContractWallet: isContractWallet,
      dispatch,
    });
  }

  async bulkRegistration({ accountAddress, isContractWallet, networkFee, liquidationCollateralPeriod, minimumLiquidationCollateral, dispatch }:
                           { accountAddress: string; isContractWallet: boolean; networkFee: number; liquidationCollateralPeriod: number; minimumLiquidationCollateral: number; dispatch: Function; }) {
    const payload = await this.createKeySharePayload({ accountAddress, networkFee, liquidationCollateralPeriod, minimumLiquidationCollateral });
    const contract = getContractByName(EContractName.SETTER);
    if (!payload) {
      return false;
    }
    return await transactionExecutor({
      contractMethod: contract.bulkRegisterValidator,
      payload: payload.values(),
      getterTransactionState: async (txHash: string) => (await getEventByTxHash(txHash)).data,
      isContractWallet: isContractWallet,
      dispatch,
    });
  }

  async addNewValidator({ accountAddress, isContractWallet, networkFee, liquidationCollateralPeriod, minimumLiquidationCollateral, dispatch }:
                          { accountAddress: string; isContractWallet: boolean; networkFee: number; liquidationCollateralPeriod: number; minimumLiquidationCollateral: number; dispatch: Function; }) {
    const payload = this.registrationMode === 0 ?
      await this.createKeySharePayload({ accountAddress, networkFee, liquidationCollateralPeriod, minimumLiquidationCollateral }) :
      await this.createKeystorePayload({ accountAddress, networkFee, liquidationCollateralPeriod, minimumLiquidationCollateral });
    const contract = getContractByName(EContractName.SETTER);
    if (!payload) {
      return false;
    }
    return await transactionExecutor({
      contractMethod: contract.registerValidator,
      payload: payload.values(),
      getterTransactionState: async (txHash: string) => (await getEventByTxHash(txHash)).data,
      isContractWallet: isContractWallet,
      dispatch,
    });
  }

  async createKeystorePayload({ accountAddress, networkFee, liquidationCollateralPeriod, minimumLiquidationCollateral }:
                                { accountAddress: string; networkFee: number; liquidationCollateralPeriod: number; minimumLiquidationCollateral: number }): Promise<Map<string, any> | null> {
    const processStore: ProcessStore = this.getStore('Process');
    const operatorStore: OperatorStore = this.getStore('Operator');
    const process: RegisterValidator | SingleCluster = <RegisterValidator | SingleCluster>processStore.process;
    const ownerNonce = await getOwnerNonce({ address: accountAddress });
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
        const threshold = await ssvKeys.createThreshold(this.keyStorePrivateKey, operators);
        const encryptedShares = await ssvKeys.encryptShares(operators, threshold.shares);
        let totalCost = 'registerValidator' in process ? prepareSsvAmountToTransfer(toWei(process.registerValidator?.depositAmount)) : 0;
        if (process && 'fundingPeriod' in process) {
          const networkCost = propertyCostByPeriod(networkFee, process.fundingPeriod);
          const operatorsCost = propertyCostByPeriod(operatorStore.getSelectedOperatorsFee, process.fundingPeriod);
          let liquidationCollateralCost = new Decimal(operatorStore.getSelectedOperatorsFee).add(networkFee).mul(liquidationCollateralPeriod);
          if (Number(liquidationCollateralCost) < minimumLiquidationCollateral) {
            liquidationCollateralCost = new Decimal(minimumLiquidationCollateral);
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

        const payload = createPayload(this.keyStorePublicKey,
          keysharePayload.operatorIds,
          keysharePayload.sharesData || keysharePayload.shares,
          `${totalCost}`,
          await getClusterData(getClusterHash(operators as unknown as IOperator[], accountAddress), liquidationCollateralPeriod, minimumLiquidationCollateral));

        resolve(payload);
      } catch (e: any) {
        console.log(e.message);
        resolve(null);
      }
    });
  }

  async createKeySharePayload({ accountAddress, networkFee, liquidationCollateralPeriod, minimumLiquidationCollateral }:
                                { accountAddress: string; networkFee: number; liquidationCollateralPeriod: number; minimumLiquidationCollateral: number }): Promise<Map<string, any> | null> {
    return new Promise(async (resolve) => {
      const processStore: ProcessStore = this.getStore('Process');
      const operatorStore: OperatorStore = this.getStore('Operator');
      const process: RegisterValidator | SingleCluster = <RegisterValidator | SingleCluster>processStore.process;
      let totalCost = 'registerValidator' in process ? prepareSsvAmountToTransfer(toWei(process.registerValidator?.depositAmount)) : 0;
      if (process && 'fundingPeriod' in process) {
        const networkCost = propertyCostByPeriod(networkFee, process.fundingPeriod);
        const operatorsCost = propertyCostByPeriod(operatorStore.getSelectedOperatorsFee, process.fundingPeriod);
        let liquidationCollateralCost = getLiquidationCollateralPerValidator({
          operatorsFee: operatorStore.getSelectedOperatorsFee,
          networkFee,
          validatorsCount: this.validatorsCount,
          liquidationCollateralPeriod,
          minimumLiquidationCollateral,
        });
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
          const payload = createPayload(
            publicKeys,
            operatorIds,
            sharesData, `${totalCost}`,
            await getClusterData(getClusterHash(Object.values(operatorStore.selectedOperators), accountAddress), liquidationCollateralPeriod, minimumLiquidationCollateral));
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
      const fileJson = await keyStore.text();
      this.keyStorePublicKey = JSON.parse(fileJson).pubkey;
      this.validatorPublicKeyExist = !!(await getValidator(this.keyStorePublicKey));
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
}

export default ValidatorStore;
