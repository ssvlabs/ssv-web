import { queryOptions, useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@/lib/react-query";
import { getDefaultChainedQueryOptions, enabled } from "@/lib/react-query";
import { getOperatorByPublicKey } from "@/api/operator";
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { useChainId } from "wagmi";
import { boolify } from "@/lib/utils/boolean";

export const getOperatorByPublicKeyQueryOptions = (
  publicKey?: string,
  {
    chainId = getSSVNetworkDetails().networkId,
    options,
  } = getDefaultChainedQueryOptions(),
) => {
  return queryOptions({
    queryKey: ["get-operator-by-public-key", publicKey?.toLowerCase(), chainId],
    queryFn: () => getOperatorByPublicKey(publicKey!),
    enabled: boolify(publicKey) && enabled(options?.enabled),
  });
};

export const useGetOperatorByPublicKey = (
  publicKey: string,
  options: UseQueryOptions = {},
) => {
  const chainId = useChainId();
  return useQuery(
    getOperatorByPublicKeyQueryOptions(publicKey, {
      chainId,
      options,
    }),
  );
};
