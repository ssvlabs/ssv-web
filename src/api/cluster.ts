import { endpoint } from "@/api";
import { api } from "@/lib/api-client";
import {
  validatorsSearchParamsSerializer,
  type ValidatorsSearchSchema,
} from "@/lib/search-parsers/validators-search-parsers";
import { getDefaultClusterData, toSolidityCluster } from "@/lib/utils/cluster";
import { add0x } from "@/lib/utils/strings";
import { mapBeaconChainStatus } from "@/lib/utils/validator-status-mapping";
import type {
  GetClusterResponse,
  GetPaginatedClustersResponse,
  PaginatedSearchValidatorsResponse,
} from "@/types/api";
import type { Address } from "abitype";
import { formatGwei, type Hex } from "viem";

export const getCluster = (hash: string) => {
  return api
    .get<GetClusterResponse>(endpoint("clusters", hash))
    .then((res) => res.cluster);
};

export const getClusterData = (hash: string) =>
  getCluster(hash)
    .then((cluster) =>
      cluster ? toSolidityCluster(cluster) : getDefaultClusterData(),
    )
    .catch(() => getDefaultClusterData());

export type OrderBy = "id" | "validatorCount" | "effectiveBalance";
export type Sort = "asc" | "desc";

export type GetPaginatedAccountClusters = {
  account: string | Address;
  page?: number;
  perPage?: number;
  ordering?: `${OrderBy}:${Sort}`;
};

export const getPaginatedAccountClusters = ({
  account,
  page = 1,
  perPage = 10,
  ordering = "id:asc",
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
          ordering,
          operatorDetails: "true",
        }).toString()}`,
      ),
    )
    .then((response) => ({
      ...response,
      clusters: response.clusters,
      pagination: {
        ...response.pagination,
        page: response.pagination.page || 1,
        pages: response.pagination.pages || 1,
      },
    }));
};

export type GetPaginatedClusterValidators = Partial<ValidatorsSearchSchema>;

export const getPaginatedClusterValidators = (
  params: GetPaginatedClusterValidators,
) => {
  const searchParams = validatorsSearchParamsSerializer(params);

  return api
    .get<PaginatedSearchValidatorsResponse>(
      endpoint("validators", `?${searchParams}`),
    )
    .then((response) => ({
      ...response,
      validators: response.validators.map((validator) => ({
        ...validator,
        displayedStatus: mapBeaconChainStatus({
          beaconStatus: validator.validator_info.status,
          validatorStatus: validator.status,
          isValid: validator.is_valid,
        }),
      })),
      pagination: response.pagination,
    }));
};

export const getClusterTotalEffectiveBalance = (clusterHash: string) => {
  return api
    .get<{
      clusterId: Hex;
      effectiveBalance: string;
    }>(endpoint(`clusters/${add0x(clusterHash)}/totalEffectiveBalance`))
    .then((response) => Number(formatGwei(BigInt(response.effectiveBalance))));
};
