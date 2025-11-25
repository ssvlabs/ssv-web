import { MainnetV4SetterABI } from "@/lib/abi/mainnet/v4/setter";
import { tryCatch } from "@/lib/utils/tryCatch";
import { decodeEventLog, type TransactionReceipt } from "viem";

export const decodeSSVEventLogs = <T>(
  receipt: TransactionReceipt,
) =>
  receipt.logs.reduce((acc, log) => {
    try {
      for (const eventAbi of [MainnetV4SetterABI]) {
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

export type DecodedReceipt<T> = TransactionReceipt & {
  events: T[];
};

export const addDecodedEventsToReceipt = <T>(
  receipt: TransactionReceipt,
) =>
  ({
    ...receipt,
    events: decodeSSVEventLogs<T>(receipt),
  }) as DecodedReceipt<T>;
