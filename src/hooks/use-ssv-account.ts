import { queryOptions, useQuery } from "@tanstack/react-query";

import type { QueryConfig } from "@/lib/react-query";
import { getAccount } from "@/api/account";
import type { Address } from "abitype";
import { useAccount } from "@/hooks/account/use-account";
import { ms } from "@/lib/utils/number";
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";

export const getSSVAccountQueryOptions = (account?: Address) => {
  return queryOptions({
    staleTime: ms(1, "minutes"),
    queryKey: ["ssv-account", account, getSSVNetworkDetails().networkId],
    queryFn: () => getAccount(account!),
    enabled: !!account,
  });
};

type UseSsvAccountOptions = QueryConfig<typeof getSSVAccountQueryOptions>;

export const useSSVAccount = (options: UseSsvAccountOptions = {}) => {
  const { address } = useAccount();
  const queryOptions = getSSVAccountQueryOptions(address);

  return useQuery({
    ...queryOptions,
    ...options,
    enabled: queryOptions.enabled && options?.enabled,
  });
};
