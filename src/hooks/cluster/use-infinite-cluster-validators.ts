import { useState } from "react";
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
import { useQueryState } from "nuqs";
import { validatorsSearchFilters } from "@/lib/search-parsers/validators-search-parsers";

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

  const [publicKey] = useQueryState(
    "publicKey",
    validatorsSearchFilters.publicKey,
  );

  const infiniteQuery = useInfiniteQuery<PaginatedSearchValidatorsResponse>({
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      console.log("lastPage:", lastPage);
      const { page, pages, current_last } = lastPage.pagination;
      return page < pages ? { lastId: current_last, page: page + 1 } : null;
    },
    queryKey: [
      "paginated-cluster-validators",
      hash,
      perPage,
      chainId,
      publicKey,
    ],
    queryFn: ({ pageParam }) => {
      const pageParams = pageParam as { lastId: string; page: number } | null;
      return getPaginatedClusterValidators({
        page: pageParams?.page,
        pageDirection: "next",
        perPage,
        publicKey,
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
    validators: activeValidators,
    infiniteQuery,
    total,
  };
};
