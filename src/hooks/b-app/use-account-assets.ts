import { useBAppsAssets } from "@/hooks/b-app/use-assets";
import { useSlashableAssets } from "@/hooks/b-app/use-slashable-assets";
import type { SlashableAsset, StrategyMetadata } from "@/api/b-app";
import type { Address } from "abitype";
import { useBalances } from "@/hooks/account/use-balances";
import { normalizeTokenAddress } from "@/lib/utils/token";
import { useStrategiesMetadata } from "@/hooks/b-app/use-strategy-metadata.ts";

export type AccountAsset = {
  slashableAsset?: SlashableAsset;
  tokenInfo: {
    balance: bigint;
    decimals: number;
  };
  token: Address;
  totalDepositAmount: string;
  totalFiatDepositAmount: string;
};

export const useAccountAssets = () => {
  const {
    assets,
    query: { isLoading: isAssetsLoading },
  } = useBAppsAssets();
  const { data: slashableAssets, isLoading: isSlashableAssetsLoading } =
    useSlashableAssets();

  const isLoading = isAssetsLoading || isSlashableAssetsLoading;

  const delegationsMap = new Map(
    slashableAssets?.data.map((a) => [
      normalizeTokenAddress(a.token).toLocaleLowerCase(),
      a,
    ]),
  );

  const balances = useBalances(assets.map((a) => a.token));
  const balancesMap = new Map(
    balances.map((b) => [
      normalizeTokenAddress(b.token).toLocaleLowerCase(),
      b,
    ]),
  );

  const filteredAssets = assets.filter((a) => {
    const addr = normalizeTokenAddress(a.token).toLocaleLowerCase();
    const delegations = delegationsMap.get(addr);
    const balance = balancesMap.get(addr);
    return delegations || (balance && balance.balance > 0n);
  });

  const metadatas = [...delegationsMap.values()].reduce(
    (acc: { id: string; url: string }[], slashableAsset: SlashableAsset) => {
      slashableAsset.deposits.forEach(
        (
          deposit: {
            strategyId: string;
            depositAmount: string;
            fiatDepositAmount: string;
            metadataURI?: string;
          } & StrategyMetadata,
        ) => {
          acc.push({
            id: deposit.strategyId,
            url: deposit.metadataURI || "",
          });
        },
      );
      return acc;
    },
    [],
  );
  const { data: strategiesMetadata, isLoading: strategiesMetadataIsLoading } =
    useStrategiesMetadata(metadatas || []);

  const accountAssets = filteredAssets.map((a) => {
    const addr = normalizeTokenAddress(a.token).toLocaleLowerCase();
    const delegations = delegationsMap.get(addr);
    return {
      ...a,
      slashableAsset: {
        ...delegations,
        deposits: (delegations?.deposits || []).map((deposit) => ({
          ...deposit,
          ...strategiesMetadata?.map[deposit.strategyId],
        })) as ({
          strategyId: string;
          depositAmount: string;
          fiatDepositAmount: string;
          metadataURI?: string;
        } & StrategyMetadata)[],
      } as SlashableAsset,
      totalDepositAmount: delegations?.totalDepositAmount || "0",
      totalFiatDepositAmount: delegations?.totalFiatDepositAmount || "0",
      tokenInfo: balancesMap.get(addr) || { balance: 0n, decimals: 18 },
    } satisfies AccountAsset;
  });
  return {
    assets: accountAssets,
    isLoading: isLoading || strategiesMetadataIsLoading,
  };
};
