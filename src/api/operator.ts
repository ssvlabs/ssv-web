import { endpoint } from "@/api";
import { api } from "@/lib/api-client";
import { Operator, OperatorsSearchResponse } from "@/types/api";
import { isUndefined, omitBy } from "lodash-es";

export const getOperator = (id: number | string) => {
  return api.get<Operator>(endpoint("operators", id));
};

type OrderBy = "id" | "validators_count" | "performance.30d" | "fee" | "mev";
type Sort = "asc" | "desc";
export type SearchOperatorsParams = {
  search?: string;
  ordering?: `${OrderBy}:${Sort}`;
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
