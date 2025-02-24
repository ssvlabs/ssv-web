import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
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
  const strategyMetadataQuery: UseQueryResult<StrategyMetadata | undefined> =
    useQuery({
      queryKey: ["strategy_metadata", strategyMetadata?.uri],
      staleTime: 0,
      gcTime: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      queryFn: () =>
        strategyMetadata?.uri && validateMetadata(strategyMetadata.uri),
      enabled: strategyMetadata?.isValid,
    });

  const accountMetadataQuery: UseQueryResult<AccountMetadata | undefined> =
    useQuery({
      queryKey: ["account_metadata", accountMetadata?.uri],
      staleTime: 0,
      gcTime: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      queryFn: () =>
        accountMetadata?.uri && validateMetadata(accountMetadata.uri),
      enabled: accountMetadata?.isValid,
    });

  return {
    strategyMetadata: strategyMetadataQuery,
    accountMetadata: accountMetadataQuery,
  };
};
