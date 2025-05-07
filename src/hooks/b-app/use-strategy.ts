import { useParams } from "react-router";
import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import type { Strategy, StrategyMetadata } from "@/api/b-app.ts";
import { getNonSlashableAssets } from "@/api/b-app.ts";
import { getMyAccount } from "@/api/b-app.ts";
import { getStrategyById } from "@/api/b-app.ts";
import { useAccountMetadata } from "@/hooks/b-app/use-account-metadata.ts";
import { useStrategyMetadata } from "@/hooks/b-app/use-strategy-metadata.ts";
import { useBAppMetadata } from "@/hooks/b-app/use-b-app-metadata.ts";
import { useAccount } from "@/hooks/account/use-account.ts";

export const useStrategy = (_strategyId?: string) => {
  const params = useParams();
  const strategyId = _strategyId || params.strategyId || "";

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
  const bAppsURIS = strategy?.bAppsList?.map((bApp) => ({
    id: bApp.bAppId,
    url: bApp.metadataURI,
  }));
  const { data: bAppsMetadata, isLoading: bAppsMetadataIsLoading } =
    useBAppMetadata(
      (bAppsURIS || [{ id: "", url: "" }]) as { id: string; url: string }[],
    );

  const strategyMetadata = strategyMetadataItem[`${strategy?.id}`];

  const accountQuery = useChainedQuery({
    queryKey: ["Account", strategyQuery.data?.ownerAddress],
    queryFn: () =>
      strategyQuery.data?.ownerAddress &&
      getMyAccount(strategyQuery.data.ownerAddress),
    enabled: Boolean(strategyQuery.data?.ownerAddress),
  });
  const { address } = useAccount();

  const accountNonSlashableAssetsQuery = useChainedQuery({
    queryKey: ["AccountNonSlashableAssets", address],
    queryFn: () => getNonSlashableAssets(address!),
    enabled: Boolean(address),
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
    account: {
      ...account,
      ...accountMetadata,
      delegations: accountNonSlashableAssetsQuery.data?.delegations,
      effectiveBalance: accountNonSlashableAssetsQuery.data?.effectiveBalance,
    },
    strategy: {
      ...strategy,
      ...strategyMetadata,
      bAppsList: strategy?.bAppsList?.map((bApp) => ({
        ...bApp,
        ...bAppsMetadata[bApp.bAppId],
      })),
    } as Strategy & StrategyMetadata,
    strategyQuery,
    isLoading:
      strategyQuery.isLoading ||
      accountQuery.isLoading ||
      bAppsMetadataIsLoading ||
      strategyMetadataIsLoading ||
      accountMetadataIsLoading,
    invalidate,
  };
};
