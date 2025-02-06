import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/api/b-app.ts";
import { useSearchParams } from "react-router-dom";
import { createDefaultPagination } from "@/lib/utils/api.ts";

export const useBAppAccounts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const perPage = Number(searchParams.get("perPage") || 10);

  const query = useQuery({
    queryKey: [page, perPage],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () => getAccounts({ page, perPage }),
  });

  const pagination = query.data?.pagination || createDefaultPagination();
  const hasNext = page < pagination.pages;
  const hasPrev = page > 1;

  const accounts = query.data?.data || [];
  const isLoading = query.isLoading;
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
    accounts,
    pagination,
    hasNext,
    isLoading,
    hasPrev,
    next,
    prev,
    page,
  };
};
