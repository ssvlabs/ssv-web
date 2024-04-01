import * as _ from 'lodash';
import Decimal from 'decimal.js';
import config from '~app/common/config';
import { keccak256 } from 'web3-utils';
import { EContractName } from '~app/model/contracts.model';
import { getContractByName } from '~root/services/contracts.service';
import { encodePacked, fromWei, getFeeForYear } from '~root/services/conversions.service';
import { getClusterByHash } from '~root/services/validator.service';
import { IOperator } from '~app/model/operator.model';
import { utils } from 'ethers';

const getSortedOperatorsIds = (operators: IOperator[]) => {
  return operators.map((operator: IOperator) => operator.id).map(Number).sort((a: number, b: number) => a - b);
};

const getClusterHash = (operators: (number | IOperator)[], ownerAddress: string) => {
  let operatorsIds;
  // let operatorsIds;
  if (typeof operators[0] === 'number') {
    operatorsIds = operators.sort();
  } else {
    operatorsIds = getSortedOperatorsIds(operators as IOperator[]);
  }
  return keccak256(encodePacked(ownerAddress, ...operatorsIds));
  // const types = operatorsIds.map(() => 'uint8');
  // // return utils.solidityKeccak256(['string', ...types], [ownerAddress, ...operatorsIds]);
  // return utils.keccak256(encodePacked(ownerAddress, ...operatorsIds));
};

const getClusterBalance = async (operators: IOperator[], ownerAddress: string, liquidationCollateralPeriod: number, minimumLiquidationCollateral: number, convertFromWei?: boolean, injectedClusterData?: any) => {
  const operatorsIds = getSortedOperatorsIds(operators);
  const contract = getContractByName(EContractName.GETTER);
  const clusterData = injectedClusterData ?? await getClusterData(getClusterHash(operators, ownerAddress), liquidationCollateralPeriod, minimumLiquidationCollateral);
  if (!clusterData) return;
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

const isClusterLiquidated = async (operators: number[], ownerAddress: string, liquidationCollateralPeriod: number, minimumLiquidationCollateral: number, injectedClusterData?: any): Promise<boolean> => {
  const operatorsIds = operators.sort();
  const contract = getContractByName(EContractName.GETTER);
  const clusterData: any = injectedClusterData ?? await getClusterData(getClusterHash(operators, ownerAddress), liquidationCollateralPeriod, minimumLiquidationCollateral);
  if (!clusterData) return false;
  try {
    const isLiquidated = await contract.isLiquidated(ownerAddress, operatorsIds, clusterData);
    return isLiquidated;
  } catch (e) {
    return false;
  }
};

const getClusterBurnRate = async (operators: number[], ownerAddress: string, liquidationCollateralPeriod: number, minimumLiquidationCollateral: number, injectedClusterData?: any) => {
  const contract = getContractByName(EContractName.GETTER);
  const operatorsIds = operators.sort();
  const clusterData = injectedClusterData;
  console.log(injectedClusterData);
  console.log(ownerAddress);
  console.log(operators);
  try {
    console.log(contract);
    const burnRate = await contract.getBurnRate(ownerAddress, operatorsIds, clusterData);
    console.log(burnRate);
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
      const isLiquidated = await isClusterLiquidated(Object.values(clusterData.operators), clusterData.ownerAddress, liquidationCollateralPeriod, minimumLiquidationCollateral, clusterData);
      const burnRate: string = await getClusterBurnRate(Object.values(clusterData.operators), clusterData.ownerAddress, liquidationCollateralPeriod, minimumLiquidationCollateral, clusterData);
      console.log(burnRate);
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

const extendClusterEntity = async (cluster: any, ownerAddress: string, liquidationCollateralPeriod: number, minimumLiquidationCollateral: number) => {
  const fullClusterData = await getClusterData(getClusterHash(cluster.operators, ownerAddress), liquidationCollateralPeriod, minimumLiquidationCollateral, true);
  const newBalance = await getClusterBalance(cluster.operators, ownerAddress, liquidationCollateralPeriod, minimumLiquidationCollateral, false, fullClusterData);
  const keys = Object.keys(cluster);
  let camelKeysCluster: any = {};
  keys.forEach((key: string) => {
    camelKeysCluster[_.camelCase(key)] = cluster[key];
  });

  return {
    ...camelKeysCluster,
    runWay: fullClusterData.runWay,
    burnRate: fullClusterData.burnRate,
    balance: newBalance,
    isLiquidated: fullClusterData.isLiquidated,
  };
};

export {
  getSortedOperatorsIds,
  getClusterHash,
  getClusterBalance,
  getClusterNewBurnRate,
  getClusterRunWay,
  getClusterData,
  extendClusterEntity,
};
