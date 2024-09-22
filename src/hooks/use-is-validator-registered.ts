import { queryOptions, useQuery } from "@tanstack/react-query";

import { getIsRegisteredValidator } from "@/api/validators";
import type { QueryConfig } from "@/lib/react-query";
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";

export const isValidatorRegisteredQueryOptions = (publicKey: string) => {
  return queryOptions({
    queryKey: [
      "is-validator-registered",
      publicKey,
      getSSVNetworkDetails().networkId,
    ],
    queryFn: () => getIsRegisteredValidator(publicKey),
    enabled: Boolean(publicKey),
    retry: false,
  });
};

export const useIsValidatorRegistered = (
  publicKey: string,
  options: QueryConfig<typeof isValidatorRegisteredQueryOptions> = {},
) => {
  return useQuery({
    ...isValidatorRegisteredQueryOptions(publicKey),
    ...options,
  });
};
