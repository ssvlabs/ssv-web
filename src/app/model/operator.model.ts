import { ErrorType } from '~app/components/common/ConversionInput/ConversionInput.tsx';

export interface IOperator {
  id: number;
  id_str: string;
  declared_fee: string;
  previous_fee: string;
  fee: string;
  public_key: string;
  owner_address: string;
  address_whitelist: string;
  verified_operator?: boolean;
  balance: number;
  whitelist_addresses?: string[];
  whitelisting_contract?: string;
  is_private?: boolean;
  location: string;
  setup_provider: string;
  eth1_node_client: string;
  eth2_node_client: string;
  mev_relays: string;
  description: string;
  website_url: string;
  twitter_url: string;
  linkedin_url: string;
  dkg_address: string;
  logo: string;
  type: string;
  name: string;
  performance: {
    '24h': number;
    '30d': number;
  };
  is_valid: boolean;
  is_deleted: boolean;
  is_active: number;
  status: string;
  validators_count: number;
  version: string;
  network: string;
  updated_at: string;
}

export interface GetOperatorByPublicKeyResponse {
  type: string;
  data: {
    primaryId: number;
    id: number;
    network: string;
    version: string;
    ownerAddress: string;
    publicKey: string;
    fee: string;
    previousFee: string;
    declaredFee: string;
    addressWhitelist: string;
    memo: null;
    blockNumber: number;
    isValid: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    whitelistAddresses: string[];
    isPrivate: boolean;
    whitelistingContract: string;
  };
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
