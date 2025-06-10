import { differenceInSeconds } from "date-fns";
import type { BAppAsset } from "@/api/b-app.ts";

export const getPendingObligationsCount = ({
  obligations,
  expiredPeriod,
  timeLockPeriod,
}: {
  obligations: {
    bAppId: `0x${string}`;
    percentage: string;
    percentageProposed: string;
    percentageProposedTimestamp: string;
  }[];
  timeLockPeriod: number;
  expiredPeriod: number;
}) => {
  return obligations.reduce((acc, obligation) => {
    const timeStampDate =
      Number(obligation?.percentageProposedTimestamp || 0) * 1000;

    const isPendingEnd = timeLockPeriod * 1000 + timeStampDate;
    const isFinalizeEnd = expiredPeriod * 1000 + timeStampDate;
    const originalDate = new Date().getTime();

    const isPending =
      timeStampDate > 0 && differenceInSeconds(isPendingEnd, originalDate) > 0;
    const isExpired =
      timeStampDate > 0 && differenceInSeconds(isFinalizeEnd, originalDate) < 0;
    const isWaiting = timeStampDate > 0 && !isExpired && !isPending;
    if (isWaiting || isPending) {
      return acc + 1;
    }
    return acc;
  }, 0);
};

export const getObligationData = (
  obligations: BAppAsset[],
  token: `0x${string}`,
  bAppId: string,
) => {
  const obligationsToMap = obligations.reduce(
    (
      acc: Record<
        `0x${string}`,
        | {
            bAppId: `0x${string}`;
            percentage: string;
            percentageProposed: string;
            percentageProposedTimestamp: string;
          }
        | undefined
      >,
      obligation,
    ) => {
      acc[obligation.token] = (obligation.obligations || []).find(
        (obl: {
          bAppId: `0x${string}`;
          percentage: string;
          percentageProposed: string;
          percentageProposedTimestamp: string;
        }) => obl.bAppId.toLowerCase() === bAppId.toLowerCase(),
      );
      return acc;
    },
    {},
  );

  return obligationsToMap[token];
};
