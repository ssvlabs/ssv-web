import { api } from "@/lib/api-client.ts";
import { endpoint } from "@/api/index.ts";
import type { Pagination } from "@/types/api.ts";
import type { Address } from "abitype";

export type MyBAppAccount = {
  effectiveBalance: bigint;
  delegations: Delegation[];
};

export type Delegation = {
  receiver: {
    id: string;
  };
  percentage: string;
};

export type BAppAccount = {
  bApps: number;
  delegators: number;
  icon: string;
  id: string;
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
  ownerAddress: string;
  bApps: number;
  delegatedAssets: `0x${string}`[];
  fee: string;
  bAppsList?: StrategyBApp[];
  totalDelegators?: number;
  totalDelegatedFiat?: string;
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
  totalDelegatedValue: string;
  bAppsMetaData: BAppsMetaData;
};

export const getMyAccount = (ownerAddress: string) =>
  api
    .get<MyBAppAccount>(
      endpoint(
        "basedApp",
        `getNonSlashableAssets?ownerAddress=${ownerAddress}`,
      ),
    )
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

export const getStrategies = ({
  id,
  page = 1,
  perPage = 10,
  ordering,
}: {
  id?: string | number;
  ordering?: string | number;
  page: number;
  perPage: number;
}) =>
  api
    .get<StrategiesResponse>(
      endpoint(
        "basedApp",
        `getStrategies?ordering=${ordering}&${id ? `id=${id}&perPage=${perPage}&page=${page}` : `perPage=${perPage}&page=${page}`}`,
      ),
    )
    .then((res) => {
      return res;
    });

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
  api
    .get<{
      data: BApp[];
      pagination: Pagination;
    }>(
      endpoint(
        "basedApp",
        `getBApps?${id ? `id=${id}&perPage=${perPage}&page=${page}` : `perPage=${perPage}&page=${page}`}`,
      ),
    )
    .then((res) => {
      return res;
    });

export const getBAppMetadata = (url: string) =>
  api.get(url).then((res) => {
    console.log(url);
    console.log(res);
    return res;
  });

export interface BAppAsset {
  token: Address;
  totalObligatedBalance: string;
  obligationsCount: number;
}
export const getBAppsAssets = () =>
  api.get<BAppAsset[]>(endpoint("basedApp/getASsets"));
