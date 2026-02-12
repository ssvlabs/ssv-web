import { getPaginatedAccountOperators } from "@/api/operator";
import { useCreatedOptimisticOperators } from "@/hooks/operator/use-created-optimistic-operators";
import { createDefaultPagination } from "@/lib/utils/api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Address } from "abitype";
import { unionBy } from "lodash-es";
import { useSearchParams } from "react-router-dom";
import { useAccount } from "@/hooks/account/use-account";
import type { UseQueryOptions } from "@/lib/react-query";
import { getDefaultChainedQueryOptions, enabled } from "@/lib/react-query";
import { boolify } from "@/lib/utils/boolean";
import { useChainId } from "wagmi";
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";

export const getPaginatedAccountOperatorsQueryOptions = (
  address?: Address,
  page: number = 1,
  perPage: number = 10,
  {
    chainId = getSSVNetworkDetails().networkId,
    options,
  } = getDefaultChainedQueryOptions(),
) =>
  queryOptions({
    queryKey: [
      "paginated-my-account-operators",
      address?.toLowerCase(),
      page,
      perPage,
      chainId,
    ],
    queryFn: () =>
      getPaginatedAccountOperators({
        address: address!,
        page: page,
        perPage,
      }),
    enabled: boolify(address) && enabled(options?.enabled),
  });

export const usePaginatedAccountOperators = (
  perPage = 10,
  options: UseQueryOptions = {},
) => {
  const { address } = useAccount();
  const chainId = useChainId();

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const { data: optimisticOperators = [] } = useCreatedOptimisticOperators();

  const paginatedOperators = useQuery(
    getPaginatedAccountOperatorsQueryOptions(address, page, perPage, {
      chainId,
      options,
    }),
  );

  const setPage = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page: String(page) }));
  };

  if (
    paginatedOperators.data?.pagination &&
    page > paginatedOperators.data.pagination.pages
  ) {
    setPage(paginatedOperators.data.pagination.pages);
  }

  const pagination =
    paginatedOperators.data?.pagination || createDefaultPagination();
  const hasNext = page < pagination.pages;
  const hasPrev = page > 1;
  const isLastPage = page === pagination.pages;

  const operators =
    (isLastPage
      ? unionBy(
          paginatedOperators.data?.operators,
          optimisticOperators,
          "id",
        ) || []
      : paginatedOperators.data?.operators) || [];

  const next = () => {
    hasNext && setPage(page + 1);
  };

  const prev = () => {
    hasPrev && setPage(page - 1);
  };

  return {
    query: paginatedOperators,
    operators,
    pagination,
    hasNext,
    hasPrev,
    next,
    prev,
    page,
  };
};
