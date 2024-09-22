import { queryOptions, useQuery } from "@tanstack/react-query";

import type { QueryConfig } from "@/lib/react-query";
import { getOperatorByPublicKey } from "@/api/operator";
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";

export const getOperatorByPublicKeyQueryOptions = (publicKey: string) => {
  return queryOptions({
    queryKey: [
      "get-operator-by-public-key",
      publicKey,
      getSSVNetworkDetails().networkId,
    ],
    queryFn: () => getOperatorByPublicKey(publicKey),
  });
};

type UseGetOperatorByPublicKeyOptions = {
  options?: QueryConfig<typeof getOperatorByPublicKeyQueryOptions>;
};

export const useGetOperatorByPublicKey = (
  publicKey: string,
  { options }: UseGetOperatorByPublicKeyOptions = {},
) => {
  return useQuery({
    ...getOperatorByPublicKeyQueryOptions(publicKey),
    ...options,
  });
};
