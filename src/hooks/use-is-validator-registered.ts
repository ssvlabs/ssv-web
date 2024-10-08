import { queryOptions, useQuery } from "@tanstack/react-query";
import { getIsRegisteredValidator } from "@/api/validators";
import type { UseQueryOptions } from "@/lib/react-query";
import { enabled, getDefaultChainedQueryOptions } from "@/lib/react-query";
import { boolify } from "@/lib/utils/boolean";
import { useChainId } from "wagmi";
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";

export const isValidatorRegisteredQueryOptions = (
  publicKey?: string,
  {
    chainId = getSSVNetworkDetails().networkId,
    options,
  } = getDefaultChainedQueryOptions(),
) => {
  return queryOptions({
    queryKey: ["is-validator-registered", publicKey?.toLowerCase(), chainId],
    queryFn: () => getIsRegisteredValidator(publicKey!),
    enabled: boolify(publicKey) && enabled(options?.enabled),
    retry: false,
  });
};

export const useIsValidatorRegistered = (
  publicKey: string,
  options: UseQueryOptions = {},
) => {
  const chainId = useChainId();
  return useQuery(
    isValidatorRegisteredQueryOptions(publicKey, {
      chainId,
      options,
    }),
  );
};
