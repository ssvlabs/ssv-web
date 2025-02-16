import { api } from "@/lib/api-client.ts";
import { endpoint } from "@/api/index.ts";
import type { Pagination } from "@/types/api.ts";

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

export type Strategy = {
  id: string;
  name: string;
  bApps: number;
  delegators: number;
  assets: `0x${string}`[];
  fee: string;
  ownerAddress: string;
  totalDelegatedValue: number | bigint;
};

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
    .get<{
      data: Strategy[];
      pagination: Pagination;
    }>(
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
    .get<{
      data: Strategy[];
      pagination: Pagination;
    }>(
      endpoint(
        "basedApp",
        `getStrategiesByOwner/${ownerAddress}?perPage=${perPage}&page=${page}`,
      ),
    )
    .then((res) => {
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
