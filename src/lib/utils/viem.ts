import { BAppABI } from "@/lib/abi/b-app/b-app";
import { MainnetV4SetterABI } from "@/lib/abi/mainnet/v4/setter";
import type { AllEvents } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { tryCatch } from "@/lib/utils/tryCatch";
import { decodeEventLog, type TransactionReceipt } from "viem";

export const decodeSSVEventLogs = <T extends AllEvents>(
  receipt: TransactionReceipt,
) =>
  receipt.logs.reduce((acc, log) => {
    try {
      for (const eventAbi of [MainnetV4SetterABI, BAppABI]) {
        tryCatch(() => {
          const event = decodeEventLog({
            abi: eventAbi,
            data: log.data,
            topics: log.topics,
          });
          acc.push(event as T);
        }, undefined);
      }
    } catch (e) {
      console.error(e);
    }
    return acc;
  }, [] as T[]);

export type DecodedReceipt<T extends AllEvents = AllEvents> = TransactionReceipt & {
  events: T[];
};

export const addDecodedEventsToReceipt = <T extends AllEvents>(
  receipt: TransactionReceipt,
) =>
  ({
    ...receipt,
    events: decodeSSVEventLogs<T>(receipt),
  }) as DecodedReceipt<T>;
