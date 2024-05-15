import config from '~app/common/config';
import { getRequest } from '~root/services/httpApi.service';
import Decimal from 'decimal.js';

const getLiquidationCollateralPerValidator = ({
                                                operatorsFee,
                                                networkFee,
                                                liquidationCollateralPeriod,
                                                validatorsCount = 1,
                                                minimumLiquidationCollateral,
                                              }: {
  operatorsFee: number,
  networkFee: number,
  liquidationCollateralPeriod: number,
  validatorsCount?: number,
  minimumLiquidationCollateral: number
}) => {
  let liquidationCollateralCost = new Decimal(operatorsFee).add(networkFee).mul(liquidationCollateralPeriod).mul(validatorsCount);
  if (Number(liquidationCollateralCost) < minimumLiquidationCollateral) {
    liquidationCollateralCost = new Decimal(minimumLiquidationCollateral);
  }
  return liquidationCollateralCost.div(validatorsCount);
};

const validatorsByClusterHash = async (page: number, clusterHash: string, perPage: number = 7): Promise<any> => {
  const url = `${String(config.links.SSV_API_ENDPOINT)}/clusters/hash/${clusterHash}/?page=${page}&perPage=${perPage}&ts=${new Date().getTime()}`;
  const res = await getRequest(url);
  return res ?? { operators: [], clusters: [], pagination: {} };
};

const getValidator = async (publicKey: string) => {
    const url = `${String(config.links.SSV_API_ENDPOINT)}/validators/${publicKey.replace('0x', '')}?ts=${new Date().getTime()}`;
    return await getRequest(url);
};

export {
  validatorsByClusterHash,
  getLiquidationCollateralPerValidator,
  getValidator,
};
