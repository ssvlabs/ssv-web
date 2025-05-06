import { useStrategyIdFilter } from "@/hooks/b-app/filters/use-strategy-id-filter";
import { useTokensFilter } from "@/hooks/b-app/filters/use-tokens-filter";
import { usePaginationQuery } from "@/lib/query-states/use-pagination";
import { useEffect, useRef } from "react";

export const useStrategiesFilters = () => {
  const idFilter = useStrategyIdFilter();
  const tokensFilter = useTokensFilter();

  const paginationQuery = usePaginationQuery();

  const _page = useRef(paginationQuery.page);
  _page.current = paginationQuery.page;

  const _setPage = useRef(paginationQuery.setPage);
  _setPage.current = paginationQuery.setPage;

  useEffect(() => {
    if (_page.current > 1) {
      _setPage.current(1);
    }
  }, [tokensFilter.value?.at(0), paginationQuery.perPage]);

  return { paginationQuery, idFilter, tokensFilter };
};
