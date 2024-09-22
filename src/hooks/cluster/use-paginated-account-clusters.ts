import { getPaginatedAccountClusters } from "@/api/cluster";
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
  {
    chainId = getSSVNetworkDetails().networkId,
    options,
  } = getDefaultChainedQueryOptions(),
) => {
  return queryOptions({
    queryKey: [
      "paginated-account-clusters",
      account?.toLowerCase(),
      page,
      perPage,
      chainId,
    ],
    queryFn: () =>
      getPaginatedAccountClusters({
        account: account!,
        page: page,
        perPage,
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

  const query = useQuery(
    getPaginatedAccountClustersQueryOptions(account.address, page, perPage, {
      chainId,
      options,
    }),
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
