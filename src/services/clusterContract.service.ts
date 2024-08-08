// import { getContractByName } from '~root/wagmi/utils';
import { EClusterOperation } from '~app/enums/clusterOperation.enum';
import { ICluster } from '~app/model/cluster.model';
import { EContractName } from '~app/model/contracts.model';
import { removeCluster, setOptimisticCluster } from '~app/redux/account.slice';
import { store } from '~app/store';
import { stringifyBigints } from '~lib/utils/bigint';
import { calcBurnRateWei, getClusterData, getClusterHash, getClusterRunWay, getSortedOperatorsIds } from '~root/services/cluster.service';
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

type UpdateProps = {
  dispatch: Function;
  cluster: ICluster;
  liquidationCollateralPeriod: number;
  minimumLiquidationCollateral: number;
};
type OnConfirmed = Parameters<typeof transactionExecutor>[0]['onConfirmed'];

const updateClusterFromEvent =
  ({ cluster, dispatch, liquidationCollateralPeriod, minimumLiquidationCollateral }: UpdateProps): OnConfirmed =>
  async (events) => {
    const newClusterData = (events as ClusterEvent[]).find((event) => eventNames.includes(event.eventName))?.args.cluster;
    if (!newClusterData) return console.error('No new cluster data found', events, newClusterData);
    const clusterData = stringifyBigints(newClusterData);
    const burnRate = calcBurnRateWei(cluster.operators, cluster.validatorCount, store.getState().networkState.networkFeeWei);
    if (clusterData.validatorCount === 0 && clusterData.balance === '0') {
      dispatch(removeCluster(cluster.clusterId));
    }
    dispatch(
      setOptimisticCluster({
        cluster: {
          ...cluster,
          validatorCount: clusterData.validatorCount,
          _isOptimistic: true,
          burnRate: burnRate.toString() as unknown as Uint8Array,
          isLiquidated: !clusterData.active,
          balance: clusterData.balance,
          runWay: getClusterRunWay(
            {
              ...clusterData,
              burnRate
            },
            liquidationCollateralPeriod,
            minimumLiquidationCollateral
          ),
          clusterData
        },
        type: 'updated'
      })
    );
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
  isWithdrawAll?: boolean;
}

const depositOrWithdraw = async ({
  cluster,
  amount,
  accountAddress,
  isContractWallet,
  liquidationCollateralPeriod,
  minimumLiquidationCollateral,
  operation,
  isWithdrawAll = false,
  dispatch
}: ClusterBalanceInteractionProps) => {
  const contract = getContractByName(EContractName.SETTER);
  if (!contract) {
    return false;
  }
  const operatorsIds = getSortedOperatorsIds(cluster.operators);
  const ssvAmount = isWithdrawAll ? cluster.balance : prepareSsvAmountToTransfer(toWei(amount));
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
    onConfirmed: updateClusterFromEvent({
      cluster,
      dispatch,
      liquidationCollateralPeriod,
      minimumLiquidationCollateral
    }),
    getterTransactionState: async () => (await getClusterData(clusterHash, liquidationCollateralPeriod, minimumLiquidationCollateral)).balance,
    prevState: cluster.clusterData.balance,
    isContractWallet,
    dispatch
  });
};

const reactivateCluster = async ({
  cluster,
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
  // const clusterData = await getClusterData(getClusterHash(cluster.operators, accountAddress), liquidationCollateralPeriod, minimumLiquidationCollateral);
  const payload = [operatorsIds, amountInWei, cluster.clusterData];
  const contract = getContractByName(EContractName.SETTER);
  return await transactionExecutor({
    contractMethod: contract.reactivate,
    payload,
    onConfirmed: updateClusterFromEvent({
      cluster,
      dispatch,
      liquidationCollateralPeriod,
      minimumLiquidationCollateral
    }),
    // getterTransactionState: async (txHash: string) => (await getEventByTxHash(txHash)).data,
    isContractWallet: isContractWallet,
    dispatch
  });
};

export { depositOrWithdraw, reactivateCluster };
