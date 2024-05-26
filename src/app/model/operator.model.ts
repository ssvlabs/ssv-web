import { ErrorType } from '~app/components/common/ConversionInput/ConversionInput.tsx';

export interface IOperator {
  id: number;
  fee?: string;
  name: string;
  logo?: string;
  type?: string;
  address: string;
  score?: number;
  public_key: string;
  selected?: boolean;
  dappNode?: boolean;
  ownerAddress: string;
  dkg_address?: string;
  mev_relays?: string;
  autoSelected?: boolean;
  validators_count: number;
  declared_fee: string;
  previous_fee: string;
  address_whitelist: string;
  verified_operator?: boolean;
  balance: number;
}

export interface IOperatorRawData {
  id: number;
  fee: number;
  publicKey: string;
  address: string;
}

export type UpdateFeeProps = {
  error: ErrorType;
  nextIsDisabled: boolean;
  onNextHandler: Function;
  onChangeHandler: Function;
  newFee: number | string;
  oldFee: number | string;
  currency: string;
  setCurrency: Function;
  declareNewFeeHandler: Function;
};
