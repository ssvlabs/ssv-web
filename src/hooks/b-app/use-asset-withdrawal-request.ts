import { useAccount } from "@/hooks/account/use-account";
import { useWITHDRAWAL_EXPIRE_TIME } from "@/lib/contract-interactions/b-app/read/use-withdrawal-expire-time";
import {
  fetchWithdrawalRequests,
  useWithdrawalRequests,
} from "@/lib/contract-interactions/b-app/read/use-withdrawal-requests";
import { useWITHDRAWAL_TIMELOCK_PERIOD } from "@/lib/contract-interactions/b-app/read/use-withdrawal-timelock-period";
import { ms } from "@/lib/utils/number";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import type { Address } from "abitype";
import { isAfter, isWithinInterval } from "date-fns";
import { useMemo } from "react";

type WithdrawalRequestQueryKeyParams = {
  strategyId: string;
  asset: Address;
};

export type WithdrawalRequestStatus =
  | "none"
  | "pending"
  | "withdrawable"
  | "expired";

export const useStrategyAssetWithdrawalRequest = ({
  strategyId,
  asset,
}: WithdrawalRequestQueryKeyParams) => {
  const queryClient = useQueryClient();
  const { address } = useAccount();

  const { data: timelockPeriod = 0 } = useWITHDRAWAL_TIMELOCK_PERIOD({
    staleTime: ms(1, "days"),
    select: (seconds) => seconds * 1000,
  });
  const { data: expirePeriod = 0 } = useWITHDRAWAL_EXPIRE_TIME({
    staleTime: ms(1, "days"),
    select: (seconds) => seconds * 1000,
  });

  const requestQuery = useWithdrawalRequests({
    strategyId: Number(strategyId),
    account: address!,
    token: asset,
  });

  const clearRequestQueryData = () => {
    queryClient.setQueryData(requestQuery.queryKey, () => {
      return [0n, 0];
    });
  };

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: requestQuery.queryKey,
    });
  };

  const request = {
    amount: requestQuery.data?.[0] || 0n,
    timestamp:
      (requestQuery.data?.[1] || 0) * 1000 -
      ms(5.22, "days") -
      ms(1.3, "minutes"),
  };

  const hasRequested = request.amount > 0n;

  const periods = useMemo(() => {
    const pending = {
      start: request.timestamp,
      end: request.timestamp + timelockPeriod,
    };
    const execution = {
      start: pending.end,
      end: pending.end + expirePeriod,
    };
    return { pending, execution };
  }, [expirePeriod, request.timestamp, timelockPeriod]);

  const inPendingPeriod =
    hasRequested &&
    isWithinInterval(Date.now(), {
      start: periods.pending.start,
      end: periods.pending.end,
    });

  const inExecutionPeriod =
    hasRequested &&
    isWithinInterval(Date.now(), {
      start: periods.execution.start,
      end: periods.execution.end,
    });

  const isExpired = hasRequested && isAfter(Date.now(), periods.execution.end);

  const status: WithdrawalRequestStatus = useMemo(() => {
    if (!hasRequested) return "none";
    if (inPendingPeriod) return "pending";
    if (inExecutionPeriod) return "withdrawable";
    return "expired";
  }, [hasRequested, inExecutionPeriod, inPendingPeriod]);

  return {
    request,
    requestQuery,
    clearRequestQueryData,
    invalidate,
    periods,
    hasRequested,
    inPendingPeriod,
    inExecutionPeriod,
    isExpired,
    status,
  };
};

type GetTotalWithdrawalRequestsParams = {
  strategyIds: string[];
  asset: Address;
};

export const useGetTotalWithdrawalRequests = (
  params: GetTotalWithdrawalRequestsParams,
) => {
  const { address } = useAccount();
  return useQueries({
    queries: params.strategyIds.map((strategyId) => ({
      queryKey: ["withdrawal-requests", strategyId, params.asset],
      queryFn: () =>
        fetchWithdrawalRequests({
          strategyId: Number(strategyId),
          account: address!,
          token: params.asset,
        }),
    })),
    combine(result) {
      return result.reduce(
        (acc, curr) => acc + +Boolean(curr.data?.[0] || 0n),
        0,
      );
    },
  });
};
