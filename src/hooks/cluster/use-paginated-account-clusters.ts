import {
  getPaginatedAccountClusters,
  type OrderBy,
  type Sort,
} from "@/api/cluster";
import { createDefaultPagination } from "@/lib/utils/api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Address } from "abitype";
import { useSearchParams } from "react-router-dom";
import type { UseQueryOptions } from "@/lib/react-query";
import { getDefaultChainedQueryOptions, enabled } from "@/lib/react-query";
import { boolify } from "@/lib/utils/boolean";
import { useChainId } from "wagmi";
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { useAccount } from "@/hooks/account/use-account";

export const getPaginatedAccountClustersQueryOptions = (
  account?: Address,
  page: number = 1,
  perPage: number = 10,
  orderBy: `${OrderBy}:${Sort}` = "id:asc",
  {
    chainId = getSSVNetworkDetails().networkId,
    options,
  } = getDefaultChainedQueryOptions(),
) => {
  return queryOptions({
    queryKey: [
      "paginated-my-account-clusters",
      account?.toLowerCase(),
      page,
      perPage,
      orderBy,
      chainId,
    ],
    queryFn: () =>
      getPaginatedAccountClusters({
        account: account!,
        page: page,
        perPage,
        ordering: orderBy,
      }),
    enabled: boolify(account) && enabled(options?.enabled),
  });
};

export const usePaginatedAccountClusters = (
  perPage = 10,
  options: UseQueryOptions = {},
) => {
  const account = useAccount();
  const chainId = useChainId();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const orderBy =
    (searchParams.get("orderBy") as `${OrderBy}:${Sort}`) || "id:asc";

  const query = useQuery(
    getPaginatedAccountClustersQueryOptions(
      account.address,
      page,
      perPage,
      orderBy,
      {
        chainId,
        options,
      },
    ),
  );

  const setPage = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page: String(page) }));
  };

  const setOrderBy = (orderBy: `${OrderBy}:${Sort}`) => {
    setSearchParams((prev) => ({ ...prev, orderBy, page: "1" }));
  };

  if (query.data?.pagination && page > query.data.pagination.pages) {
    setPage(query.data.pagination.pages);
  }

  const pagination = query.data?.pagination || createDefaultPagination();
  const hasNext = page < pagination.pages;
  const hasPrev = page > 1;

  const clusters = query.data?.clusters || [];

  const next = () => {
    hasNext && setPage(page + 1);
  };

  const prev = () => {
    hasPrev && setPage(page - 1);
  };

  return {
    query,
    clusters,
    pagination,
    hasNext,
    hasPrev,
    next,
    prev,
    page,
    orderBy,
    setOrderBy,
  };
};
