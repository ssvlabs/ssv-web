import { ICluster } from '~app/model/cluster.model';
import { EContractName } from '~app/model/contracts.model';
import { IOperator } from '~app/model/operator.model';
import { setOptimisticCluster, setOptimisticValidator } from '~app/redux/account.slice';
import { store } from '~app/store';
import { stringifyBigints } from '~lib/utils/bigint';
import { add0x } from '~lib/utils/strings';
import { calcBurnRateWei, getClusterRunWay, getSortedOperatorsIds } from '~root/services/cluster.service';
import { transactionExecutor } from '~root/services/transaction.service';
import { getContractByName } from '~root/wagmi/utils';

type RemoveValidatorEvent = {
  eventName: 'ValidatorRemoved';
  args: {
    publicKey: string;
    owner: string;
    operatorIds: bigint[];
    cluster: ICluster['clusterData'];
  };
};

interface IRemoveValidators {
  cluster: ICluster;
  accountAddress: string;
  isContractWallet: boolean;
  validatorPks: string | string[];
  operators: IOperator[];
  liquidationCollateralPeriod: number;
  minimumLiquidationCollateral: number;
  isBulk: boolean;
  dispatch: Function;
}

const removeValidators = async ({
  cluster,
  isContractWallet,
  validatorPks,
  operators,
  liquidationCollateralPeriod,
  minimumLiquidationCollateral,
  isBulk,
  dispatch
}: IRemoveValidators): Promise<boolean> => {
  const sortedOperatorIds = getSortedOperatorsIds(operators);
  // const clusterData = await getClusterData(getClusterHash(operators, accountAddress), liquidationCollateralPeriod, minimumLiquidationCollateral);
  const payload = [validatorPks, sortedOperatorIds, cluster.clusterData];
  const contract = getContractByName(EContractName.SETTER);
  if (!payload) {
    return false;
  }
  return await transactionExecutor({
    contractMethod: isBulk ? contract.bulkRemoveValidator : contract.removeValidator,
    payload,
    onConfirmed: async (events) => {
      const validatorRemovedEvents = (events as RemoveValidatorEvent[]).filter((event) => event.eventName === 'ValidatorRemoved');
      if (!validatorRemovedEvents.length) return;
      const publicKeys = validatorRemovedEvents.map((e) => add0x(e.args.publicKey).toLocaleLowerCase());

      dispatch(
        setOptimisticValidator({
          clusterId: cluster.clusterId,
          publicKeys: publicKeys,
          type: 'deleted'
        })
      );

      const clusterData = stringifyBigints(validatorRemovedEvents[0].args.cluster);
      const burnRate = calcBurnRateWei(cluster.operators, clusterData.validatorCount, store.getState().networkState.networkFeeWei);

      dispatch(
        setOptimisticCluster({
          cluster: {
            ...cluster,
            _isOptimistic: true,
            validatorCount: clusterData.validatorCount,
            burnRate: burnRate.toString() as unknown as Uint8Array,
            isLiquidated: !clusterData.active,
            balance: clusterData.balance,
            runWay: getClusterRunWay({ ...clusterData, burnRate }, liquidationCollateralPeriod, minimumLiquidationCollateral),
            clusterData
          },
          type: 'updated'
        })
      );
    },
    // getterTransactionState: async () => {
    //   const { validatorCount } = await getClusterData(getClusterHash(operators, accountAddress), liquidationCollateralPeriod, minimumLiquidationCollateral);
    //   return validatorCount;
    // },
    // prevState: clusterData.validatorCount,
    isContractWallet,
    dispatch
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
    dispatch
  });
};

export { exitValidators, removeValidators };
