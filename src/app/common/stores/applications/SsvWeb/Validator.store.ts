/* eslint-disable no-async-promise-executor */
import Decimal from 'decimal.js';
import { action, makeObservable, observable } from 'mobx';
import { KeyShares, KeySharesItem, SSVKeys } from 'ssv-keys';
import { EContractName } from '~app/model/contracts.model';
import { IOperator } from '~app/model/operator.model';
import { propertyCostByPeriod } from '~lib/utils/numbers';
import { getOwnerNonce } from '~root/services/account.service';
import { getClusterData, getClusterHash } from '~root/services/cluster.service';
import { getContractByName } from '~root/wagmi/utils';
import { prepareSsvAmountToTransfer, toWei } from '~root/services/conversions.service';
import { transactionExecutor } from '~root/services/transaction.service';
import { fetchIsRegisteredValidator, getLiquidationCollateralPerValidator } from '~root/services/validator.service';
import { createPayload } from '~root/utils/dkg.utils';
import { track } from '~root/mixpanel';
import { setIsPopUpWithIndexingStatus } from '~app/redux/appState.slice.ts';

const annotations = {
  keyStoreFile: observable,
  registerValidatorsPublicKeys: observable,
  keyShareFile: observable,
  setKeyStore: action.bound,
  registrationMode: observable,
  addNewValidator: action.bound,
  keySharePublicKey: observable,
  setKeySharePublicKey: action.bound,
  setKeyShareFile: action.bound,
  setRegisterValidatorsPublicKeys: action.bound,
  keyStorePrivateKey: observable,
  extractKeyStoreData: action.bound,
  clearKeyShareFlowData: action.bound,
  clearKeyStoreFlowData: action.bound,
  validatorPublicKeyExist: observable,
  isMultiSharesMode: observable,
  setMultiSharesMode: action.bound,
  validatorsCount: observable,
  processedKeyShare: observable,
  setProcessedKeyShare: action.bound
};

class ValidatorStore {
  // general
  registrationMode = 0;

  // Key Stores flow
  keyStorePublicKey = '';
  keyStorePrivateKey = '';
  keyStoreFile: File | null = null;
  validatorPublicKeyExist = false;

  // key shares flow
  // keySharePayload: any;
  keySharePublicKey = '';
  keyShareFile: File | null = null;

  // New key shares flow.
  isMultiSharesMode = false;
  processedKeyShare: KeyShares | null = null;
  validatorsCount = 0;
  registerValidatorsPublicKeys: string[] = [];

