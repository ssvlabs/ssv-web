import { useAccount } from "@/hooks/account/use-account";
import { useAccountAssets } from "@/hooks/b-app/use-account-assets";
import { fetchWithdrawalRequests } from "@/lib/contract-interactions/b-app/read/use-withdrawal-requests";
import { useQueries } from "@tanstack/react-query";

export const useAssetsWithdrawalRequests = () => {
  const { address } = useAccount();
  const { assets } = useAccountAssets();

  const requests = useQueries({
    queries:
      assets
        ?.map((asset) => {
          if (!asset.slashableAsset) return [];
          return asset.slashableAsset?.deposits.map((deposit) => {
            return {
              queryKey: [
                "withdrawal-requests",
                deposit.strategyId,
                asset.token,
              ],
              queryFn: async () => {
                const [amount, requestedAt] = await fetchWithdrawalRequests({
                  strategyId: Number(deposit.strategyId),
                  token: asset.token,
                  account: address!,
                });
                return {
                  strategyId: deposit.strategyId,
                  asset: asset.token,
                  request: {
                    amount,
                    requestedAt,
                  },
                };
              },
              enabled: !!address,
            };
          });
        })
        .flat() || [],

    combine: (results) => {
      return results.filter((r) => r.data != null).map((r) => r.data);
    },
  });

  return requests;
};
