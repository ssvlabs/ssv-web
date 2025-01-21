import { checkOperatorDKGHealth } from "@/api/operator";
import type { Operator } from "@/types/api";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { ms } from "@/lib/utils/number";
import type { UseQueryOptions } from "@/lib/react-query";
import { getDefaultChainedQueryOptions, enabled } from "@/lib/react-query";
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { useChainId } from "wagmi";

export type OperatorDKGHealthResponse = {
  id: string;
  isHealthy: boolean;
  isMultiSig: boolean;
  isOutdated: boolean;
  isEthClientConnected: boolean;
  isMismatchId: boolean;
};

export const getOperatorsDKGHealthQueryOptions = (
  operators: Pick<Operator, "id" | "dkg_address">[],
  {
    chainId = getSSVNetworkDetails().networkId,
    options,
  } = getDefaultChainedQueryOptions(),
) => {
  return queryOptions({
    gcTime: 0,
    staleTime: ms(10, "seconds"),
    queryKey: ["operators-dkg-health", operators.map(({ id }) => id), chainId],
    queryFn: async (): Promise<OperatorDKGHealthResponse[]> => {
      const payload = operators.map(({ id, dkg_address }) => {
        return {
          id: id.toString(),
          address: dkg_address,
        };
      });
      return checkOperatorDKGHealth(payload);
    },
    enabled: operators.length > 0 && enabled(options?.enabled),
  });
};

export const useOperatorsDKGHealth = (
  operators: Pick<Operator, "id" | "dkg_address">[],
  options: UseQueryOptions = {},
) => {
  const chainId = useChainId();
  return useQuery(
    getOperatorsDKGHealthQueryOptions(operators, {
      chainId,
      options,
    }),
  );
};
