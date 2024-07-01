import Decimal from 'decimal.js';
import { keccak256 } from 'web3-utils';
import config from '~app/common/config';
import { ICluster } from '~app/model/cluster.model';
import { EContractName } from '~app/model/contracts.model';
import { IOperator } from '~app/model/operator.model';
import { encodePacked, fromWei, getFeeForYear } from '~root/services/conversions.service';
import { getRequest } from '~root/services/httpApi.service';
import { enrichOperator } from '~root/services/operator.service';
import { getContractByName } from '~root/wagmi/utils';

const clusterDataDTO = ({ cluster }: { cluster: ICluster }) => ({
  validatorCount: cluster.validatorCount,
  networkFeeIndex: `${cluster.networkFeeIndex}`,
  index: `${cluster.index}`,
  balance: cluster.balance,
  active: cluster.active
});

const extendClusterEntity = async (cluster: ICluster, ownerAddress: string, liquidationCollateralPeriod: number, minimumLiquidationCollateral: number) => {
  const operatorIds = cluster.operators.map((operator) => operator.id);
  const clusterData = clusterDataDTO({ cluster });
  if (cluster.isLiquidated) {
    return {
      ...cluster,
      runWay: '0',
      burnRate: '0',
      balance: '0',
      clusterData
    };
  }

  const [operators, balance, burnRate] = await Promise.all([
    Promise.all(cluster.operators.map(enrichOperator)),
    getClusterBalance(cluster.operators, ownerAddress, liquidationCollateralPeriod, minimumLiquidationCollateral, false, clusterData),
    getClusterBurnRate(operatorIds, ownerAddress, clusterData)
  ]);

  const runWay: number = getClusterRunWay({ balance, burnRate }, liquidationCollateralPeriod, minimumLiquidationCollateral);
  return {
    ...cluster,
    runWay,
    operators,
    burnRate: burnRate.toString(),
    balance: balance.toString(),
    clusterData
  };
};

const getClustersByOwnerAddress = async ({
  page,
  perPage,
  accountAddress,
  liquidationCollateralPeriod,
  minimumLiquidationCollateral
}: {
  page: number;
  perPage: number;
  accountAddress: string;
  liquidationCollateralPeriod: number;
  minimumLiquidationCollateral: number;
}): Promise<any> => {
  const url = `${String(config.links.SSV_API_ENDPOINT)}/clusters/owner/${accountAddress}?page=${page}&perPage=${perPage}&operatorDetails=operatorDetails&ts=${new Date().getTime()}`;
  const res = await getRequest(url);
  const clusters = await Promise.all(res.clusters.map((cluster: any) => extendClusterEntity(cluster, accountAddress, liquidationCollateralPeriod, minimumLiquidationCollateral)));
  return { clusters, pagination: res.pagination };
};

const getSortedOperatorsIds = (operators: IOperator[]) => {
  return operators
    .map((operator: IOperator) => operator.id)
    .map(Number)
    .sort((a: number, b: number) => a - b);
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

const getClusterBalance = async (
  operators: IOperator[],
  ownerAddress: string,
  liquidationCollateralPeriod: number,
  minimumLiquidationCollateral: number,
  convertFromWei?: boolean,
  injectedClusterData?: any
) => {
  const operatorsIds = getSortedOperatorsIds(operators);
  const contract = getContractByName(EContractName.GETTER);
  const clusterData = injectedClusterData ?? (await getClusterData(getClusterHash(operators, ownerAddress), liquidationCollateralPeriod, minimumLiquidationCollateral));
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
    // TODO: add error handling
    console.warn(e);
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

const isClusterLiquidated = async (operatorsIds: number[], ownerAddress: string, clusterData: any): Promise<boolean> => {
  const sortedOperatorsIds = operatorsIds.sort((a, b) => a - b);
  const contract = getContractByName(EContractName.GETTER);
  if (!clusterData || !contract) return false;
  try {
    return await contract.isLiquidated(ownerAddress, sortedOperatorsIds, clusterData);
  } catch (e) {
    // TODO: add error handling
    console.warn(e);
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
    return await contract.getBurnRate(ownerAddress, operatorsIds, clusterData);
  } catch (e) {
    // TODO: add error handling
    console.warn(e);
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

const getClusterData = async (clusterHash: string, liquidationCollateralPeriod?: number, minimumLiquidationCollateral?: number, fullData = false) => {
  const response = await getClusterByHash(clusterHash);
  const clusterData = response?.cluster;
  if (clusterData === null) {
    return {
      validatorCount: 0,
      networkFeeIndex: 0,
      index: 0,
      balance: 0,
      active: true
    };
  } else if (fullData && liquidationCollateralPeriod && minimumLiquidationCollateral) {
    const isLiquidated = await isClusterLiquidated(Object.values(clusterData.operators), clusterData.ownerAddress, clusterData);
    const burnRate: string = await getClusterBurnRate(Object.values(clusterData.operators), clusterData.ownerAddress, clusterData);
    const runWay: number = getClusterRunWay(
      {
        ...clusterData,
        burnRate
      },
      liquidationCollateralPeriod,
      minimumLiquidationCollateral
    );
    return { ...clusterData, isLiquidated, runWay, burnRate };
  } else {
    return {
      validatorCount: clusterData.validatorCount,
      networkFeeIndex: clusterData.networkFeeIndex,
      index: clusterData.index,
      balance: clusterData.balance,
      active: clusterData.active
    };
  }
};

export {
  clusterDataDTO,
  extendClusterEntity,
  getClusterBalance,
  getClusterByHash,
  getClusterData,
  getClusterHash,
  getClusterNewBurnRate,
  getClusterRunWay,
  getClustersByOwnerAddress,
  getSortedOperatorsIds
};
