// import { getContractByName } from '~root/wagmi/utils';
import { cloneDeepWith, isArray, isPlainObject } from 'lodash';
import { EClusterOperation } from '~app/enums/clusterOperation.enum';
import { ICluster } from '~app/model/cluster.model';
import { EContractName } from '~app/model/contracts.model';
import { setOptimisticCluster } from '~app/redux/account.slice';
import { getClusterData, getClusterHash, getClusterRunWay, getSortedOperatorsIds } from '~root/services/cluster.service';
import { getEventByTxHash } from '~root/services/contractEvent.service';
import { prepareSsvAmountToTransfer, toWei } from '~root/services/conversions.service';
import { transactionExecutor } from '~root/services/transaction.service';
import { getContractByName } from '~root/wagmi/utils';

const eventNames = ['ClusterLiquidated', 'ClusterReactivated', 'ClusterDeposited', 'ClusterWithdrawn'] as const;
type ClusterEvent = {
  eventName: (typeof eventNames)[number];
  args: {
    cluster: ICluster['clusterData'];
  };
};

const convertBigIntsToStrings = <T>(obj: T): T => {
  return cloneDeepWith(obj, (value) => {
    if (isPlainObject(value) || isArray(value)) {
      return undefined; // Continue recursion
    }
    if (typeof value === 'bigint') {
      return value.toString();
    }
  });
};

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
    onConfirmed: (events) => {
      const newClusterData = (events as ClusterEvent[]).find((event) => eventNames.includes(event.eventName))?.args.cluster;
      if (!newClusterData) return console.error('No new cluster data found', events, newClusterData);
      const clusterData = convertBigIntsToStrings(newClusterData);
      console.log('clusterData:', clusterData);
      dispatch(
        setOptimisticCluster({
          cluster: {
            ...cluster,
            balance: cluster.balance,
            runWay: getClusterRunWay(
              {
                ...clusterData,
                burnRate: cluster.burnRate
              },
              liquidationCollateralPeriod,
              minimumLiquidationCollateral
            ),
            clusterData
          },
          type: 'updated'
        })
      );
    },
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
