import { endpoint } from "@/api";
import { api } from "@/lib/api-client";
import { formatClusterData, getDefaultClusterData } from "@/lib/utils/cluster";
import type {
  GetClusterResponse,
  GetPaginatedClustersResponse,
  PaginatedValidatorsResponse,
} from "@/types/api";
import type { Address } from "abitype";

export const getCluster = (hash: string) =>
  api
    .get<GetClusterResponse>(endpoint("clusters", hash))
    .then((res) => res.cluster);

export const getClusterData = (hash: string) =>
  getCluster(hash)
    .then((cluster) =>
      cluster ? formatClusterData(cluster) : getDefaultClusterData(),
    )
    .catch(() => getDefaultClusterData());

export type GetPaginatedAccountClusters = {
  account: string | Address;
  page?: number;
  perPage?: number;
};

export const getPaginatedAccountClusters = ({
  account,
  page = 1,
  perPage = 10,
}: GetPaginatedAccountClusters) => {
  return api
    .get<GetPaginatedClustersResponse>(
      endpoint(
        "clusters/owner",
        account,
        `?${new URLSearchParams({
          page: page.toString(),
          perPage: perPage.toString(),
          withFee: "true",
          ordering: "id:asc",
          operatorDetails: "operatorDetails",
        }).toString()}`,
      ),
    )
    .then((response) => ({
      ...response,
      pagination: {
        ...response.pagination,
        page: response.pagination.page || 1,
        pages: response.pagination.pages || 1,
      },
    }));
};

export type GetPaginatedClusterValidators = {
  hash: string;
  page?: number;
  perPage?: number;
};

export const getPaginatedClusterValidators = ({
  hash,
  page = 1,
  perPage = 10,
}: GetPaginatedClusterValidators) => {
  return api
    .get<PaginatedValidatorsResponse>(
      endpoint(
        "clusters/hash",
        hash,
        `?${new URLSearchParams({
          page: page.toString(),
          perPage: perPage.toString(),
        }).toString()}`,
      ),
    )
    .then((response) => ({
      ...response,
      pagination: {
        ...response.pagination,
        page: response.pagination.page || 1,
        pages: response.pagination.pages || 1,
      },
    }));
};
