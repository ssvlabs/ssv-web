import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import type { UseQueryOptions } from "@/lib/react-query";
import { getDefaultChainedQueryOptions, enabled } from "@/lib/react-query";
import { ms } from "@/lib/utils/number";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useChainId } from "wagmi";

export const getRemovedOptimisticValidatorsQueryOptions = (
  {
    chainId = getSSVNetworkDetails().networkId,
    options,
  } = getDefaultChainedQueryOptions(),
) => {
  return queryOptions({
    staleTime: ms(1, "minutes"),
    gcTime: ms(1, "minutes"),
    queryKey: ["removed-optimistic-validators", chainId],
    placeholderData: () => [],
    queryFn: async () => [] as string[],
    enabled: enabled(options?.enabled),
  });
};

export const useRemovedOptimisticValidators = (
  options: UseQueryOptions = {},
) => {
  const chainId = useChainId();
  return useQuery(
    getRemovedOptimisticValidatorsQueryOptions({
      chainId,
      options,
    }),
  );
};
