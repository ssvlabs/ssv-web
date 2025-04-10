import { useAccount } from "@/hooks/account/use-account";
import { useWITHDRAWAL_EXPIRE_TIME } from "@/lib/contract-interactions/b-app/read/use-withdrawal-expire-time";
import { useWithdrawalRequests } from "@/lib/contract-interactions/b-app/read/use-withdrawal-requests";
import { useWITHDRAWAL_TIMELOCK_PERIOD } from "@/lib/contract-interactions/b-app/read/use-withdrawal-timelock-period";
import type { QueryKey } from "@tanstack/react-query";
import type { Address } from "abitype";
import { isAfter, isWithinInterval } from "date-fns";
import { useMemo } from "react";

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

export const useAssetWithdrawalRequestStatus = ({
  strategyId,
  asset,
}: WithdrawalRequestQueryKeyParams) => {
  const { address } = useAccount();

  const { data: timelockPeriod = 0 } = useWITHDRAWAL_TIMELOCK_PERIOD({
    select: (data) => data * 1000,
  });
  const { data: expirePeriod = 0 } = useWITHDRAWAL_EXPIRE_TIME({
    select: (data) => data * 1000,
  });

  const requestQuery = useWithdrawalRequests({
    strategyId: Number(strategyId),
    account: address!,
    token: asset,
  });

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

  const status = !hasRequested
    ? "no-request"
    : inPendingPeriod
      ? "pending"
      : inExecutionPeriod
        ? "execution"
        : "expired";

  return {
    request,
    periods,
    hasRequested,
    inPendingPeriod,
    inExecutionPeriod,
    isExpired,
    status,
  };
};
