import { getPaginatedAccountClusters } from "@/api/cluster";
import { createDefaultPagination } from "@/lib/utils/api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Address } from "abitype";
import { useSearchParams } from "react-router-dom";
import { useAccount } from "@/hooks/account/use-account";

export const getPaginatedAccountClustersQueryOptions = (
  account: Address | undefined,
  page: number = 1,
  perPage: number = 10,
) =>
  queryOptions({
    queryKey: ["paginated-account-clusters", account, page, perPage],
    queryFn: () =>
      getPaginatedAccountClusters({
        account: account!,
        page: page,
        perPage,
      }),
    enabled: Boolean(account),
  });

export const usePaginatedAccountClusters = (perPage = 10) => {
  const { address } = useAccount();

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  const query = useQuery(
    getPaginatedAccountClustersQueryOptions(address, page, perPage),
  );

  const pagination = query.data?.pagination || createDefaultPagination();
  const hasNext = page < pagination.pages;
  const hasPrev = page > 1;

  const clusters = query.data?.clusters || [];

  const next = () => {
    hasNext &&
      setSearchParams((prev) => ({
        ...prev,
        page: String(page + 1),
      }));
  };

  const prev = () => {
    hasPrev &&
      setSearchParams((prev) => ({
        ...prev,
        page: String(page - 1),
      }));
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
  };
};
