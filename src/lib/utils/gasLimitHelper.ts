import { GasGroup, MAX_GAS_PER_GROUP } from '~app/common/config/gasLimits';

const USE_HARDCODED_GAS_LIMIT = 'USE_HARDCODED_GAS_LIMIT';

const calculateTenPercentIncrease = (value: number): number | null =>  {
      const result = window.localStorage.getItem(USE_HARDCODED_GAS_LIMIT);
      if ( result && JSON.parse(result)) {
          return Math.floor(value * 1.2);
      }
    return null;
};

export const getRegisterValidatorGasLimit = (clusterExist: boolean, countOfOperators: number, withoutDeposit: boolean): number | null => {
    const EVENT = 'REGISTER_VALIDATOR';
    const EVENT_TYPE = clusterExist ? withoutDeposit ? 'WITHOUT_DEPOSIT' : 'EXISTING_CLUSTER' : 'NEW_STATE';
    const OPERATORS_COUNT = countOfOperators > 4 ? `_${countOfOperators}` : '';
    return calculateTenPercentIncrease(MAX_GAS_PER_GROUP[GasGroup[`${EVENT}_${EVENT_TYPE}${OPERATORS_COUNT}`]]);
};

export const getLiquidationGasLimit = (countOfOperators: number): number | null => {
    const EVENT = 'LIQUIDATE_CLUSTER';
    return calculateTenPercentIncrease(MAX_GAS_PER_GROUP[GasGroup[`${EVENT}_${countOfOperators}`]]);
};

export const getFixedGasLimit = (eventType: number) => calculateTenPercentIncrease(MAX_GAS_PER_GROUP[eventType]);
