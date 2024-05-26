import { getContractByName } from '~root/services/contracts.service';
import { EContractName } from '~app/model/contracts.model';
import { prepareSsvAmountToTransfer, toWei } from '~root/services/conversions.service';
import { EClusterOperation } from '~app/enums/clusterOperation.enum';
import { transactionExecutor } from '~root/services/transaction.service';
import { ICluster } from '~app/model/cluster.model';
import { getEventByTxHash } from '~root/services/contractEvent.service';
import { getClusterData, getClusterHash, getSortedOperatorsIds } from '~root/services/cluster.service';

interface ClusterBalanceInteractionProps {
  amount: string;
  cluster: ICluster;
  isContractWallet: boolean;
  accountAddress: string;
  liquidationCollateralPeriod: number;
  minimumLiquidationCollateral: number;
  operation: EClusterOperation;
  dispatch: Function;
}

const depositOrWithdraw = async ({
  cluster,
  amount,
  accountAddress,
  isContractWallet,
  liquidationCollateralPeriod,
  minimumLiquidationCollateral,
  operation,
  dispatch
}: ClusterBalanceInteractionProps) => {
  const contract = getContractByName(EContractName.SETTER);
  if (!contract) {
    return false;
  }
  const operatorsIds = getSortedOperatorsIds(cluster.operators);
  const ssvAmount = prepareSsvAmountToTransfer(toWei(amount));
  const clusterHash = getClusterHash(cluster.operators, accountAddress);
  let contractMethod;
  let payload;
  if (operation === EClusterOperation.DEPOSIT) {
    contractMethod = contract.deposit;
    payload = [accountAddress, operatorsIds, ssvAmount, cluster.clusterData];
  } else if (operation === EClusterOperation.WITHDRAW) {
    contractMethod = contract.withdraw;
    payload = [operatorsIds, ssvAmount, cluster.clusterData];
  } else {
    contractMethod = contract.liquidate;
    payload = [accountAddress, operatorsIds, cluster.clusterData];
  }
  return await transactionExecutor({
    contractMethod,
    payload,
    getterTransactionState: async () => (await getClusterData(clusterHash, liquidationCollateralPeriod, minimumLiquidationCollateral)).balance,
    prevState: cluster.clusterData.balance,
    isContractWallet,
    dispatch
  });
};

const reactivateCluster = async ({
  cluster,
  accountAddress,
  isContractWallet,
  amount,
  liquidationCollateralPeriod,
  minimumLiquidationCollateral,
  dispatch
}: {
  cluster: ICluster;
  accountAddress: string;
  isContractWallet: boolean;
  amount: string;
  liquidationCollateralPeriod: number;
  minimumLiquidationCollateral: number;
  dispatch: Function;
}) => {
  const operatorsIds = getSortedOperatorsIds(cluster.operators);
  const amountInWei = toWei(amount);
  const clusterData = await getClusterData(getClusterHash(cluster.operators, accountAddress), liquidationCollateralPeriod, minimumLiquidationCollateral);
  const payload = [operatorsIds, amountInWei, clusterData];
  const contract = getContractByName(EContractName.SETTER);
  return await transactionExecutor({
    contractMethod: contract.reactivate,
    payload,
    getterTransactionState: async (txHash: string) => (await getEventByTxHash(txHash)).data,
    isContractWallet: isContractWallet,
    dispatch
  });
};

export { depositOrWithdraw, reactivateCluster };
