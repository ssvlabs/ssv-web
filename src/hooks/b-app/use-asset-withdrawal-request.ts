import { useAccount } from "@/hooks/account/use-account";
import { useWithdrawalRequests } from "@/lib/contract-interactions/b-app/read/use-withdrawal-requests";
import type { QueryKey } from "@tanstack/react-query";
import type { Address } from "abitype";

type WithdrawalRequestQueryKeyParams = {
  strategyId: string;
  asset: Address;
};
export const getWithdrawalRequestsQueryKey = ({
  strategyId,
  asset,
}: WithdrawalRequestQueryKeyParams): QueryKey => {
  return ["withdrawal-requests", strategyId.toString(), asset.toLowerCase()];
};

export const useAssetWithdrawalRequest = ({
  strategyId,
  asset,
}: WithdrawalRequestQueryKeyParams) => {
  const { address } = useAccount();

  const request = useWithdrawalRequests({
    strategyId: Number(strategyId),
    account: address!,
    token: asset,
  });

  return request;
};
