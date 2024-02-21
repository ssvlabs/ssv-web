import * as _ from 'lodash';
import Decimal from 'decimal.js';
import { keccak256 } from 'web3-utils';
import config from '~app/common/config';
import Validator from '~lib/api/Validator';
import { EContractName } from '~app/model/contracts.model';
import { IOperator } from '~app/common/stores/applications/SsvWeb';
import { getContractByName } from '~root/services/contracts.service';
import { encodePacked, fromWei, getFeeForYear } from '~root/services/conversions.service';

const getSortedOperatorsIds = (operators: (number | IOperator)[]) => {
  if (typeof operators[0] === 'number') {
    return operators.map(Number).sort((a: number, b: number) => a - b);
  } else {
    return operators.map((operator: IOperator | number) => {
      if (typeof operator !== 'number' && 'id' in operator) {
        return operator.id;
      }
    }).map(Number).sort((a: number, b: number) => a - b);
  }
};

const getClusterHash = (operators: (number | IOperator)[], ownerAddress: string) => {
  const operatorsIds = getSortedOperatorsIds(operators);
  return keccak256(encodePacked(ownerAddress, ...operatorsIds));
};

const getClusterBalance = async (operators: number[] | IOperator[], ownerAddress: string, liquidationCollateralPeriod: number, minimumLiquidationCollateral: number, injectedClusterData?: any) => {
  const operatorsIds = getSortedOperatorsIds(operators);
  const contract = getContractByName(EContractName.GETTER);
  const clusterData = injectedClusterData ?? await getClusterData(getClusterHash(operators, ownerAddress), liquidationCollateralPeriod, minimumLiquidationCollateral);
  if (!clusterData) return;
  try {
    const balance = await contract.getBalance(ownerAddress, operatorsIds, clusterData);
    return balance;
  } catch (e) {
    return 0;
  }
};

const getClusterNewBurnRate = (operators: IOperator[], newAmountOfValidators: number, networkFee: number) => {
  const operatorsFeePerYear = operators.reduce((acc: number, operator: IOperator) => Number(acc) + Number(getFeeForYear(fromWei(operator.fee))), 0);
  const operatorsFeePerBlock = new Decimal(operatorsFeePerYear).dividedBy(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).toFixed().toString();
  const networkFeePerBlock = new Decimal(networkFee).toFixed().toString();
  const clusterBurnRate = parseFloat(operatorsFeePerBlock) + parseFloat(networkFeePerBlock);
  return clusterBurnRate * newAmountOfValidators;
};

const isClusterLiquidated = async (operators: (number | IOperator)[], ownerAddress: string, liquidationCollateralPeriod: number, minimumLiquidationCollateral: number, injectedClusterData?: any) => {
  const operatorsIds = getSortedOperatorsIds(operators);
  const contract = getContractByName(EContractName.GETTER);
  const clusterData: any = injectedClusterData ?? await getClusterData(getClusterHash(operators, ownerAddress), liquidationCollateralPeriod, minimumLiquidationCollateral);
  if (!clusterData) return;
  try {
    const isLiquidated = await contract.isLiquidated(ownerAddress, operatorsIds, clusterData);
    return isLiquidated;
  } catch (e) {
    return false;
  }
};

const getClusterBurnRate = async (operators: (number | IOperator)[], ownerAddress: string, liquidationCollateralPeriod: number, minimumLiquidationCollateral: number, injectedClusterData?: any) => {
  const contract = getContractByName(EContractName.GETTER);
  const operatorsIds = getSortedOperatorsIds(operators);
  const clusterData = injectedClusterData ?? await getClusterData(getClusterHash(operators, ownerAddress), liquidationCollateralPeriod, minimumLiquidationCollateral);
  try {
    const burnRate = await contract.getBurnRate(ownerAddress, operatorsIds, clusterData);
    return burnRate;
  } catch (e) {
    return 0;
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
  try {
    const response = await Validator.getInstance().getClusterData(clusterHash);
    const clusterData = response.cluster;
    if (clusterData === null) {
      return {
        validatorCount: 0,
        networkFeeIndex: 0,
        index: 0,
        balance: 0,
        active: true,
      };
    } else if (fullData) {
      const isLiquidated: boolean = await isClusterLiquidated(Object.values(clusterData.operators), clusterData.ownerAddress, liquidationCollateralPeriod, minimumLiquidationCollateral);
      const burnRate: string = await getClusterBurnRate(Object.values(clusterData.operators), clusterData.ownerAddress, liquidationCollateralPeriod, minimumLiquidationCollateral);
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
  } catch (e) {
    return null;
  }
};

const extendClusterEntity = async (cluster: any, ownerAddress: string, liquidationCollateralPeriod: number, minimumLiquidationCollateral: number) => {
  const clusterData = await getClusterData(getClusterHash(cluster.operators, ownerAddress), liquidationCollateralPeriod, minimumLiquidationCollateral);
  const newBalance = await getClusterBalance(cluster.operators, ownerAddress, liquidationCollateralPeriod, minimumLiquidationCollateral, clusterData);
  const burnRate = await getClusterBurnRate(cluster.operators, ownerAddress, liquidationCollateralPeriod, minimumLiquidationCollateral, clusterData);
  const isLiquidated = await isClusterLiquidated(cluster.operators, ownerAddress, liquidationCollateralPeriod, minimumLiquidationCollateral, clusterData);
  const runWay = getClusterRunWay({
    ...cluster,
    burnRate: burnRate,
    balance: newBalance,
  }, liquidationCollateralPeriod, minimumLiquidationCollateral);

  const keys = Object.keys(cluster);
  let camelKeysCluster: any = {};
  keys.forEach((key: string) => {
    camelKeysCluster[_.camelCase(key)] = cluster[key];
  });

  return {
    ...camelKeysCluster,
    runWay,
    burnRate,
    balance: newBalance,
    isLiquidated,
  };
};

export {
  getSortedOperatorsIds,
  getClusterHash,
  getClusterBalance,
  getClusterNewBurnRate,
  isClusterLiquidated,
  getClusterBurnRate,
  getClusterRunWay,
  getClusterData,
  extendClusterEntity,
};
