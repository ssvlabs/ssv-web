import { useQuery } from "@tanstack/react-query";
import { getStrategies } from "@/api/b-app.ts";
import { useSearchParams } from "react-router-dom";
import { createDefaultPagination } from "@/lib/utils/api.ts";

export const useStrategies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  setSearchParams;
  const page = Number(searchParams.get("page") || 1);
  const perPage = Number(searchParams.get("perPage") || 10);
  const query = useQuery({
    queryKey: [page, perPage],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () => getStrategies({ page: page, perPage: perPage }),
    enabled: true,
  });

  const strategies = query.data?.data || [];

  const pagination = query.data?.pagination || createDefaultPagination();
  return { query, pagination, strategies };
};
