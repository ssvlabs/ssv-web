import { getPaginatedOperatorValidators } from "@/api/operator";
import { useOperatorPageParams } from "@/hooks/operator/use-operator-page-params";
import { filterOutRemovedValidators } from "@/lib/utils/cluster";
import { getNextPageParam } from "@/lib/utils/infinite-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRemovedOptimisticValidators } from "@/hooks/cluster/use-removed-optimistic-validators";

export const useInfiniteOperatorValidators = (
  _operatorId?: number,
  perPage = 10,
) => {
  const params = useOperatorPageParams();
  const operatorId = _operatorId || params.operatorId;

  const removedOptimisticValidators = useRemovedOptimisticValidators();

  const infiniteQuery = useInfiniteQuery({
    initialPageParam: 1,
    getNextPageParam,
    queryKey: ["paginated-operator-validators", operatorId, perPage],
    queryFn: ({ pageParam = 1 }) =>
      getPaginatedOperatorValidators({
        operatorId: operatorId!.toString(),
        page: pageParam,
        perPage,
      }),
    enabled: Boolean(operatorId),
  });

  const fetchedValidators =
    infiniteQuery.data?.pages.flatMap((page) => page.validators) || [];

  const activeValidators = filterOutRemovedValidators(
    fetchedValidators,
    removedOptimisticValidators.data || [],
  );

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
