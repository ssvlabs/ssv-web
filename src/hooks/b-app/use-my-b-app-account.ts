import { useQuery } from "@tanstack/react-query";
import { formatUnits, isAddress } from "viem";
import type { StrategiesByOwnerResponse } from "@/api/b-app.ts";
import { getMyAccount, getStrategiesByOwnerAddress } from "@/api/b-app.ts";
import { useAccount } from "@/hooks/account/use-account.ts";
import { convertToPercentage } from "@/lib/utils/number.ts";
import { useSearchParams } from "react-router-dom";
import { useOrdering } from "@/hooks/use-ordering.ts";

export const useMyBAppAccount = () => {
  const { address } = useAccount();
  const [searchParams, setSearchParams] = useSearchParams();
  setSearchParams;
  const page = Number(searchParams.get("page") || 1);
  const idToSearch = Number(searchParams.get("id") || "");
  const perPage = Number(searchParams.get("perPage") || 10);
  const { orderBy, sort } = useOrdering();

  const reactQueryData = useQuery({
    queryKey: [address],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () => address && getMyAccount(address),
    enabled: address && isAddress(address),
  });

  const myStrategies = useQuery({
    queryKey: ["get_my-strategies", page, perPage, idToSearch, orderBy, sort],
    queryFn: () =>
      address &&
      getStrategiesByOwnerAddress({
        page: page,
        perPage: perPage,
        ownerAddress: address,
      }),
    enabled: true,
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
    isLoading: reactQueryData.isLoading || myStrategies.isLoading,
    totalPercentage,
    restBalancePercentage,
    effectiveBalance: reactQueryData.data?.effectiveBalance,
    totalDelegatedValue: +formatUnits(BigInt(totalDelegatedValue2), 9),
  };
};
