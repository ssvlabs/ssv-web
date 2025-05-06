import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import { getMetadata } from "@/api/b-app.ts";

interface StrategyMetadata {
  name: string;
  description: string;
}

interface AccountMetadata {
  name: string;
  logo: string;
}

export const useRequestMetadataByURI = ({
  strategyMetadata,
  accountMetadata,
}: {
  strategyMetadata?: { uri: string; isValid: boolean };
  accountMetadata?: { uri: string; isValid: boolean };
}) => {
  const strategyMetadataQuery = useChainedQuery({
    queryKey: ["strategy_metadata", strategyMetadata?.uri],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () =>
      getMetadata<{ id: string; data: StrategyMetadata }[]>([
        { id: "strategy_metadata", url: strategyMetadata?.uri || "" },
      ]),
    enabled: Boolean(strategyMetadata?.isValid && strategyMetadata?.uri),
  });

  const accountMetadataQuery = useChainedQuery({
    queryKey: ["account_metadata", accountMetadata?.uri],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () =>
      getMetadata<{ id: string; data: AccountMetadata }[]>([
        { id: "account_metadata", url: accountMetadata!.uri || "" },
      ]),
    enabled: Boolean(accountMetadata?.isValid && accountMetadata?.uri),
  });

  return {
    strategyMetadata: strategyMetadataQuery,
    accountMetadata: accountMetadataQuery,
  };
};
