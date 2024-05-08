import React from 'react';
import Decimal from 'decimal.js';
import config from '~app/common/config';
import { compareNumbers, formatNumberToUi } from '~lib/utils/numbers';
import { isAddress } from '~root/services/conversions.service';
import LinkText from '~app/components/common/LinkText/LinkText';
import { getOperatorByPublicKey } from '~root/services/operator.service';

interface ErrorObject {
  errorMessage: any,
  shouldDisplay: boolean,
}

export const validatePublicKeyInput = (value: string, callback: React.Dispatch<ErrorObject>): void => {
  const response: ErrorObject = { shouldDisplay: true, errorMessage: '' };
  const regx = /^[A-Za-z0-9]+$/;
  if (value.length === 0) {
    response.errorMessage = 'Please enter an operator key.';
  } else if (value.length !== config.FEATURE.OPERATORS.VALID_KEY_LENGTH) {
    response.errorMessage = <>Invalid operator key - see our <LinkText text={'documentation.'}
                                                                       link={'https://docs.ssv.network/run-a-node/operator-node/installation#generate-operator-keys'}/> to
      generate your key.</>;
  } else if (!regx.test(value)) {
    response.errorMessage = 'Operator key should contain only alphanumeric characters.';
  } else {
    response.shouldDisplay = false;
  }
  callback(response);
};

export const validateAddressInput = (value: string, callback: React.Dispatch<ErrorObject>, skipEmpty: boolean = false, fieldName: string = 'Operator address'): void => {
  const response = { shouldDisplay: true, errorMessage: '' };
  const regx = /^[A-Za-z0-9]+$/;
  if (value.length === 0 && skipEmpty) {
    response.shouldDisplay = false;
  } else if (value.length === 0) {
    response.errorMessage = `Please enter an ${fieldName.toLowerCase()}.`;
  } else if ((value.length !== 42 && value.startsWith('0x')) || (value.length !== 40 && !value.startsWith('0x')) || (!isAddress(value))) {
    response.errorMessage = `${fieldName} must be a valid address format.`;
  } else if (!regx.test(value)) {
    response.errorMessage = `${fieldName} should contain only alphanumeric characters.`;
  } else {
    response.shouldDisplay = false;
  }
  callback(response);
};

export const validateFeeInput = (value: string, callback: Function): void => {
  const response = { shouldDisplay: false, errorMessage: '' };
  // eslint-disable-next-line radix
  if (new Decimal(Number(value) / config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).lessThan(config.GLOBAL_VARIABLE.MINIMUM_OPERATOR_FEE_PER_BLOCK)) {
    response.shouldDisplay = true;
    const minimumFeePerYear = config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR * config.GLOBAL_VARIABLE.MINIMUM_OPERATOR_FEE_PER_BLOCK;
    response.errorMessage = `Fee must be higher than ${formatNumberToUi(minimumFeePerYear)} SSV`;
  } else if (Number.isNaN(Number(value)) || Number.isFinite(value)) {
    response.shouldDisplay = true;
    response.errorMessage = 'Please use numbers only.';
  } else {
    response.shouldDisplay = false;
  }

  callback(response);
};

export const validateOperatorPublicKey = async (publicKey: string): Promise<boolean> => {
  const res = await getOperatorByPublicKey(publicKey);
  return res.data;
};

export const validateFeeUpdate = (previousValue: Decimal, newValue: string, maxFeeIncrease: number, isPrivateOperator: boolean, callback: any): void => {
  const response = { shouldDisplay: false, errorMessage: '' };
  const feeMaximumIncrease = previousValue.mul(maxFeeIncrease).dividedBy(100).plus(Math.abs(Number(previousValue) - 0.01));
  if (Number.isNaN(Number(newValue)) || Number.isFinite(newValue) || !newValue) {
    response.shouldDisplay = true;
    response.errorMessage = 'Please use numbers only.';
  } else if (Number(previousValue) === Number(newValue)) {
    response.shouldDisplay = true;
    response.errorMessage = 'State for fee hasn\'t changed';
  } else if (compareNumbers(previousValue, newValue)) {
    response.shouldDisplay = true;
    response.errorMessage = 'Please set a different fee amount from current.';
  } else if (feeMaximumIncrease.lessThan(newValue)) {
    response.shouldDisplay = true;
    response.errorMessage = `You can only increase your fee up to ${formatNumberToUi(feeMaximumIncrease)}`;
  }
  // eslint-disable-next-line radix
  else if (new Decimal(newValue).dividedBy(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).lessThan(config.GLOBAL_VARIABLE.MINIMUM_OPERATOR_FEE_PER_BLOCK) && Number(newValue) > 0) {
    const minimumFeePerYear = config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR * config.GLOBAL_VARIABLE.MINIMUM_OPERATOR_FEE_PER_BLOCK;
    response.shouldDisplay = true;
    response.errorMessage = `Fee must be higher than ${formatNumberToUi(feeMaximumIncrease)} SSV`;
  } else if (Number(newValue) === 0 && !isPrivateOperator) {
    response.shouldDisplay = true;
    response.errorMessage = 'You must set your operator as private before updating your fee to 0.';
  } else {
    response.errorMessage = '';
    response.shouldDisplay = false;
  }

  callback(response);
};
