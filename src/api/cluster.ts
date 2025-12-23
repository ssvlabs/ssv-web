import { endpoint } from "@/api";
import { api } from "@/lib/api-client";
import {
  validatorsSearchParamsSerializer,
  type ValidatorsSearchSchema,
} from "@/lib/search-parsers/validators-search-parsers";
import { formatClusterData, getDefaultClusterData } from "@/lib/utils/cluster";
import { mapBeaconChainStatus } from "@/lib/utils/validator-status-mapping";
import type {
  GetClusterResponse,
  GetPaginatedClustersResponse,
  PaginatedSearchValidatorsResponse,
} from "@/types/api";
import type { Address } from "abitype";
import { merge } from "lodash-es";

export const getCluster = (hash: string) => {
  return api.get<GetClusterResponse>(endpoint("clusters", hash)).then((res) => {
    return res.cluster
      ? merge(res.cluster, {
          // TODO(Chris): refine this logic
          isSSVCluster: ![undefined, null, "0", 0].includes(
            res.cluster?.balance,
          ),
        })
      : res.cluster;
  });
};

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
          operatorDetails: "true",
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
