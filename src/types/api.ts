import type { Prettify } from "@/types/ts-utils";

export type Pagination = {
  total: number;
  pages: number;
  per_page: number;
  page: number;
};

export interface InfinitePagination extends Pagination {
  current_first: number;
  current_last: number;
}

export type WithPagination<T extends Record<string, unknown>> = T & {
  pagination: Pagination;
};

export type WithInfinitePagination<T extends Record<string, unknown>> = T & {
  pagination: InfinitePagination;
};

export type Operator = {
  id: number;
  id_str: string;
  declared_fee: string;
  previous_fee: string;
  fee: string;
  public_key: string;
  owner_address: string;
  address_whitelist: string;
  verified_operator?: boolean;
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
    "24h": number;
    "30d": number;
  };
  is_valid: boolean;
  is_deleted: boolean;
  is_active: number;
  status: string;
  validators_count: number;
  version: string;
  network: string;
  updated_at: number;
};

export type OperatorsSearchResponse = WithInfinitePagination<{
  operators: Operator[];
}>;

export interface Validator {
  public_key: string;
  cluster: string;
  owner_address: string;
  status: string;
  is_valid: boolean;
  is_deleted: boolean;
  is_public_key_valid: boolean;
  is_shares_valid: boolean;
  is_operators_valid: boolean;
  operators: Operator[];
  version: string;
  network: string;
  updated_at?: string;
}

export type PaginatedValidatorsResponse = {
  validators: Validator[];
  pagination: {
    total: number;
    pages: number;
    per_page: number;
    page: number;
  };
};

export type SolidityCluster = {
  active: boolean;
  balance: bigint;
  index: bigint;
  networkFeeIndex: bigint;
  validatorCount: number;
};

export type Cluster<
  T extends { operators: (Operator | number)[] } = { operators: Operator[] },
> = Prettify<
  {
    id: number;
    clusterId: string;
    network: string;
    version: string;
    ownerAddress: string;
    validatorCount: number;
    networkFeeIndex: string;
    index: string;
    balance: string;
    active: boolean;
    isLiquidated: boolean;
    blockNumber: number;
    createdAt: string;
    updatedAt: string;
  } & T
>;

export type GetPaginatedClustersResponse = WithPagination<{
  type: string;
  clusters: Cluster[];
}>;

export interface GetClusterResponse {
  type: string;
  cluster: Cluster<{ operators: number[] }> | null;
}

export type Country = {
  "alpha-2": string;
  "alpha-3": string;
  "country-code": string;
  "intermediate-region": string;
  "intermediate-region-code": string;
  "iso_3166-2": string;
  name: string;
  region: string;
  "region-code": string;
  "sub-region": string;
  "sub-region-code": string;
};

export interface GetOperatorByPublicKeyResponse {
  type: string;
  data?: {
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
