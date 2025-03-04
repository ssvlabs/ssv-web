import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import { validateMetadata } from "@/api/b-app.ts";

interface StrategyMetadata {
  data: {
    name: string;
    description: string;
  };
}

interface AccountMetadata {
  data: {
    name: string;
    logo: string;
  };
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
    queryFn: () => validateMetadata<StrategyMetadata>(strategyMetadata!.uri),
    enabled: Boolean(strategyMetadata?.isValid && strategyMetadata?.uri),
  });

  const accountMetadataQuery = useChainedQuery({
    queryKey: ["account_metadata", accountMetadata?.uri],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () => validateMetadata<AccountMetadata>(accountMetadata!.uri),
    enabled: Boolean(accountMetadata?.isValid && accountMetadata?.uri),
  });

  return {
    strategyMetadata: strategyMetadataQuery,
    accountMetadata: accountMetadataQuery,
  };
};
