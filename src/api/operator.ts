import { endpoint } from "@/api";
import { api } from "@/lib/api-client";
import type {
  Country,
  GetOperatorByPublicKeyResponse,
  PaginatedValidatorsResponse,
  Operator,
  OperatorsSearchResponse,
} from "@/types/api";
import { isUndefined, omitBy } from "lodash-es";

export const getOperator = (id: number | string | bigint) => {
  return api.get<Operator>(endpoint("operators", id.toString()));
};

type OrderBy = "id" | "validators_count" | "performance.30d" | "fee" | "mev";
type Sort = "asc" | "desc";

export type SearchOperatorsParams = {
  search?: string;
  ordering?: `${OrderBy}:${Sort}`;
  type?: "verified_operator";
  has_dkg_address?: boolean;
  page?: number;
  perPage?: number;
};

export const searchOperators = (params: SearchOperatorsParams) => {
  const filtered = omitBy(params, isUndefined);
  const searchParams = new URLSearchParams(filtered as Record<string, string>);
  return api.get<OperatorsSearchResponse>(
    endpoint("operators", `?${searchParams}`),
  );
};

type GetAccountOperatorsParams = {
  address: string;
  page?: number;
  perPage?: number;
};

export const getPaginatedAccountOperators = ({
  address,
  page = 1,
  perPage = 10,
}: GetAccountOperatorsParams) => {
  return api
    .get<OperatorsSearchResponse>(
      endpoint(
        "operators/owned_by",
        address,
        `?${new URLSearchParams({
          page: page.toString(),
          perPage: perPage.toString(),
          withFee: "true",
          ordering: "id:asc",
        })}`,
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

type GetOperatorValidators = {
  operatorId: string;
  page?: number;
  perPage?: number;
};

export const getPaginatedOperatorValidators = ({
  operatorId,
  page = 1,
  perPage = 10,
}: GetOperatorValidators) => {
  return api
    .get<PaginatedValidatorsResponse>(
      endpoint(
        "validators/in_operator",
        operatorId,
        `?${new URLSearchParams({
          page: page.toString(),
          perPage: perPage.toString(),
        })}`,
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

export const getOperatorLocations = () => {
  return api.get<Country[]>(endpoint("operators/locations"));
};

export const getOperatorNodes = (layer: number) => {
  return api.get<string[]>(endpoint("operators/nodes", layer));
};

export const checkOperatorDKGHealth = (dkgAddress: string) => {
  return api.post<boolean>(endpoint("operators/dkg_health_check"), {
    dkgAddress,
  });
};

export interface OperatorMetadata {
  operatorName: string;
  description: string;
  location: string;
  setupProvider: string;
  eth1NodeClient: string;
  eth2NodeClient: string;
  mevRelays: string;
  websiteUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  dkgAddress: string;
  logo: string;
  signature: string;
}

export const setOperatorMetadata = (
  operatorId: string,
  metadata: OperatorMetadata,
) => {
  return api.put(endpoint("operators", operatorId, "metadata"), metadata);
};

export const getOperatorByPublicKey = (publicKey: string) => {
  return api.get<GetOperatorByPublicKeyResponse>(
    endpoint("operators/public_key", publicKey),
  );
};
