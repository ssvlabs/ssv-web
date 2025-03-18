import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import type { AccountMetadata, BAppAccount } from "@/api/b-app.ts";
import { getAccounts } from "@/api/b-app.ts";
import { useSearchParams } from "react-router-dom";
import { createDefaultPagination } from "@/lib/utils/api.ts";
import { usePaginationQuery } from "@/lib/query-states/use-pagination.ts";
import { useAccountMetadata } from "@/hooks/b-app/use-account-metadata.ts";

export const useBAppAccounts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, perPage } = usePaginationQuery();
  const searchInput = searchParams.get("address") || "";

  const query = useChainedQuery({
    queryKey: ["get_accounts", page, perPage, searchInput],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () => getAccounts({ page, perPage, searchInput }),
  });

  const pagination = query.data?.pagination || createDefaultPagination();
  const hasNext = page < pagination.pages;
  const hasPrev = page > 1;

  const accounts = query.data?.data || [];
  const { data: accountsMetadata, isLoading: accountsMetadataIsLoading } =
    useAccountMetadata(
      accounts.map(({ id, metadataURI }) => ({
        id,
        url: metadataURI || "",
      })) || [],
    );

  const isLoading = query.isLoading || accountsMetadataIsLoading;
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

  const mappedMetadata: Record<string, AccountMetadata> = (
    accountsMetadata || []
  ).reduce((acc, metadataItem) => {
    return { ...acc, [metadataItem.id]: metadataItem.data };
  }, {});

  return {
    query,
    accounts: accounts.map((account: BAppAccount) => ({
      ...account,
      ...mappedMetadata[account.id],
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
