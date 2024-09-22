import type { UseQueryOptions } from "@/lib/react-query";
import { getDefaultChainedQueryOptions, enabled } from "@/lib/react-query";
import { ms } from "@/lib/utils/number";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Operator } from "@/types/api";
import { useChainId } from "wagmi";
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";

export const getCreatedOptimisticOperatorsQueryOptions = (
  {
    chainId = getSSVNetworkDetails().networkId,
    options,
  } = getDefaultChainedQueryOptions(),
) => {
  return queryOptions({
    staleTime: ms(1, "minutes"),
    gcTime: ms(1, "minutes"),
    queryKey: ["created-optimistic-operators", chainId],
    queryFn: async () => [] as Operator[],
    enabled: enabled(options?.enabled),
  });
};

export const useCreatedOptimisticOperators = (
  options: UseQueryOptions = {},
) => {
  const chainId = useChainId();
  return useQuery(
    getCreatedOptimisticOperatorsQueryOptions({
      chainId,
      options,
    }),
  );
};
