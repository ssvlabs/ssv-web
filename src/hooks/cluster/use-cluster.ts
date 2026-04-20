import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

import type { UseQueryOptions } from "@/lib/react-query";
import {
  enabled,
  getDefaultChainedQueryOptions,
  queryClient,
} from "@/lib/react-query";
import { getCluster } from "@/api/cluster";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useBlockNumber, useChainId } from "wagmi";
import { boolify } from "@/lib/utils/boolean";
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { useRef } from "react";

export const getClusterQueryOptions = (
  hash?: string,
  {
    chainId = getSSVNetworkDetails().networkId,
    options,
  } = getDefaultChainedQueryOptions(),
) => {
  return queryOptions({
    queryKey: ["cluster", hash?.toLowerCase(), chainId],
    queryFn: () => getCluster(hash!),
    enabled: boolify(hash) && enabled(options?.enabled),
  });
};

export const useCluster = (
  hash?: string,
  options?: UseQueryOptions & { watch?: boolean },
) => {
  const { clusterHash } = useClusterPageParams();
  const chainId = useChainId();

  const { data: blockNumber = 0n } = useBlockNumber({ watch: options?.watch });
  const prevBlockNumber = useRef(blockNumber);

  const queryOptions = getClusterQueryOptions(hash ?? clusterHash, {
    chainId,
    options,
  });

  if (options?.watch && blockNumber !== prevBlockNumber.current) {
    prevBlockNumber.current = blockNumber;
    queryClient.refetchQueries({ queryKey: queryOptions.queryKey });
  }

  return useQuery({
    ...queryOptions,
    placeholderData: keepPreviousData,
  });
};
