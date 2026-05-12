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
import { isVersionEqual, isVersionGTE, maxVersion } from "@/lib/utils/version";

export type OperatorDKGHealthResponse = {
  id: string;
  isHealthy: boolean;
  isMultiSig: boolean;
  isOutdated: boolean;
  isEthClientConnected: boolean;
  isMismatchId: boolean;
  version?: string;
};

export type EnrichedOperatorDKGHealthResponse = OperatorDKGHealthResponse & {
  isMismatchVersion?: boolean;
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

  const enrichedData = useMemo<
    EnrichedOperatorDKGHealthResponse[] | undefined
  >(() => {
    if (!query.data) return undefined;
    const definedVersions = query.data
      .map(({ version }) => version)
      .filter(Boolean);

    const highestVersion = maxVersion(
      definedVersions.filter(Boolean) as string[],
    );

    return query.data.map((item) => ({
      ...item,
      isMismatchVersion:
        item.version && highestVersion
          ? !isVersionEqual(item.version, highestVersion)
          : false,
    })) satisfies EnrichedOperatorDKGHealthResponse[];
  }, [query.data]);

  const data = enrichedData;

  const hasVersionMismatch = useMemo(
    () => (data ?? []).some(({ isMismatchVersion }) => isMismatchVersion),
    [data],
  );

  const supportsCompounding = useMemo(
    () =>
      (data?.length ?? 0) > 0 &&
      (data ?? []).every((h) =>
        isVersionGTE(h.version, DKG_VERSIONS.COMPOUNDING_MIN),
      ),
    [data],
  );

  const hasOutdatedOperators = useMemo(
    () => (data ?? []).some(({ isOutdated }) => isOutdated),
    [data],
  );

  const areAllOperatorsOutdated = useMemo(
    () =>
      (data?.length ?? 0) > 0 &&
      (data ?? []).every(({ isOutdated }) => isOutdated),
    [data],
  );

  const hasUnhealthyOperators = useMemo(
    () =>
      (data ?? []).some(
        ({ isHealthy, isMismatchId }) => !isHealthy || isMismatchId,
      ),
    [data],
  );

  const cliVersion = useMemo(() => {
    if (!data || !data.length) return undefined;
    const version = data[0].version;
    return data.every((h) => h.version === version) ? version : undefined;
  }, [data]);

  return {
    ...query,
    data,
    supportsCompounding,
    hasOutdatedOperators,
    areAllOperatorsOutdated,
    hasUnhealthyOperators,
    hasVersionMismatch,
    cliVersion,
  };
};
