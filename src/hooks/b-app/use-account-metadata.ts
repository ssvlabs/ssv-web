import { useChainedQuery } from "@/hooks/react-query/use-chained-query.ts";
import { getAccountsMetadata } from "@/api/b-app.ts";

export const useAccountMetadata = (data: { id: string; url: string }[]) => {
  const accountsMetadata = useChainedQuery({
    queryKey: ["account_metadata", data],
    queryFn: () => getAccountsMetadata(data),
    enabled: Boolean(data.length),
  });

  const { data: dataItem, isLoading } = accountsMetadata;
  return { data: dataItem, isLoading };
};
