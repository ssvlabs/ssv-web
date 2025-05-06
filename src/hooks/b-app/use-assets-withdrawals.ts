import { useAccount } from "@/hooks/account/use-account";
import { useAccountAssets } from "@/hooks/b-app/use-account-assets";
import { fetchWithdrawalRequests } from "@/lib/contract-interactions/b-app/read/use-withdrawal-requests";
import type { QueryKey } from "@tanstack/react-query";
import { useQueries } from "@tanstack/react-query";

type WithdrawalRequestQueryKeyParams = {
  strategyId: string;
  token: string;
};
export const getWithdrawalRequestsQueryKey = ({
  strategyId,
  token,
}: WithdrawalRequestQueryKeyParams): QueryKey => {
  return ["withdrawal-requests", strategyId.toString(), token.toLowerCase()];
};

export const useAssetsWithdrawalRequests = () => {
  const { address } = useAccount();
  const { assets } = useAccountAssets();

  const requests = useQueries({
    queries:
      assets
        ?.map((asset) => {
          if (!asset.slashableAsset) return [];
          return (asset.slashableAsset?.deposits || [])?.map((deposit) => {
            return {
              queryKey: getWithdrawalRequestsQueryKey({
                strategyId: deposit.strategyId,
                token: asset.token,
              }),
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
  });

  return requests;
};
