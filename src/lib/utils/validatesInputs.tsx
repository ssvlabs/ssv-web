import Decimal from 'decimal.js';
import config from '~app/common/config';
import { compareNumbers, formatNumberToUi } from '~lib/utils/numbers';
import { getFeeForYear, isAddress } from '~root/services/conversions.service';
import LinkText from '~app/components/common/LinkText/LinkText';
import { ReactElement } from 'react';
import styled from 'styled-components';

const OPERATOR_VALID_KEY_LENGTH = 612;
const THRESHOLD = 1;

interface ErrorObject {
  errorMessage: string | Element | ReactElement;
  shouldDisplay: boolean;
}

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const BoldText = styled.p`
  font-weight: 700;
`;

export const validatePublicKeyInput = (value: string, callback: React.Dispatch<ErrorObject>): void => {
  const response: ErrorObject = { shouldDisplay: true, errorMessage: '' };
  const regx = /^[A-Za-z0-9]+$/;
  if (value.length === 0) {
    response.errorMessage = 'Please enter an operator key.';
  } else if (value.length !== OPERATOR_VALID_KEY_LENGTH) {
    response.errorMessage = (
      <>
        Invalid operator key - see our <LinkText text={'documentation.'} link={'https://docs.ssv.network/run-a-node/operator-node/installation#generate-operator-keys'} /> to
        generate your key.
      </>
    );
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
  } else if ((value.length !== 42 && value.startsWith('0x')) || (value.length !== 40 && !value.startsWith('0x')) || !isAddress(value)) {
    response.errorMessage = `${fieldName} must be a valid address format.`;
  } else if (!regx.test(value)) {
    response.errorMessage = `${fieldName} should contain only alphanumeric characters.`;
  } else {
    response.shouldDisplay = false;
  }
  callback(response);
};

export const validateFeeInput = ({ value, maxFee, callback, isPrivate }: { value: string; maxFee: number; callback: Function; isPrivate: boolean }): void => {
  const response: ErrorObject = { shouldDisplay: false, errorMessage: '' };
  const maxFeePerYear = Number(getFeeForYear(maxFee));
  if (new Decimal(Number(value) / config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).lessThan(config.GLOBAL_VARIABLE.MINIMUM_OPERATOR_FEE_PER_BLOCK) && Number(value) !== 0) {
    response.shouldDisplay = true;
    const minimumFeePerYear = config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR * config.GLOBAL_VARIABLE.MINIMUM_OPERATOR_FEE_PER_BLOCK;
    response.errorMessage = `Fee must be higher than ${minimumFeePerYear} SSV`;
  } else if (Number(value) === 0 && !isPrivate) {
    response.shouldDisplay = true;
    response.errorMessage = (
      <div>
        <ErrorWrapper>
          Fee cannot be set to 0 while operator status is set to&nbsp;
          <BoldText>public</BoldText>.
        </ErrorWrapper>
        <ErrorWrapper>
          To set the fee to 0, switch the operator status to&nbsp;<BoldText>private</BoldText>&nbsp;in the previous step.
        </ErrorWrapper>
      </div>
    );
  } else if (Number(value) > maxFeePerYear) {
    response.shouldDisplay = true;
    response.errorMessage = ` Fee must be lower than ${maxFeePerYear} SSV`;
  } else if (Number.isNaN(Number(value)) || Number.isFinite(value)) {
    response.shouldDisplay = true;
    response.errorMessage = 'Please use numbers only.';
  } else {
    response.shouldDisplay = false;
  }

  callback(response);
};

export const validateFeeUpdate = ({
  previousValue,
  newValue,
  maxFeeIncrease,
  isPrivateOperator,
  maxFee,
  callback
}: {
  previousValue: Decimal;
  newValue: string;
  maxFeeIncrease: number;
  isPrivateOperator: boolean;
  maxFee: number;
  callback: any;
}): void => {
  const response = { shouldDisplay: false, errorMessage: '' };
  const feeMaximumIncrease = previousValue
    .mul(maxFeeIncrease)
    .dividedBy(100)
    .plus(Number(previousValue) < THRESHOLD ? previousValue : Number(previousValue) - 0.01);
  const maxFeePerYear = Number(getFeeForYear(maxFee));
  if (Number.isNaN(Number(newValue)) || Number.isFinite(newValue) || !newValue) {
    response.shouldDisplay = true;
    response.errorMessage = 'Please use numbers only.';
  } else if (Number(previousValue) === Number(newValue)) {
    response.shouldDisplay = true;
    response.errorMessage = "State for fee hasn't changed";
  } else if (compareNumbers(previousValue, newValue)) {
    response.shouldDisplay = true;
    response.errorMessage = 'Please set a different fee amount from current.';
  } else if (feeMaximumIncrease.lessThan(newValue)) {
    response.shouldDisplay = true;
    response.errorMessage = `You can only increase your fee up to ${formatNumberToUi(feeMaximumIncrease)}`;
  } else if (Number(newValue) > maxFeePerYear) {
    response.shouldDisplay = true;
    response.errorMessage = ` Fee must be lower than ${maxFeePerYear} SSV`;
  } else if (
    (new Decimal(newValue).dividedBy(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).lessThan(config.GLOBAL_VARIABLE.MINIMUM_OPERATOR_FEE_PER_BLOCK) && Number(newValue) > 0) ||
    Number(newValue) < 0
  ) {
    const minimumFeePerYear = config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR * config.GLOBAL_VARIABLE.MINIMUM_OPERATOR_FEE_PER_BLOCK;
    response.shouldDisplay = true;
    response.errorMessage = `Fee must be higher than ${minimumFeePerYear} SSV`;
  } else if (Number(newValue) === 0 && !isPrivateOperator) {
    response.shouldDisplay = true;
    response.errorMessage = 'You must set your operator as private before updating your fee to 0.';
  } else {
    response.errorMessage = '';
    response.shouldDisplay = false;
  }

  callback(response);
};
