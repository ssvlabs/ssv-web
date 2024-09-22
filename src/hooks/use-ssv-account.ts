import { queryOptions, useQuery } from "@tanstack/react-query";
import { getAccount } from "@/api/account";
import type { Address } from "abitype";
import { ms } from "@/lib/utils/number";
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import type { UseQueryOptions } from "@/lib/react-query";
import { getDefaultChainedQueryOptions, enabled } from "@/lib/react-query";
import { boolify } from "@/lib/utils/boolean";
import { useChainId } from "wagmi";
import { useAccount } from "@/hooks/account/use-account";

export const getSSVAccountQueryOptions = (
  account?: Address,
  {
    chainId = getSSVNetworkDetails().networkId,
    options,
  } = getDefaultChainedQueryOptions(),
) => {
  return queryOptions({
    staleTime: ms(1, "minutes"),
    queryKey: [
      "ssv-account",
      account?.toLowerCase(),
      getSSVNetworkDetails().networkId,
      chainId,
    ],
    queryFn: () => getAccount(account!),
    enabled: boolify(account) && enabled(options?.enabled),
  });
};

export const useSSVAccount = (options: UseQueryOptions = {}) => {
  const chainId = useChainId();
  const { address } = useAccount();
  return useQuery(
    getSSVAccountQueryOptions(address, {
      chainId,
      options,
    }),
  );
};
