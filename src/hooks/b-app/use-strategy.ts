import { useParams } from "react-router";
import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import type { Strategy, StrategyMetadata } from "@/api/b-app.ts";
import { getMyAccount } from "@/api/b-app.ts";
import { getStrategyById } from "@/api/b-app.ts";
import { useAccountMetadata } from "@/hooks/b-app/use-account-metadata.ts";
import { useStrategyMetadata } from "@/hooks/b-app/use-strategy-metadata.ts";

export const useStrategy = () => {
  const params = useParams();
  const strategyId = params.strategyId || "";

  const strategyQuery = useChainedQuery({
    queryKey: ["get_strategy_by_id", strategyId],
    queryFn: () => getStrategyById(strategyId || 0),
    enabled: Boolean(strategyId),
  });

  const strategy = strategyQuery.data;

  const { data: strategyMetadataItem, isLoading: strategyMetadataIsLoading } =
    useStrategyMetadata([
      { id: strategy?.id || "", url: strategy?.metadataURI || "" },
    ]);

  const strategyMetadata = strategyMetadataItem[`${strategy?.id}`];

  const accountQuery = useChainedQuery({
    queryKey: ["Account", strategyQuery.data?.ownerAddress],
    queryFn: () =>
      strategyQuery.data?.ownerAddress &&
      getMyAccount(strategyQuery.data.ownerAddress),
    enabled: Boolean(strategyQuery.data?.ownerAddress),
  });

  const account = accountQuery.data?.data[0];

  const { data: accountMetadataItem, isLoading: accountMetadataIsLoading } =
    useAccountMetadata([
      { id: account?.id || "", url: account?.metadataURI || "" },
    ]);

  const accountMetadata = accountMetadataItem && accountMetadataItem[0]?.data;

  const invalidate = async () => {
    await Promise.all([strategyQuery.invalidate(), accountQuery.invalidate()]);
  };

  return {
    account: { ...account, ...accountMetadata },
    strategy: { ...strategy, ...strategyMetadata } as Strategy &
      StrategyMetadata,
    isLoading:
      strategyQuery.isLoading ||
      accountQuery.isLoading ||
      strategyMetadataIsLoading ||
      accountMetadataIsLoading,
    invalidate,
  };
};
