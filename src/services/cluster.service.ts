import Decimal from 'decimal.js';
import config from '~app/common/config';
import { keccak256 } from 'web3-utils';
import { EContractName } from '~app/model/contracts.model';
import { getContractByName } from '~root/services/contracts.service';
import {
  encodePacked,
  fromWei,
  getFeeForYear,
  prepareSsvAmountToTransfer,
  toWei,
} from '~root/services/conversions.service';
import { IOperator } from '~app/model/operator.model';
import { ICluster } from '~app/model/cluster.model';
import { getRequest } from '~root/services/httpApi.service';
import { transactionExecutor } from '~root/services/transaction.service';
import { EClusterOperation } from '~app/enums/clusterOperation.enum';
import { getEventByTxHash } from '~root/services/contractEvent.service';

interface ClusterBalanceInteractionProps {
  amount: string;
  cluster: ICluster;
  isContractWallet: boolean;
  accountAddress: string;
  liquidationCollateralPeriod: number;
  minimumLiquidationCollateral: number;
  callbackAfterExecution: Function;
  operation: EClusterOperation
}

const clusterDataDTO = ({ cluster }: { cluster: ICluster }) => ({
  validatorCount: cluster.validatorCount,
  networkFeeIndex: `${cluster.networkFeeIndex}`,
  index: `${cluster.index}`,
  balance: cluster.balance,
  active: cluster.active,
});

const getSortedOperatorsIds = (operators: IOperator[]) => {
  return operators.map((operator: IOperator) => operator.id).map(Number).sort((a: number, b: number) => a - b);
};

const getClusterHash = (operators: (number | IOperator)[], ownerAddress: string) => {
  let operatorsIds;
  if (typeof operators[0] === 'number') {
    operatorsIds = (operators as number[]).sort((a, b) => a - b);
  } else {
    operatorsIds = getSortedOperatorsIds(operators as IOperator[]);
  }
  return keccak256(encodePacked(ownerAddress, ...operatorsIds));
};

const getClusterByHash = async (clusterHash: string): Promise<any> => {
  const url = `${String(config.links.SSV_API_ENDPOINT)}/clusters/${clusterHash}`;
  return await getRequest(url);
};

const getClusterBalance = async (operators: IOperator[], ownerAddress: string, liquidationCollateralPeriod: number, minimumLiquidationCollateral: number, convertFromWei?: boolean, injectedClusterData?: any) => {
  const operatorsIds = getSortedOperatorsIds(operators);
  const contract = getContractByName(EContractName.GETTER);
  const clusterData = injectedClusterData ?? await getClusterData(getClusterHash(operators, ownerAddress), liquidationCollateralPeriod, minimumLiquidationCollateral);
  if (!clusterData || !contract) {
    return 0;
  }
  try {
    const balance = await contract.getBalance(ownerAddress, operatorsIds, clusterData);
    if (convertFromWei) {
      return fromWei(balance);
    }
    return balance;
  } catch (e) {
    return 0;
  }
};

const getClusterNewBurnRate = (operators: Record<string, IOperator>, newAmountOfValidators: number, networkFee: number) => {
  const operatorsFeePerYear = Object.values(operators).reduce((acc: number, operator: IOperator) => Number(acc) + Number(getFeeForYear(fromWei(operator.fee))), 0);
  const operatorsFeePerBlock = new Decimal(operatorsFeePerYear).dividedBy(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).toFixed().toString();
  const networkFeePerBlock = new Decimal(networkFee).toFixed().toString();
  const clusterBurnRate = parseFloat(operatorsFeePerBlock) + parseFloat(networkFeePerBlock);
  return clusterBurnRate * newAmountOfValidators;
};

const isClusterLiquidated = async (operatorsIds: number[], ownerAddress: string, clusterData: any): Promise<boolean> => {
  const sortedOperatorsIds = operatorsIds.sort((a, b) => a - b);
  const contract = getContractByName(EContractName.GETTER);
  if (!clusterData || !contract) return false;
  try {
    const isLiquidated = await contract.isLiquidated(ownerAddress, sortedOperatorsIds, clusterData);
    return isLiquidated;
  } catch (e) {
    return false;
  }
};

