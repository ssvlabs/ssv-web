import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import { formatUnits, isAddress } from "viem";
import type { StrategiesByOwnerResponse } from "@/api/b-app.ts";
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

export const useMyBAppAccount = () => {
  const { address } = useAccount();
  const [searchParams] = useSearchParams();
  const idToSearch = Number(searchParams.get("id") || "");
  const { orderBy, sort } = useOrdering();

  const { page, perPage } = usePaginationQuery();

  const reactQueryData = useChainedQuery({
    queryKey: [address],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () => address && getNonSlashableAssets(address),
    enabled: address && isAddress(address),
  });

  const myStrategies = useChainedQuery({
    queryKey: ["get_my_strategies", page, perPage, idToSearch, orderBy, sort],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () =>
      address &&
      getStrategiesByOwnerAddress({
        page: page,
        perPage: perPage,
        ownerAddress: address,
      }),
    enabled: address && isAddress(address),
  });

  const myAccountData = useChainedQuery({
    queryKey: ["my_account", address],
    queryFn: () => address && getMyAccount(address),
    enabled: address && isAddress(address),
  });

  const myBApps = useChainedQuery({
    queryKey: ["get_my_b_apps", page, perPage, address],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () =>
      address && getBAppsByOwnerAddress({ address, page, perPage }),
    enabled: address && isAddress(address),
  });

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
    data: reactQueryData.data,
    myStrategies: myStrategies.data || ({} as StrategiesByOwnerResponse),
    myBApps: myBApps.data,
    myAccountData: myAccountData.data?.data[0],
    isLoading:
      reactQueryData.isLoading ||
      myStrategies.isLoading ||
      myBApps.isLoading ||
      myAccountData.isLoading,
    totalPercentage,
    restBalancePercentage,
    effectiveBalance: reactQueryData.data?.effectiveBalance,
    totalDelegatedValue: +formatUnits(BigInt(totalDelegatedValue2), 9),
  };
};
