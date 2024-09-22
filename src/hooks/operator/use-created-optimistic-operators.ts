import { type QueryConfig } from "@/lib/react-query";
import { ms } from "@/lib/utils/number";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Operator } from "@/types/api";
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";

export const getCreatedOptimisticOperatorsQueryOptions = () => {
  return queryOptions({
    staleTime: ms(1, "minutes"),
    gcTime: ms(1, "minutes"),

    queryKey: [
      "created-optimistic-operators",
      getSSVNetworkDetails().networkId,
    ],
    queryFn: async () => [] as Operator[],
  });
};

type Options = {
  options?: QueryConfig<typeof getCreatedOptimisticOperatorsQueryOptions>;
};

export const useCreatedOptimisticOperators = ({ options }: Options = {}) => {
  return useQuery({
    ...getCreatedOptimisticOperatorsQueryOptions(),
    ...options,
  });
};
