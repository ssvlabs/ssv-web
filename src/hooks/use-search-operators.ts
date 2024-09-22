import type { SearchOperatorsParams } from "@/api/operator";
import { searchOperators } from "@/api/operator";
import { useOptimisticOrProvidedOperators } from "@/hooks/operator/use-optimistic-operator";
import { queryClient } from "@/lib/react-query";
import { getNextPageParam } from "@/lib/utils/infinite-query";
import { ms } from "@/lib/utils/number";
import type { Operator, OperatorsSearchResponse } from "@/types/api";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { uniqBy } from "lodash-es";
import { useMemo } from "react";
import { proxy, useSnapshot } from "valtio";

export const useSearchOperators = ({
  ordering = "id:asc",
  search,
  has_dkg_address,
  type,
}: Pick<
  SearchOperatorsParams,
  "ordering" | "search" | "has_dkg_address" | "type"
> = {}) => {
  const query = useInfiniteQuery({
    staleTime: ms(1, "minutes"),
    gcTime: ms(1, "minutes"),
    initialPageParam: 1,
    queryKey: ["search-operators", ordering, search, has_dkg_address, type],
    queryFn: ({ pageParam }) =>
      searchOperators({
        type,
        search,
        ordering,
        has_dkg_address,
        page: pageParam,
        perPage: 20,
      }),
    getNextPageParam,
  });

  const operators = useOptimisticOrProvidedOperators(
    query.data?.pages.flatMap((page) => page.operators) || [],
  );

  const fetched = useFetchedSearchOperators();
  return {
    operators,
    infiniteQuery: query,
    fetched,
  };
};

const fetchedSearchOperators = proxy<{
  operators: Operator[];
}>({
  operators: [],
});

export const useFetchedSearchOperators = () => {
  const { operators } = useSnapshot(fetchedSearchOperators);
  const optimisticOrFetchedOperators = useOptimisticOrProvidedOperators(
    operators as Operator[],
  );

  const operatorsMap = useMemo(
    () =>
      optimisticOrFetchedOperators.reduce(
        (acc, operator) => {
          acc[operator.id] = operator as Operator;
          return acc;
        },
        {} as Record<number, Operator>,
      ),
    [optimisticOrFetchedOperators],
  );

  return {
    operators: optimisticOrFetchedOperators,
    operatorsMap,
  };
};

queryClient.getQueryCache().subscribe((event) => {
  if (event.query.queryKey[0] === "search-operators") {
    if (event.type === "observerOptionsUpdated") return;
    const data = event.query.state.data as
      | InfiniteData<OperatorsSearchResponse, unknown>
      | undefined;
    fetchedSearchOperators.operators = uniqBy(
      [
        ...(data?.pages.flatMap((page) => page.operators) || []),
        ...fetchedSearchOperators.operators,
      ],
      "id",
    );
  }
});
