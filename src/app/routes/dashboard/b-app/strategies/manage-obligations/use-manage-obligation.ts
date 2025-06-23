import type { BAppAsset } from "@/api/b-app.ts";
import { useObligationTimelockPeriod } from "@/lib/contract-interactions/b-app/read/use-obligation-timelock-period.ts";
import { useObligationExpireTime } from "@/lib/contract-interactions/b-app/read/use-obligation-expire-time.ts";
import { useStrategy } from "@/hooks/b-app/use-strategy.ts";
import { differenceInSeconds } from "date-fns";
import { getObligationData } from "@/lib/utils/manage-obligation.ts";

export const useManageObligation = (
  strategyId: string,
  bAppId: string,
  token: `0x${string}`,
) => {
  const obligationTimelockPeriod = useObligationTimelockPeriod();
  const obligationExpiredPeriod = useObligationExpireTime();
  const strategyData = useStrategy(strategyId);

  const { strategy } = strategyData;

  const obligations = (strategy.depositsPerToken || []).filter(
    (bAppAsset: BAppAsset) =>
      (bAppAsset.obligations || []).some(
        ({ bAppId }) => bAppId.toLowerCase() === bAppId?.toLowerCase(),
      ),
  );

  const tokenObligation = getObligationData(obligations, token, bAppId);
  const timeLockPeriod = (obligationTimelockPeriod?.data || 0) * 1000;
  const expiredPeriod = (obligationExpiredPeriod?.data || 0) * 1000;
  const timeStampDate =
    Number(tokenObligation?.percentageProposedTimestamp || 0) * 1000;
  const originalDate = new Date().getTime();

  const isPendingEnd = timeLockPeriod + timeStampDate;
  const isFinalizeEnd = expiredPeriod + timeStampDate;

  const isPending =
    timeStampDate > 0 && differenceInSeconds(isPendingEnd, originalDate) > 0;
  const isExpired =
    timeStampDate > 0 && differenceInSeconds(isFinalizeEnd, originalDate) < 0;
  const isWaiting = timeStampDate > 0 && !isExpired && !isPending;

  // };

  return {
    isObligated: Number(tokenObligation?.percentage || 0) > 0,
    isExpired,
    isWaiting,
    isPending,
    isPendingEnd,
    isFinalizeEnd,
  };
};
