import type { UseQueryOptions } from "@/lib/react-query";
import { getDefaultChainedQueryOptions, enabled } from "@/lib/react-query";
import { ms } from "@/lib/utils/number";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Operator } from "@/types/api";
import { useChainId } from "wagmi";
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { getAccount } from "@wagmi/core";
import { config } from "@/wagmi/config";
import { useAccount } from "@/hooks/account/use-account";

export const getCreatedOptimisticOperatorsQueryOptions = (
  {
    chainId = getSSVNetworkDetails().networkId,
    account = getAccount(config),
    options,
  } = getDefaultChainedQueryOptions(),
) => {
  return queryOptions({
    staleTime: ms(1, "minutes"),
    gcTime: ms(1, "minutes"),
    queryKey: ["created-optimistic-operators", account, chainId],
    queryFn: async () => [] as Operator[],
    enabled: enabled(options?.enabled),
  });
};

export const useCreatedOptimisticOperators = (
  options: UseQueryOptions = {},
) => {
  const chainId = useChainId();
  const { address } = useAccount();

  return useQuery(
    getCreatedOptimisticOperatorsQueryOptions({
      chainId,
      options,
      account: address,
    }),
  );
};
