import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import type { AccountMetadata, BAppAccount } from "@/api/b-app.ts";
import { getAccounts } from "@/api/b-app.ts";
import { useSearchParams } from "react-router-dom";
import { createDefaultPagination } from "@/lib/utils/api.ts";
import { usePaginationQuery } from "@/lib/query-states/use-pagination.ts";
import { useAccountsMetadata } from "@/hooks/b-app/use-account-metadata.ts";
import { parseAsString, useQueryState } from "nuqs";

export const useBAppAccounts = () => {
  const [, setSearchParams] = useSearchParams();
  const { page, perPage } = usePaginationQuery();
  const [address] = useQueryState("address", parseAsString);

  const query = useChainedQuery({
    queryKey: ["get_accounts", page, perPage, address],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () =>
      getAccounts({ page, perPage, searchInput: address || undefined }),
  });

  const pagination = query.data?.pagination || createDefaultPagination();
  const hasNext = page < pagination.pages;
  const hasPrev = page > 1;

  const accounts = query.data?.data || [];
  const accountsMetadata = useAccountsMetadata(
    accounts.map(({ id, metadataURI }) => ({
      id,
      url: metadataURI || "",
    })) || [],
  );

  const isLoading = query.isLoading || accountsMetadata.isLoading;
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
    accounts: accounts.map((account: BAppAccount) => ({
      ...account,
      ...accountsMetadata.data?.map[account.id],
    })) as (BAppAccount & AccountMetadata)[],
    pagination,
    hasNext,
    isLoading,
    hasPrev,
    next,
    prev,
    page,
  };
};
