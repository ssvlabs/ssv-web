import { useState, useMemo } from "react";
import { getPaginatedClusterValidators } from "@/api/cluster";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useRemovedOptimisticValidators } from "@/hooks/cluster/use-removed-optimistic-validators";
import { filterOutRemovedValidators } from "@/lib/utils/cluster";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useChainId } from "wagmi";
import { useBulkActionContext } from "@/guard/bulk-action-guard.tsx";
import type {
  PaginatedSearchValidatorsResponse,
  Validator,
} from "@/types/api.ts";
import { add0x } from "@/lib/utils/strings";
import { useValidatorsSearchFilters } from "@/hooks/cluster/use-validators-search-filters";

export const useInfiniteClusterValidators = (
  clusterHash?: string,
  perPage = 50,
  externalValidators?: string[],
) => {
  const params = useClusterPageParams();
  const hash = clusterHash || params.clusterHash;
  const [selectedAll, setSelectedAll] = useState(false);
  const removedOptimisticValidators = useRemovedOptimisticValidators();
  const chainId = useChainId();

  const [filters, setFilters] = useValidatorsSearchFilters();
  const activeFiltersCount = useMemo(
    () =>
      Object.values(filters).filter(
        (value) => !!value && (Array.isArray(value) ? value.length > 0 : true),
      ).length,
    [filters],
  );

  const infiniteQuery = useInfiniteQuery<PaginatedSearchValidatorsResponse>({
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, pages, current_last } = lastPage.pagination;
      return page < pages ? { lastId: current_last, page: page + 1 } : null;
    },
    queryKey: ["paginated-cluster-validators", hash, perPage, chainId, filters],
    queryFn: ({ pageParam }) => {
      const pageParams = pageParam as { lastId: string; page: number } | null;
      return getPaginatedClusterValidators({
        page: pageParams?.page,
        pageDirection: "next",
        perPage,
        ...filters,
        cluster: [add0x(hash!)],
      });
    },
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
    !selectedAll &&
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
    setSelectedAll(true);
  }

  const total = Math.max(
    (infiniteQuery.data?.pages[0]?.pagination.total || 0) -
      (removedOptimisticValidators.data?.length || 0),
    0,
  );

  return {
    filters,
    setFilters,
    activeFiltersCount,
    validators: activeValidators,
    infiniteQuery,
    total,
  };
};
