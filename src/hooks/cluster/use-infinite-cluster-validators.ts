import { getPaginatedClusterValidators } from "@/api/cluster";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useRemovedOptimisticValidators } from "@/hooks/cluster/use-removed-optimistic-validators";
import { filterOutRemovedValidators } from "@/lib/utils/cluster";
import { getNextPageParam } from "@/lib/utils/infinite-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useChainId } from "wagmi";
import { useBulkActionContext } from "@/guard/bulk-action-guard.tsx";
import type { Validator } from "@/types/api.ts";

export const useInfiniteClusterValidators = (
  clusterHash?: string,
  perPage = 10,
  externalValidators?: string[],
) => {
  const params = useClusterPageParams();
  const hash = clusterHash || params.clusterHash;

  const removedOptimisticValidators = useRemovedOptimisticValidators();
  const chainId = useChainId();

  const infiniteQuery = useInfiniteQuery({
    initialPageParam: 1,
    getNextPageParam,
    queryKey: ["paginated-cluster-validators", hash, perPage, chainId],
    queryFn: ({ pageParam = 1 }) =>
      getPaginatedClusterValidators({
        hash: hash!,
        page: pageParam,
        perPage,
      }),

    enabled: Boolean(hash),
  });

  const fetchedValidators =
    infiniteQuery.data?.pages.flatMap((page) => page.validators) || [];

  const activeValidators = filterOutRemovedValidators(
    fetchedValidators,
    removedOptimisticValidators.data || [],
  );

  if (
    activeValidators.length &&
    externalValidators &&
    !useBulkActionContext.state._selectedPublicKeys.length
  ) {
    const validatorsToUse = activeValidators.filter((validator: Validator) =>
      externalValidators.some((truncatedPublicKey: string) =>
        validator.public_key.includes(truncatedPublicKey),
      ),
    );

    useBulkActionContext.state._selectedPublicKeys = validatorsToUse.map(
      ({ public_key }) => public_key,
    );
  }

  const total = Math.max(
    (infiniteQuery.data?.pages[0]?.pagination.total || 0) -
      (removedOptimisticValidators.data?.length || 0),
    0,
  );

  return {
    validators: activeValidators,
    infiniteQuery,
    total,
  };
};
