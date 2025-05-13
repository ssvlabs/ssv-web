import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import { formatUnits, isAddress } from "viem";
import type { BApp, StrategiesByOwnerResponse } from "@/api/b-app.ts";
import { getMyAccount } from "@/api/b-app.ts";
import { getBAppsByOwnerAddress } from "@/api/b-app.ts";
import {
  getNonSlashableAssets,
  getStrategiesByOwnerAddress,
} from "@/api/b-app.ts";
import { useAccount } from "@/hooks/account/use-account.ts";
import { convertToPercentage } from "@/lib/utils/number.ts";
import { useSearchParams } from "react-router-dom";
import { useOrdering } from "@/hooks/use-ordering.ts";
import { usePaginationQuery } from "@/lib/query-states/use-pagination.ts";
import { useAccountsMetadata } from "@/hooks/b-app/use-account-metadata.ts";
import { useStrategiesMetadata } from "@/hooks/b-app/use-strategy-metadata.ts";
import { useBAppMetadata } from "@/hooks/b-app/use-b-app-metadata.ts";

export const useMyBAppAccount = () => {
  const { address } = useAccount();
  const [searchParams] = useSearchParams();
  const idToSearch = Number(searchParams.get("id") || "");
  const { orderBy, sort } = useOrdering();

  const { page, perPage } = usePaginationQuery();

  const reactQueryData = useChainedQuery({
    queryKey: ["non-slashable-assets", address],
    queryFn: () => {
      return getNonSlashableAssets(address!);
    },
    enabled: address && isAddress(address),
  });

  const myStrategies = useChainedQuery({
    queryKey: [
      "get_my_strategies",
      page,
      perPage,
      idToSearch,
      orderBy,
      sort,
      address,
    ],
    queryFn: () =>
      getStrategiesByOwnerAddress({
        page: page,
        perPage: perPage,
        ownerAddress: address!,
      }),
    enabled: address && isAddress(address),
  });

  const receiversMetadata = useAccountsMetadata(
    (reactQueryData.data?.delegations || []).map((delegation) => ({
      id: delegation.receiver.id,
      url: delegation.receiver.metadataURI || "",
    })),
  );

  const strategiesMetadata = useStrategiesMetadata(
    myStrategies.data?.strategies.map(({ id, metadataURI }) => ({
      id,
      url: metadataURI || "",
    })) || [],
  );

  const myAccountQuery = useChainedQuery({
    queryKey: ["my_account", address],
    queryFn: () => getMyAccount(address!),
    enabled: address && isAddress(address),
  });

  const account = myAccountQuery.data?.data[0];

  const accountsMetadata = useAccountsMetadata([
    { id: account?.id || "", url: account?.metadataURI || "" },
  ]);

  const accountMetadata = accountsMetadata.data?.list.at(0)?.data;

  const myBApps = useChainedQuery({
    queryKey: ["get_my_b_apps", page, perPage, address],
    queryFn: () => getBAppsByOwnerAddress({ address: address!, page, perPage }),
    enabled: address && isAddress(address),
  });

  const { data: bAppsMetadata, isLoading: bAppsMetadataIsLoading } =
    useBAppMetadata(
      myBApps.data?.data.map(({ id, metadataURI }) => ({
        id,
        url: metadataURI || "",
      })) || [],
    );

  const totalPercentage = reactQueryData?.data?.delegations.reduce(
    (
      acc: number,
      delegation: { percentage: string; receiver: { id: string } },
    ) => {
      const formattedPercentage = convertToPercentage(delegation.percentage);
      return Math.round((acc + Number(formattedPercentage)) * 100) / 100;
    },
    0,
  );

  const totalDelegatedValue2 = Math.round(
    ((totalPercentage || 0) / 100) *
      Number(reactQueryData?.data?.effectiveBalance || 0n),
  );

  const restBalancePercentage =
    Math.round((100 - (totalPercentage || 0)) * 100) / 100;
  return {
    data: {
      ...reactQueryData.data,
      effectiveBalance: reactQueryData.data?.effectiveBalance || 0n,
      delegations: (reactQueryData.data?.delegations || []).map(
        (delegation) => ({
          ...delegation,
          receiver: {
            ...delegation.receiver,
            ...receiversMetadata.data?.map[delegation.receiver.id],
          },
        }),
      ),
    },
    myStrategies: myStrategies.data
      ? {
          ...myStrategies.data,
          strategies: myStrategies.data.strategies.map((strategy) => ({
            ...strategy,
            ...strategiesMetadata.data?.map[strategy.id],
            ownerAddressMetadata: accountMetadata,
          })),
        }
      : ({} as StrategiesByOwnerResponse),
    myBApps: {
      pagination: myBApps.data?.pagination,
      data: (myBApps.data?.data || []).map((bApp: BApp) => ({
        ...bApp,
        ...bAppsMetadata[bApp.id],
      })),
    },
    myAccountData: { ...account, ...accountMetadata },
    isLoading:
      reactQueryData.isLoading ||
      myStrategies.isLoading ||
      myBApps.isLoading ||
      accountsMetadata.isLoading ||
      bAppsMetadataIsLoading ||
      strategiesMetadata.isLoading ||
      myAccountQuery.isLoading ||
      receiversMetadata.isLoading,
    totalPercentage,
    restBalancePercentage,
    effectiveBalance: reactQueryData.data?.effectiveBalance,
    totalDelegatedValue: +formatUnits(BigInt(totalDelegatedValue2), 9),
  };
};
