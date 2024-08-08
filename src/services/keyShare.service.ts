import { KeyShares, KeySharesItem } from 'ssv-keys';
import { translations } from '~app/common/config';
import { IOperator } from '~app/model/operator.model.ts';
import { ReactElement } from 'react';

export type KeyShareMulti = {
  version: string;
  createdAt: string;
  shares: KeyShares;
};

export type KeyShareValidationResponse = {
  id: KeyShareValidationResponseId;
  name: string;
  errorMessage: string | ReactElement;
  subErrorMessage?: string;
};

export type KeyShareValidationResult = {
  response: KeyShareValidationResponse;
  operatorsData: IOperator[];
  clusterSizeData: number;
};

export enum KeyShareValidationResponseId {
  OK_RESPONSE_ID,
  OPERATOR_NOT_EXIST_ID,
  OPERATOR_NOT_MATCHING_ID,
  VALIDATOR_EXIST_ID,
  ERROR_RESPONSE_ID,
  PUBLIC_KEY_ERROR_ID,
  INCONSISTENT_OPERATOR_CLUSTER
}

export enum Filters {
  AVAILABLE = 'Available',
  REGISTERED = 'Registered',
  INCORRECT = 'Incorrect',
  ALL = 'All'
}

export type ValidatorType = {
  ownerNonce: number;
  publicKey: string;
  registered: boolean;
  errorMessage: string;
  isSelected: boolean;
  sharesData: string;
};

export type SelectedOperatorData = {
  key: number;
  name: string;
  type: string | undefined;
  hasError: boolean;
  operatorLogo: string;
  operatorId: number;
};

export const parseToMultiShareFormat = (fileJson: string): KeyShareMulti => {
  // TODO replace with call to shares.unified() from ssv-key sdk, per defined the doc 'Multi and single shares specification'
  const parsedFile = JSON.parse(fileJson);
  if (!('shares' in parsedFile)) {
    parsedFile.shares = [{ data: parsedFile.data, payload: parsedFile.payload }];
    delete parsedFile.data;
    delete parsedFile.payload;
  }
  return parsedFile;
};

export const validateConsistentOperatorIds = (keyShare: KeySharesItem, consistentOperatorIds: number[]) => {
  const payloadOperatorIds = keyShare.payload.operatorIds.sort().toString();
  const dataOperatorIds = keyShare.data.operators
    ?.map((operator: { id: number; operatorKey: string }) => operator.id)
    .sort()
    .toString();

  return payloadOperatorIds === dataOperatorIds && dataOperatorIds === consistentOperatorIds.sort().toString();
};

// TODO this is better but still not good. improve later
export const getResponse = (keyShareResponseId: KeyShareValidationResponseId, errorMsg?: string | ReactElement): KeyShareValidationResponse => {
  const { KEYSHARE_RESPONSE } = translations.VALIDATOR;
  switch (keyShareResponseId) {
    case KeyShareValidationResponseId.OK_RESPONSE_ID: {
      return {
        ...KEYSHARE_RESPONSE.OK_RESPONSE,
        id: KeyShareValidationResponseId.OK_RESPONSE_ID
      };
    }
    case KeyShareValidationResponseId.OPERATOR_NOT_EXIST_ID: {
      return {
        ...KEYSHARE_RESPONSE.OPERATOR_NOT_EXIST_RESPONSE,
        id: KeyShareValidationResponseId.OPERATOR_NOT_EXIST_ID
      };
    }
    case KeyShareValidationResponseId.OPERATOR_NOT_MATCHING_ID: {
      return {
        ...KEYSHARE_RESPONSE.OPERATOR_NOT_MATCHING_RESPONSE,
        id: KeyShareValidationResponseId.OPERATOR_NOT_MATCHING_ID
      };
    }
    case KeyShareValidationResponseId.VALIDATOR_EXIST_ID: {
      return {
        ...KEYSHARE_RESPONSE.VALIDATOR_EXIST_RESPONSE,
        id: KeyShareValidationResponseId.VALIDATOR_EXIST_ID
      };
    }
    case KeyShareValidationResponseId.ERROR_RESPONSE_ID: {
      if (!errorMsg) {
        throw Error('Missing error message');
      }
      return {
        ...KEYSHARE_RESPONSE.CATCH_ERROR_RESPONSE,
        id: KeyShareValidationResponseId.ERROR_RESPONSE_ID,
        errorMessage: errorMsg
      };
    }
    case KeyShareValidationResponseId.PUBLIC_KEY_ERROR_ID: {
      return {
        ...KEYSHARE_RESPONSE.VALIDATOR_PUBLIC_KEY_ERROR,
        id: KeyShareValidationResponseId.PUBLIC_KEY_ERROR_ID
      };
    }
    case KeyShareValidationResponseId.INCONSISTENT_OPERATOR_CLUSTER: {
      return {
        ...KEYSHARE_RESPONSE.INCONSISTENT_OPERATOR_CLUSTER,
        id: KeyShareValidationResponseId.INCONSISTENT_OPERATOR_CLUSTER
      };
    }
  }
};

export const getTooltipText = (count: number, condition: boolean): string | false => condition && translations.VALIDATOR.BULK_REGISTRATION.SELECTED_VALIDATORS_TOOLTIP(count);

export const getValidatorCountErrorMessage = (count: number): string => translations.VALIDATOR.BULK_REGISTRATION.OPERATOR_CLOSE_REACH_MAX_VALIDATORS(count);

export const createValidatorsRecord = (keyShareMulti: KeyShares) =>
  keyShareMulti.list().reduce((acc: Record<string, ValidatorType>, keyShare: KeySharesItem) => {
    const { publicKey, ownerNonce } = keyShare.data;
    if (acc[publicKey as string]) {
      throw new Error(translations.VALIDATOR.KEYSHARE_RESPONSE.DUPLICATED_KEY_SHARES.errorMessage);
    }
    acc[publicKey as string] = {
      ownerNonce: ownerNonce as number,
      publicKey: publicKey as string,
      registered: false,
      errorMessage: '',
      isSelected: false,
      sharesData: keyShare.payload.sharesData as string
    };
    return acc;
  }, {});

export const filtersMapping = {
  [Filters.AVAILABLE]: (validator: ValidatorType) => !validator.registered && !validator.errorMessage,
  [Filters.REGISTERED]: (validator: ValidatorType) => validator.registered,
  [Filters.INCORRECT]: (validator: ValidatorType) => validator.errorMessage,
  [Filters.ALL]: (validator: ValidatorType) => validator
};
