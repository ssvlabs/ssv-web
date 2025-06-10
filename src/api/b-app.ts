import { api } from "@/lib/api-client.ts";
import { endpoint } from "@/api/index.ts";
import type { Pagination } from "@/types/api.ts";
import type { Address } from "abitype";
import {
  serializerStrategiesSearch,
  type StrategiesSearchParams,
} from "@/lib/search-parsers/strategy-search-parsers";

export type NonSlashableAsset = {
  effectiveBalance: bigint;
  totalDelegatedValue?: bigint;
  totalDelegatedFiat?: string;
  delegations: (Delegation & AccountMetadata)[];
};

export type Delegation = {
  percentage: string;
  receiver: {
    id: string;
    metadataURI?: string;
  } & AccountMetadata;
};

export type BAppAccount = {
  bApps: number;
  delegators: number;
  id: Address;
  metadataURI: string;
  strategies: number;
  totalDelegators: number;
  totalDepositors: number;
  totalDelegatedValue: bigint;
  totalDelegatedFiat: string;
};

export type StrategyBApp = {
  assets: { token: Address; beta: string }[];
  bAppId: Address;
  metadataURI?: string;
  tokens: Address[];
};

export interface Strategy {
  id: string;
  name: string;
  ownerAddress: Address;
  bApps: number;
  depositedAssets: Address[];
  fee: string;
  metadataURI: string;
  ownerAddressMetadataURI: string;
  bAppsList?: (StrategyBApp & BAppsMetaData)[];
  totalDelegators?: number;
  totalDelegatedValue?: bigint;
  totalDelegatedFiat?: string;
  description?: string;
  depositsPerToken?: BAppAsset[];
  deposits?: [
    {
      id: Address;
      tokens: Address[];
      depositFiatAmount: string;
    },
  ];
  totalDepositedFiat?: string;
  totalDepositors: number;
  totalNonSlashableTokens?: string;
  totalNonSlashableFiat?: string;
}

export type StrategyMetadata = {
  name: string;
  description: string;
};

export interface StrategiesResponse {
  data: Strategy[];
  pagination: Pagination;
}

export interface StrategiesByOwnerResponse {
  totalDelegators: number;
  totalDelegatedValue: bigint;
  totalDelegatedFiat: string;
  totalDepositedFiat: string;
  totalAssetsFiat: string;
  strategies: Strategy[];
}

export type BAppsMetaData = {
  name: string;
  description: string;
  logo: string;
  website: string;
};

export type AccountMetadata = {
  name?: string;
  logo?: string;
};

export type DepositedToken = {
  token: Address;
  totalDepositsValue: bigint;
  totalDepositsFiat: string;
  depositedStrategies: number;
};

export type BApp = {
  id: Address;
  beta: string[];
  delegators: number;
  delegatedAccounts: number;
  strategies: number;
  metadataURI: string;
  ownerAddress: Address;
  supportedAssets: Address[];
  strategyOwners: Address[];
  totalDelegatedValue: bigint;
  totalDelegatedFiat: string;
  totalDepositedValue: bigint;
  totalDelegators: number;
  totalDepositors: number;
  totalNonSlashable: string;
  totalBAppAssetsFiat: string;
  totalDelegatedValueNonSlashable: string;
  depositsPerToken: DepositedToken[];
};

export type BAppDepositData = Pick<
  BApp,
  | "delegatedAccounts"
  | "depositsPerToken"
  | "totalDelegatedFiat"
  | "totalDelegatedValue"
>;

export const getNonSlashableAssets = (ownerAddress: string) =>
  api
    .get<NonSlashableAsset>(
      endpoint(
        "basedApp",
        `getNonSlashableAssets?ownerAddress=${ownerAddress}`,
      ),
    )
    .then((res) => res);

export const getMyAccount = (address: Address) =>
  api
    .get<{
      data: BAppAccount[];
      pagination: Pagination;
    }>(endpoint("basedApp", `getAccounts?id=${address}`))
    .then((res) => res);

export const getAccounts = ({
  searchInput,
  page = 1,
  perPage = 10,
}: {
  searchInput?: string;
  page?: number;
  perPage?: number;
}) =>
  api
    .get<{
      data: BAppAccount[];
      pagination: Pagination;
    }>(
      endpoint(
        "basedApp",
        `getAccounts${searchInput ? `?id=${searchInput}&perPage=${perPage}&page=${page}` : `?perPage=${perPage}&page=${page}`}`,
      ),
    )
    .then((res) => res);

export const getStrategies = (params: StrategiesSearchParams) => {
  return api.get<StrategiesResponse>(
    endpoint("basedApp/getStrategies", serializerStrategiesSearch(params)),
  );
};

export const getStrategiesByOwnerAddress = ({
  page = 1,
  perPage = 10,
  ownerAddress,
}: {
  id?: string | number;
  ownerAddress: Address;
  page: number;
  perPage: number;
}) =>
  api
    .get<StrategiesByOwnerResponse>(
      endpoint(
        "basedApp",
        `getStrategiesByOwner/${ownerAddress}?perPage=${perPage}&page=${page}`,
      ),
    )
    .then((res) => {
      return res;
    });

