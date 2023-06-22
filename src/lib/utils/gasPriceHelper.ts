import { GasGroup, MAX_GAS_PER_GROUP } from '~app/common/config/gasPrices';

const addTenPercent = (value: number): number =>  {
    return Math.floor(value * 1.2);
};

export const getRegisterValidatorGasPrice = (clusterExist: boolean, countOfOperators: number, withoutDeposit: boolean): number => {
    const EVENT = 'REGISTER_VALIDATOR';
    const EVENT_TYPE = clusterExist ? withoutDeposit ? 'WITHOUT_DEPOSIT' : 'EXISTING_CLUSTER' : 'NEW_STATE';
    const OPERATORS_COUNT = countOfOperators > 4 ? `_${countOfOperators}` : '';
    return addTenPercent(MAX_GAS_PER_GROUP[GasGroup[`${EVENT}_${EVENT_TYPE}${OPERATORS_COUNT}`]]);
};

export const getLiquidationGasPrice = (countOfOperators: number): number => {
    const EVENT = 'LIQUIDATE_CLUSTER';
    return addTenPercent(MAX_GAS_PER_GROUP[GasGroup[`${EVENT}${countOfOperators}`]]);
};

export const getFixedGasPrice = (eventType: number) => addTenPercent(MAX_GAS_PER_GROUP[eventType]);
