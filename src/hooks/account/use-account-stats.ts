import { getAccountStats } from "@/api/account";
import { useAccount } from "@/hooks/account/use-account";
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import type { UseQueryOptions } from "@/lib/react-query";
import { enabled, getDefaultChainedQueryOptions } from "@/lib/react-query";
import { boolify } from "@/lib/utils/boolean";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Address } from "abitype";
import { useChainId } from "wagmi";

export const getAccountStatsQueryOptions = (
  address?: Address,
  {
    chainId = getSSVNetworkDetails().networkId,
    options,
  } = getDefaultChainedQueryOptions(),
) =>
  queryOptions({
    queryKey: ["account-stats", address?.toLowerCase(), chainId],
    queryFn: () => getAccountStats(address!),
    enabled: boolify(address) && enabled(options?.enabled),
  });

export const useAccountStats = (options: UseQueryOptions = {}) => {
  const { address } = useAccount();
  const chainId = useChainId();

  return useQuery(
    getAccountStatsQueryOptions(address, {
      chainId,
      options,
    }),
  );
};
