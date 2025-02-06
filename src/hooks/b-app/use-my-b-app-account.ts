import { useQuery } from "@tanstack/react-query";
import { formatUnits, isAddress } from "viem";
import { getMyAccount } from "@/api/b-app.ts";
import { useAccount } from "@/hooks/account/use-account.ts";
import { convertToPercentage } from "@/lib/utils/number.ts";

export const useMyBAppAccount = () => {
  const { address } = useAccount();

  const reactQueryData = useQuery({
    queryKey: [address],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () => address && getMyAccount(address),
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
    isLoading: reactQueryData.isLoading,
    totalPercentage,
    restBalancePercentage,
    effectiveBalance: reactQueryData.data?.effectiveBalance,
    totalDelegatedValue: +formatUnits(BigInt(totalDelegatedValue2), 9),
  };
};
