import { useAccount } from "@/hooks/account/use-account";
import { useWITHDRAWAL_EXPIRE_TIME } from "@/lib/contract-interactions/b-app/read/use-withdrawal-expire-time";
import { useWithdrawalRequests } from "@/lib/contract-interactions/b-app/read/use-withdrawal-requests";
import { useWITHDRAWAL_TIMELOCK_PERIOD } from "@/lib/contract-interactions/b-app/read/use-withdrawal-timelock-period";
import { ms } from "@/lib/utils/number";
import { useQueryClient } from "@tanstack/react-query";
import type { Address } from "abitype";
import { isAfter, isWithinInterval } from "date-fns";
import { useMemo } from "react";

type WithdrawalRequestQueryKeyParams = {
  strategyId: string;
  asset: Address;
};

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
    timestamp: (requestQuery.data?.[1] || 0) * 1000 || 0 + timelockPeriod,
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
  };
};
