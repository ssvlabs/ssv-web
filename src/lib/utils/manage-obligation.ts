import { differenceInSeconds } from "date-fns";
import type { BAppAsset } from "@/api/b-app.ts";
import type { Address } from "abitype";

const detectPendingOrWaiting = ({
  timeLockPeriod,
  expiredPeriod,
  percentageProposedTimestamp,
}: {
  timeLockPeriod: number;
  expiredPeriod: number;
  percentageProposedTimestamp: number;
}) => {
  const timeStampDate = Number(percentageProposedTimestamp || 0) * 1000;
  const isPendingEnd = timeLockPeriod * 1000 + timeStampDate;
  const isFinalizeEnd = expiredPeriod * 1000 + timeStampDate;
  const originalDate = new Date().getTime();

  const isPending =
    timeStampDate > 0 && differenceInSeconds(isPendingEnd, originalDate) > 0;
  const isExpired =
    timeStampDate > 0 && differenceInSeconds(isFinalizeEnd, originalDate) < 0;
  const isWaiting = timeStampDate > 0 && !isExpired && !isPending;
  return { isWaiting, isPending, isExpired, isPendingEnd, isFinalizeEnd };
};

export const getFirstPendingOrWaitingObligation = ({
  obligations,
  expiredPeriod,
  timeLockPeriod,
}: {
  obligations: Record<
    string,
    {
      bAppId: Address;
      percentage: string;
      percentageProposed: string;
      percentageProposedTimestamp: string;
    }
  >;
  timeLockPeriod: number;
  expiredPeriod: number;
}) => {
  const keys = Object.keys(obligations);
  for (const key of keys) {
    const obligationStates = detectPendingOrWaiting({
      timeLockPeriod,
      expiredPeriod,
      percentageProposedTimestamp: Number(
        obligations[key].percentageProposedTimestamp || 0,
      ),
    });
    if (obligationStates.isWaiting || obligationStates.isPending) {
      return { ...obligationStates, key };
    }
  }
};

export const getPendingObligationsCount = ({
  obligations,
  expiredPeriod,
  timeLockPeriod,
}: {
  obligations: {
    bAppId: Address;
    percentage: string;
    percentageProposed: string;
    percentageProposedTimestamp: string;
  }[];
  timeLockPeriod: number;
  expiredPeriod: number;
}) => {
  return obligations.reduce((acc, obligation) => {
    const obligationStates = detectPendingOrWaiting({
      timeLockPeriod,
      expiredPeriod,
      percentageProposedTimestamp: Number(
        obligation.percentageProposedTimestamp || 0,
      ),
    });
    if (obligationStates.isWaiting || obligationStates.isPending) {
      return acc + 1;
    }
    return acc;
  }, 0);
};

export const getObligationData = (
  obligations: BAppAsset[],
  token: Address,
  bAppId: string,
) => {
  const obligationsToMap = obligations.reduce(
    (
      acc: Record<
        Address,
        | {
            bAppId: Address;
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
          bAppId: Address;
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
