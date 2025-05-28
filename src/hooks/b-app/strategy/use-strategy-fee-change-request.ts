import { useFeeExpireTime } from "@/lib/contract-interactions/b-app/read/use-fee-expire-time";
import { useFeeTimelockPeriod } from "@/lib/contract-interactions/b-app/read/use-fee-timelock-period";
import { useFeeUpdateRequests } from "@/lib/contract-interactions/b-app/read/use-fee-update-requests";
import { ms } from "@/lib/utils/number";
import { useQueryClient } from "@tanstack/react-query";
import { isAfter, isWithinInterval } from "date-fns";
import { useMemo } from "react";
import { useInterval, useUpdate } from "react-use";

type WithdrawalRequestQueryKeyParams = {
  strategyId: string;
  /**
   * When enabled, the hook will automatically re-render every second to track time-based state changes
   * (pending → executable → expired transitions). This ensures real-time updates for time-sensitive
   * fee change request statuses.
   * @default false
   */
  enableTimeTracking?: boolean;
};

export type RequestStatus = "none" | "pending" | "executable" | "expired";

export const useStrategyFeeChangeRequestStatus = ({
  strategyId,
  enableTimeTracking = false,
}: WithdrawalRequestQueryKeyParams) => {
  const queryClient = useQueryClient();

  const { data: timelockPeriod = 0 } = useFeeTimelockPeriod({
    staleTime: ms(1, "days"),
    select: (seconds) => seconds * 1000,
  });
  const { data: expirePeriod = 0 } = useFeeExpireTime({
    staleTime: ms(1, "days"),
    select: (seconds) => seconds * 1000,
  });

  const requestQuery = useFeeUpdateRequests({
    strategyId: Number(strategyId),
  });

  const request = {
    percentage: requestQuery.data?.[0] || 0,
    timestamp: (requestQuery.data?.[1] || 0) * 1000,
  };

  const clearRequestQueryData = () => {
    queryClient.setQueryData(requestQuery.queryKey, () => {
      return [0, 0];
    });
  };

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: requestQuery.queryKey,
    });
  };

  const hasRequested = request.percentage > 0n;

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

  const status: RequestStatus = useMemo(() => {
    if (!hasRequested) return "none";
    if (inPendingPeriod) return "pending";
    if (inExecutionPeriod) return "executable";
    return "expired";
  }, [hasRequested, inExecutionPeriod, inPendingPeriod]);

  const canRerender = enableTimeTracking && hasRequested && !isExpired;
  useInterval(useUpdate(), canRerender ? ms(1, "seconds") : null);

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
