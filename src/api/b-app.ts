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
  delegations: Delegation[];
};

export type Delegation = {
  percentage: string;
  receiver: {
    id: string;
  };
};

export type BAppAccount = {
  bApps: number;
  delegators: number;
  id: `0x${string}`;
  logo: string;
  name: string;
  strategies: number;
  totalDelegated: string;
  totalDelegatedValue: string;
};

export type StrategyBApp = {
  assets: { token: `0x${string}`; beta: string }[];
  bAppId: `0x${string}`;
  bAppsMetadata: BAppsMetaData;
  tokens: `0x${string}`[];
};

export interface Strategy {
  id: string;
  name: string;
  ownerAddress: `0x${string}`;
  bApps: number;
  delegatedAssets: `0x${string}`[];
  fee: string;
  bAppsList?: StrategyBApp[];
  totalDelegators?: number;
  totalDelegatedFiat?: string;
  description?: string;
  delegationsPerToken?: {
    token: `0x${string}`;
    totalDelegation: string;
    totalTokens: bigint;
    totalFiat: string;

    delegations: { bAppId: `0x${string}`; percentage: string }[];
  }[];
  delegators?: [
    {
      id: string;
      token: string[];
      depositFiatAmount: string;
    },
  ];
  totalNonSlashableTokens?: string;
  totalNonSlashableFiat?: string;
}

export interface StrategiesResponse {
  data: Strategy[];
  pagination: Pagination;
}

export interface StrategiesByOwnerResponse {
  totalDelegators: number;
  totalNonSlashableTokens: string;
  totalNonSlashableFiat: string;
  totalSlashableFiat: string;
  ownerName: string;
  ownerIcon: string;
  strategies: Strategy[];
}

type BAppsMetaData = {
  name: string;
  description: string;
  logo: string;
  website: string;
};

export type BApp = {
  id: `0x${string}`;
  beta: string[];
  delegators: number;
  strategies: number;
  metadataURI: string;
  ownerAddress: `0x${string}`;
  supportedAssets: `0x${string}`[];
  strategyOwners: `0x${string}`[];
  totalDelegatedValue: string;
  bAppsMetaData: BAppsMetaData;
};

export const getNonSlashableAssets = (ownerAddress: string) =>
  api
    .get<NonSlashableAsset>(
      endpoint(
        "basedApp",
        `getNonSlashableAssets?ownerAddress=${ownerAddress}`,
      ),
    )
    .then((res) => res);

export const getMyAccount = (address: `0x${string}`) =>
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
  ownerAddress: `0x${string}`;
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

export type BAppAsset = {
  token: Address;
  totalObligatedBalance: string;
  obligationsCount: number;
};

export interface BAppAssetResponse {
  data: Array<BAppAsset>;
  pagination: {
    page: number;
    perPage: number;
    total: number;
    pages: number;
  };
}

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

export type SlashableAsset = {
  token: Address;
  deposits: {
    strategyId: string;
    depositAmount: string;
    fiatDepositAmount: string;
  }[];
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
  token: `0x${string}`;
  contributor: `0x${string}`;
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