const getClusterBurnRate = async (operators: number[], ownerAddress: string, clusterData: any): Promise<string> => {
  const contract = getContractByName(EContractName.GETTER);
  if (!contract) {
    return '';
  }
  const operatorsIds = operators.sort((a, b) => a - b);
  try {
    const burnRate = await contract.getBurnRate(ownerAddress, operatorsIds, clusterData);
    return burnRate;
  } catch (e) {
    return '';
  }
};

const getClusterRunWay = (cluster: any, liquidationCollateralPeriod: number, minimumLiquidationCollateral: number) => {
  const liquidationCollateral = liquidationCollateralPeriod / config.GLOBAL_VARIABLE.BLOCKS_PER_DAY;
  const burnRatePerDay = fromWei(cluster.burnRate) * config.GLOBAL_VARIABLE.BLOCKS_PER_DAY;
  let liquidationCollateralCost = burnRatePerDay * liquidationCollateral;
  if (liquidationCollateralCost < minimumLiquidationCollateral) {
    liquidationCollateralCost = minimumLiquidationCollateral;
  }
  return Math.max((fromWei(cluster.balance) - liquidationCollateralCost) / burnRatePerDay, 0);
};

const getClusterData = async (clusterHash: string, liquidationCollateralPeriod: number, minimumLiquidationCollateral: number, fullData = false) => {
    const response = await getClusterByHash(clusterHash);
    const clusterData = response?.cluster;
    if (clusterData === null) {
      return {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true,
      };
    } else if (fullData) {
      const isLiquidated = await isClusterLiquidated(Object.values(clusterData.operators), clusterData.ownerAddress, clusterData);
      const burnRate: string = await getClusterBurnRate(Object.values(clusterData.operators), clusterData.ownerAddress, clusterData);
      const runWay: number = getClusterRunWay({
        ...clusterData,
        burnRate,
      }, liquidationCollateralPeriod, minimumLiquidationCollateral);
      return { ...clusterData, isLiquidated, runWay, burnRate };
    } else {
      return {
        validatorCount: clusterData.validatorCount,
        networkFeeIndex: clusterData.networkFeeIndex,
        index: clusterData.index,
        balance: clusterData.balance,
        active: clusterData.active,
      };
    }
};

const extendClusterEntity = async (cluster: ICluster, ownerAddress: string, liquidationCollateralPeriod: number, minimumLiquidationCollateral: number) => {
  const operatorIds = cluster.operators.map((operator) => operator.id);
  const clusterData = clusterDataDTO({ cluster });
  const isLiquidated = await isClusterLiquidated(operatorIds, ownerAddress, clusterData);
  const balance = await getClusterBalance(cluster.operators, ownerAddress, liquidationCollateralPeriod, minimumLiquidationCollateral, false, clusterData);
  const burnRate = await getClusterBurnRate(operatorIds, ownerAddress, clusterData);
  const runWay: number = getClusterRunWay({ balance, burnRate }, liquidationCollateralPeriod, minimumLiquidationCollateral);
  return { ...cluster, runWay, burnRate, balance, isLiquidated, clusterData };
};

const depositOrWithdraw = async ({ cluster, amount, accountAddress, isContractWallet, liquidationCollateralPeriod, minimumLiquidationCollateral, callbackAfterExecution, operation }: ClusterBalanceInteractionProps)=> {
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
    callbackAfterExecution,
  });
};

const reactivateCluster = async ({ cluster, accountAddress, isContractWallet, amount, liquidationCollateralPeriod, minimumLiquidationCollateral, callbackAfterExecution }:
                                   { cluster: ICluster; accountAddress: string; isContractWallet: boolean; amount: string; liquidationCollateralPeriod: number; minimumLiquidationCollateral: number; callbackAfterExecution: Function }) => {
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
    callbackAfterExecution,
  });
};

export {
  clusterDataDTO,
  getSortedOperatorsIds,
  getClusterHash,
  getClusterByHash,
  getClusterBalance,
  getClusterNewBurnRate,
  getClusterRunWay,
  getClusterData,
  extendClusterEntity,
  depositOrWithdraw,
  reactivateCluster,
};
