import type { Pagination } from "@/types/api";

export const getNextPageParam = <T extends { pagination: Pagination }>(
  lastPage: T,
) => {
  const { page, pages } = lastPage.pagination;
  return page < pages ? page + 1 : undefined;
};
