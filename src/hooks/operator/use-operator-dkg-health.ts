import { checkOperatorDKGHealth } from "@/api/operator";
import type { Operator } from "@/types/api";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { ms } from "@/lib/utils/number";
import type { UseQueryOptions } from "@/lib/react-query";
import { getDefaultChainedQueryOptions, enabled } from "@/lib/react-query";
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { useChainId } from "wagmi";
import { useMemo } from "react";
import { DKG_VERSIONS } from "@/lib/utils/keyshares";
import { isVersionLT } from "@/lib/utils/version";

export type OperatorDKGHealthResponse = {
  id: string;
  isHealthy: boolean;
  isMultiSig: boolean;
  isOutdated: boolean;
  isEthClientConnected: boolean;
  isMismatchId: boolean;
  /** Version reported by the DKG node; absent when the node did not answer. */
  version?: string | null;
};

export type EnrichedOperatorDKGHealthResponse = OperatorDKGHealthResponse & {
  /**
   * TEMPORARY: the node answered, but with a version older than
   * `DKG_VERSIONS.MIN_VERSION_FOR_ADDRESS`. Its `dkg_address` must be treated
   * as unusable so it never reaches the user or a ceremony command.
   */
  isBelowMinVersionForAddress?: boolean;
};

export const getOperatorsDKGHealthQueryOptions = (
  operators: Operator[],
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
  operators: Operator[],
  options: UseQueryOptions = {},
) => {
  const chainId = useChainId();
  const query = useQuery(
    getOperatorsDKGHealthQueryOptions(operators, {
      chainId,
      options,
    }),
  );

  const data = useMemo<EnrichedOperatorDKGHealthResponse[] | undefined>(() => {
    if (!query.data) return undefined;
    return query.data.map((item) => ({
      ...item,
      // A node that never answered has no version and is already covered by
      // `isOutdated`; only a reported-but-too-old version lands here.
      isBelowMinVersionForAddress: isVersionLT(
        item.version,
        DKG_VERSIONS.MIN_VERSION_FOR_ADDRESS,
      ),
    })) satisfies EnrichedOperatorDKGHealthResponse[];
  }, [query.data]);

  // TEMPORARY: any operator below the minimum version blocks the DKG flows, so
  // its real endpoint is never handed out. Remove alongside the constant.
  const hasOperatorsBelowMinVersionForAddress = useMemo(
    () =>
      (data ?? []).some(
        ({ isBelowMinVersionForAddress }) => isBelowMinVersionForAddress,
      ),
    [data],
  );

  return { ...query, data, hasOperatorsBelowMinVersionForAddress };
};
