import { IOperator } from '~app/model/operator.model';
import { getClusterData, getClusterHash, getSortedOperatorsIds } from '~root/services/cluster.service';
import { getContractByName } from '~root/services/contracts.service';
import { EContractName } from '~app/model/contracts.model';
import { transactionExecutor } from '~root/services/transaction.service';

interface IRemoveValidators {
  accountAddress: string;
  isContractWallet: boolean;
  validatorPks: string | string[];
  operators: IOperator[];
  liquidationCollateralPeriod: number;
  minimumLiquidationCollateral: number;
  isBulk: boolean;
  dispatch: Function;
}

const removeValidators = async ({ accountAddress, isContractWallet, validatorPks, operators, liquidationCollateralPeriod, minimumLiquidationCollateral, isBulk, dispatch }: IRemoveValidators): Promise<boolean> => {
  const sortedOperatorIds = getSortedOperatorsIds(operators);
  const clusterData = await getClusterData(getClusterHash(operators, accountAddress), liquidationCollateralPeriod, minimumLiquidationCollateral);
  const payload = [validatorPks, sortedOperatorIds, clusterData];
  const contract = getContractByName(EContractName.SETTER);
  if (!payload) {
    return false;
  }
  return await transactionExecutor({
    contractMethod: isBulk ? contract.bulkRemoveValidator : contract.removeValidator,
    payload,
    getterTransactionState: async () => {
      const { validatorCount } = await getClusterData(getClusterHash(operators, accountAddress), liquidationCollateralPeriod, minimumLiquidationCollateral);
      return validatorCount;
    },
    prevState: clusterData.validatorCount,
    isContractWallet,
    dispatch,
  });
};

interface IExitValidators {
  isContractWallet: boolean;
  validatorIds: string | string[];
  operatorIds: number[];
  isBulk: boolean;
  dispatch: Function;
}

const exitValidators = async ({ isContractWallet, validatorIds, operatorIds, isBulk, dispatch }: IExitValidators): Promise<boolean> => {
  const payload = [validatorIds, operatorIds];
  const contract = getContractByName(EContractName.SETTER);
  return await transactionExecutor({
    contractMethod: isBulk ? contract.bulkExitValidator : contract.exitValidator,
    payload,
    isContractWallet,
    dispatch,
  });
};

export { removeValidators, exitValidators };