export const getStrategyById = (id: number | string) =>
  api.get<Strategy>(endpoint("basedApp", `getStrategyById`, id)).then((res) => {
    return res;
  });

export const getBApps = ({
  id,
  page = 1,
  perPage = 10,
}: {
  id?: string;
  page: number;
  perPage: number;
}) =>
  api.get<{
    data: BApp[];
    pagination: Pagination;
  }>(
    endpoint(
      "basedApp",
      `getBApps?${id ? `id=${id}&perPage=${perPage}&page=${page}` : `perPage=${perPage}&page=${page}`}`,
    ),
  );

export const getBAppByID = ({ id }: { id?: Address }) =>
  api
    .get<{
      data: BApp[];
      pagination: Pagination;
    }>(endpoint("basedApp", `getBApps?id=${id}`))
    .then((res) => {
      if (!res.data[0]) {
        throw new Error("BApp not found");
      }
      return res.data[0];
    });

export const getBAppDataByID = ({ id }: { id?: Address }) =>
  api
    .get<BAppDepositData>(endpoint("basedApp", `getBAppsById`, `${id}`))
    .then((res) => {
      return res;
    });

export const getBAppsByOwnerAddress = ({
  address,
  page = 1,
  perPage = 10,
}: {
  address: string;
  page: number;
  perPage: number;
}) =>
  api.get<{
    data: BApp[];
    pagination: Pagination;
  }>(
    endpoint(
      "basedApp",
      `getBApps?owner=${address}&perPage=${perPage}&page=${page}`,
    ),
  );

export const validateMetadata = <T>(url: string) =>
  api
    .get<T>(endpoint("basedApp", `validateMetadataUrl?url=${url}`))
    .then((res) => {
      return res;
    });

export const getMetadata = <T>(urls: { id: string; url: string }[]) =>
  api.post<T>(endpoint("basedApp", "fetchMetadataUrl"), urls);
export const getAccountsMetadata = getMetadata<
  {
    id: string;
    data: AccountMetadata;
  }[]
>;
export const getStrategiesMetadata = getMetadata<
  {
    id: string;
    data: StrategyMetadata;
  }[]
>;
export const getBAppsMetadata = getMetadata<
  {
    id: string;
    data: BAppsMetaData;
  }[]
>;
export type BAppAsset = {
  token: Address;
  totalObligatedBalance: string;
  totalDepositsValue?: bigint;
  totalObligatedPercentage?: string;
  totalDepositsFiat?: string;
  depositedStrategies?: number;
  totalFiat?: string;
  totalTokens?: bigint;
  obligations?: {
    bAppId: Address;
    percentage: string;
    percentageProposed: string;
    percentageProposedTimestamp: string;
  }[];
  obligationsCount: number;
};

export type BAppAssetResponse = Array<BAppAsset>;

interface GetBAppsAssetsParams {
  page?: number;
  perPage?: number;
}

export const getBAppsAssets = async ({
  page = 1,
  perPage = 10,
}: GetBAppsAssetsParams = {}) => {
  return api.get<BAppAssetResponse>(
    endpoint("basedApp", `getAssets?page=${page}&perPage=${perPage}`),
  );
};

export const getBAppsAssetByToken = async ({ token }: { token: Address }) => {
  return api.get<BAppAsset[]>(endpoint("basedApp", `getAssets?token=${token}`));
};

export type SlashableAsset = {
  token: Address;
  deposits: ({
    strategyId: string;
    depositAmount: string;
    fiatDepositAmount: string;
    metadataURI?: string;
  } & StrategyMetadata)[];
  totalDepositAmount: string;
  totalFiatDepositAmount: string;
};
export type GetSlashableAssetsResponse = {
  data: SlashableAsset[];
  pagination: Pagination;
};
export const getSlashableAssets = async (ownerAddress: string) => {
  return api.get<GetSlashableAssetsResponse>(
    endpoint(`basedApp/getSlashableAssets?ownerAddress=${ownerAddress}`),
  );
};

export type GetDelegatedAssetParams = {
  token: Address;
  contributor: Address;
  strategyId: number;
};
export const getDelegatedAsset = ({
  token: tokenAddress,
  contributor,
  strategyId,
}: GetDelegatedAssetParams) => {
  return api.get<{
    amount: string;
    contributor: string;
    token: string;
  }>(
    endpoint(
      `basedApp/getDepositTokensBy?token=${tokenAddress}&contributor=${contributor}&strategyId=${strategyId}`,
    ),
  );
};

type GetGlobalValidatorsBalanceParams = {
  account?: Address;
};

export type GetGlobalValidatorsBalanceResponse = {
  ssvBalance: string;
  delegatedAccounts: number;
  totalDelegatedValue: bigint;
  totalDelegatedFiat: string;
};

export const getGlobalNonSlashableAssets = async (
  params: GetGlobalValidatorsBalanceParams,
) => {
  return api.get<GetGlobalValidatorsBalanceResponse>(
    endpoint(
      "basedApp/getGlobalValidatorsBalance",
      `?${new URLSearchParams(params)}`,
    ),
  );
};
