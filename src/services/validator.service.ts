import config from '~app/common/config';
import { getRequest } from '~root/services/httpApi.service';
import Decimal from 'decimal.js';
import { IOperator } from '~app/model/operator.model';
import { IValidator } from '~app/model/validator.model';
import { IPagination } from '~app/model/pagination.model';

const getLiquidationCollateralPerValidator = ({
  operatorsFee,
  networkFee,
  liquidationCollateralPeriod,
  validatorsCount = 1,
  minimumLiquidationCollateral
}: {
  operatorsFee: number;
  networkFee: number;
  liquidationCollateralPeriod: number;
  validatorsCount?: number;
  minimumLiquidationCollateral: number;
}) => {
  let liquidationCollateralCost = new Decimal(operatorsFee).add(networkFee).mul(liquidationCollateralPeriod).mul(validatorsCount);
  if (Number(liquidationCollateralCost) < minimumLiquidationCollateral) {
    liquidationCollateralCost = new Decimal(minimumLiquidationCollateral);
  }
  return liquidationCollateralCost.div(validatorsCount);
};

const fetchValidatorsByClusterHash = async (
  page: number,
  clusterHash: string,
  perPage: number = 7
): Promise<{
  operators: IOperator[];
  validators: IValidator[];
  pagination: IPagination;
}> => {
  const url = `${String(config.links.SSV_API_ENDPOINT)}/clusters/hash/${clusterHash}/?page=${page}&perPage=${perPage}&ts=${new Date().getTime()}`;
  const res = await getRequest(url);
  return res ?? { operators: [], validators: [], pagination: {} };
};

const fetchValidator = async (publicKey: string) => {
  const url = `${String(config.links.SSV_API_ENDPOINT)}/validators/${publicKey.replace('0x', '')}?ts=${new Date().getTime()}`;
  return await getRequest(url);
};

const fetchIsRegisteredValidator = async (publicKey: string) => {
  const url = `${String(config.links.SSV_API_ENDPOINT)}/validators/isRegisteredValidator/${publicKey}?ts=${new Date().getTime()}`;
  return await getRequest(url).then((res) => res ?? { data: null });
};

export { fetchValidatorsByClusterHash, getLiquidationCollateralPerValidator, fetchValidator, fetchIsRegisteredValidator };