  constructor() {
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

  async addNewValidator({
    accountAddress,
    isContractWallet,
    isBulk,
    operators,
    networkFee,
    liquidationCollateralPeriod,
    minimumLiquidationCollateral,
    selectedOperatorsFee,
    dispatch,
    depositAmount,
    fundingPeriod
  }: {
    accountAddress: string;
    isContractWallet: boolean;
    isBulk: boolean;
    operators: IOperator[];
    networkFee: number;
    liquidationCollateralPeriod: number;
    minimumLiquidationCollateral: number;
    selectedOperatorsFee: number;
    depositAmount: number;
    fundingPeriod: number | undefined;
    dispatch: Function;
  }) {
    const contract = getContractByName(EContractName.SETTER);
    const contractMethod = isBulk ? contract.bulkRegisterValidator : contract.registerValidator;

    const payload =
      this.registrationMode === 0
        ? await this.createKeySharePayload({
            accountAddress,
            networkFee,
            liquidationCollateralPeriod,
            minimumLiquidationCollateral,
            selectedOperatorsFee,
            selectedOperators: operators,
            depositAmount,
            fundingPeriod
          })
        : await this.createKeystorePayload({
            accountAddress,
            networkFee,
            liquidationCollateralPeriod,
            minimumLiquidationCollateral,
            selectedOperatorsFee,
            selectedOperators: operators,
            depositAmount,
            fundingPeriod
          });
    if (!payload) {
      return false;
    }

    const publicKeys = payload.get('keyStorePublicKey') as string | string[];
    const validators_amount = Array.isArray(publicKeys) ? publicKeys.length : 1;
    const values = payload.values();
    dispatch(setIsPopUpWithIndexingStatus(true));
    return await transactionExecutor({
      contractMethod,
      payload: values,
      getterTransactionState: async () => {
        const { validatorCount } = await getClusterData(getClusterHash(Object.values(operators), accountAddress), liquidationCollateralPeriod, minimumLiquidationCollateral);
        return validatorCount;
      },
      prevState: payload.get('clusterData').validatorCount,
      isContractWallet: isContractWallet,
      dispatch,
      onError: (error: any) => {
        track('Validator Registered', { validators_amount, status: 'error', error_message: error?.message ?? 'unknown error' });
      },
      onSuccess: () => {
        track('Validator Registered', { validators_amount, status: 'success' });
      }
    });
  }

  async createKeystorePayload({
    accountAddress,
    networkFee,
    liquidationCollateralPeriod,
    minimumLiquidationCollateral,
    selectedOperatorsFee,
    selectedOperators,
    depositAmount,
    fundingPeriod
  }: {
    accountAddress: string;
    networkFee: number;
    liquidationCollateralPeriod: number;
    minimumLiquidationCollateral: number;
    selectedOperatorsFee: number;
    selectedOperators: IOperator[];
    depositAmount: number;
    fundingPeriod: number | undefined;
  }): Promise<Map<string, any> | null> {
    const ownerNonce = await getOwnerNonce({ address: accountAddress });
    if (ownerNonce === null) {
      // TODO: add proper error handling
      return null;
    }
    const operators = selectedOperators.sort((a: any, b: any) => a.id - b.id).map((item) => ({ id: item.id, operatorKey: item.public_key }));
    return new Promise(async (resolve) => {
      try {
        const ssvKeys = new SSVKeys();
        // const keyShares = new KeyShares();
        const threshold = await ssvKeys.createThreshold(this.keyStorePrivateKey, operators);
        const encryptedShares = await ssvKeys.encryptShares(operators, threshold.shares);
        let totalCost = prepareSsvAmountToTransfer(toWei(depositAmount));
        if (fundingPeriod) {
          // TODO is it ok to treat value 0 as no fundingPeriod?
          const networkCost = propertyCostByPeriod(networkFee, fundingPeriod);
          const operatorsCost = propertyCostByPeriod(selectedOperatorsFee, fundingPeriod);
          let liquidationCollateralCost = new Decimal(selectedOperatorsFee).add(networkFee).mul(liquidationCollateralPeriod);
          if (Number(liquidationCollateralCost) < minimumLiquidationCollateral) {
            liquidationCollateralCost = new Decimal(minimumLiquidationCollateral);
          }
          totalCost = prepareSsvAmountToTransfer(toWei(liquidationCollateralCost.add(networkCost).add(operatorsCost).toString()));
        }
        const keysharePayload = await new KeySharesItem().buildPayload(
          { publicKey: threshold.publicKey, operators, encryptedShares },
          {
            ownerAddress: accountAddress,
            ownerNonce: ownerNonce as number,
            privateKey: this.keyStorePrivateKey
          }
        );

        const payload = createPayload(
          this.keyStorePublicKey,
          keysharePayload.operatorIds,
          keysharePayload.sharesData || keysharePayload.shares,
          `${totalCost}`,
          await getClusterData(getClusterHash(operators as unknown as IOperator[], accountAddress), liquidationCollateralPeriod, minimumLiquidationCollateral)
        );

        resolve(payload);
      } catch (e: any) {
        console.log(e.message);
        resolve(null);
      }
    });
  }

  async createKeySharePayload({
    accountAddress,
    networkFee,
    liquidationCollateralPeriod,
    minimumLiquidationCollateral,
    selectedOperatorsFee,
    selectedOperators,
    depositAmount,
    fundingPeriod
  }: {
    accountAddress: string;
    networkFee: number;
    liquidationCollateralPeriod: number;
    minimumLiquidationCollateral: number;
    selectedOperatorsFee: number;
    selectedOperators: IOperator[];
    depositAmount: number;
    fundingPeriod: number | undefined;
  }): Promise<Map<string, any> | null> {
    return new Promise(async (resolve) => {
      let totalCost = prepareSsvAmountToTransfer(toWei(depositAmount));
      if (fundingPeriod) {
        // TODO is it ok yo treat value 0 as no fundingPeriod?
        const networkCost = propertyCostByPeriod(networkFee, fundingPeriod);
        const operatorsCost = propertyCostByPeriod(selectedOperatorsFee, fundingPeriod);
        const liquidationCollateralCost = getLiquidationCollateralPerValidator({
          operatorsFee: selectedOperatorsFee,
          networkFee,
          validatorsCount: this.validatorsCount,
          liquidationCollateralPeriod,
          minimumLiquidationCollateral
        });
        totalCost = prepareSsvAmountToTransfer(
          toWei(
            liquidationCollateralCost
              .add(networkCost)
              .add(operatorsCost)
              .mul(this.isMultiSharesMode ? this.validatorsCount : 1)
              .toString()
          )
        );
      }
      try {
        const keysharePayload = this.processedKeyShare?.list().find((keyShare: any) => this.registerValidatorsPublicKeys.includes(keyShare.payload.publicKey))?.payload;
        let publicKeys;
        let sharesData;
        const operatorIds = selectedOperators.map((operator: IOperator) => operator.id).sort((a: number, b: number) => a - b);

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
            sharesData,
            `${totalCost}`,
            await getClusterData(getClusterHash(selectedOperators, accountAddress), liquidationCollateralPeriod, minimumLiquidationCollateral)
          );
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
  async setKeyStore(keyStore: File, callBack?: () => void) {
    try {
      this.keyStorePrivateKey = '';
      this.keyStoreFile = keyStore;
      const fileJson = await keyStore.text();
      this.keyStorePublicKey = JSON.parse(fileJson).pubkey;
      this.validatorPublicKeyExist = !!(await fetchIsRegisteredValidator(`0x${this.keyStorePublicKey}`))?.data;
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

export const validatorStore = new ValidatorStore();
export default ValidatorStore;
