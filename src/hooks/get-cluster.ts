import { queryOptions, useQuery } from "@tanstack/react-query";

import { QueryConfig } from "@/lib/react-query";
import { api } from "@/lib/api-client";
import { endpoint } from "@/api";

export type Cluster = {
  // TODO: Add type or remove this type
};

export const getCluster = (): Promise<Cluster[]> => {
  return api.get(endpoint());
};

export const getClusterQueryOptions = () => {
  return queryOptions({
    queryKey: ["cluster"],
    queryFn: () => getCluster(),
  });
};

type UseClusterOptions = {
  options?: QueryConfig<typeof getClusterQueryOptions>;
};

export const useCluster = ({ options }: UseClusterOptions = {}) => {
  return useQuery({
    ...getClusterQueryOptions(),
    ...options,
  });
};
