import { TestnetV4SetterABI } from "@/lib/abi/testnet/v4/setter";
import { MainnetV4SetterABI } from "@/lib/abi/mainnet/v4/setter";
import { BAppABI } from "@/lib/abi/b-app/b-app";

import type { MutationKey } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import type {
  Address,
  DecodeEventLogReturnType,
  TransactionReceipt,
  WaitForTransactionReceiptErrorType,
} from "viem";
import { decodeEventLog } from "viem";
import { useChainId, usePublicClient } from "wagmi";

import type { WriteContractErrorType } from "@wagmi/core";
import {
  useMultisigTransactionModal,
  useTransactionModal,
} from "@/signals/modal";
import type { Toast } from "@/components/ui/use-toast";
import { toast } from "@/components/ui/use-toast";
import { wait } from "@/lib/utils/promise";
import type { MaybePromise } from "@tanstack/react-query-persist-client";
import { isFunction } from "lodash-es";
import { getErrorMessage } from "@/lib/utils/wagmi";
import { Span } from "@/components/ui/text";
import { mainnet_private_rpc_client } from "@/wagmi/config";
import { isContractWallet } from "@/hooks/account/use-account";
import { tryCatch } from "@/lib/utils/tryCatch";

export type MainnetEvent = DecodeEventLogReturnType<typeof MainnetV4SetterABI>;
export type BAppEvent = DecodeEventLogReturnType<typeof BAppABI>;
export type TestnetEvent = DecodeEventLogReturnType<typeof TestnetV4SetterABI>;

export type AllEvents = MainnetEvent | TestnetEvent | BAppEvent;

export type MutationOptions<T extends AllEvents> = {
  onInitiated?: () => MaybePromise<unknown | (() => unknown)>;
  onConfirmed?: (hash: Address) => MaybePromise<unknown | (() => unknown)>;
  onMined?: (
    receipt: TransactionReceipt & { events: T[]; topics?: T[] },
  ) => MaybePromise<unknown | (() => unknown)>;
  onError?: (
    error: WriteContractErrorType | WaitForTransactionReceiptErrorType,
  ) => MaybePromise<unknown | (() => unknown)>;
};

export const withTransactionModal = <
  T extends MutationOptions<AllEvents> & {
    successToast?: Toast;
    variant?: "default" | "2-step";
  },
>(
  options?: T,
) => {
  return {
    onInitiated: () => {
      options?.onInitiated?.();
      if (isContractWallet()) {
        useMultisigTransactionModal.state.open();
      }
    },
    onConfirmed: async (hash) => {
      if (isContractWallet()) {
        useMultisigTransactionModal.state.open();
      } else {
        useTransactionModal.state.open({
          hash,
          variant: options?.variant,
          step: "pending",
        });
      }
      const fn = await options?.onConfirmed?.(hash);
      isFunction(fn) && fn();
    },
    onMined: async (receipt) => {
      useMultisigTransactionModal.state.close();

      useTransactionModal.state.open();
      useTransactionModal.state.meta.hash = receipt.transactionHash;
      useTransactionModal.state.meta.step = "indexing";
      useTransactionModal.state.meta.variant = options?.variant;

      const fn = await options?.onMined?.(receipt);

      useTransactionModal.state.close();
      await wait(0); // skip a react lifecycle to ensure the navigation blocker is cleared so the user can navigate away

      isFunction(fn) && fn();

      toast({
        title: "Transaction confirmed",
        description: new Date().toLocaleString(),
        ...options?.successToast,
      });
    },
    onError: async (error) => {
      const fn = await options?.onError?.(error);

      useTransactionModal.state.close();
      useMultisigTransactionModal.state.close();
      await wait(0); // skip a react lifecycle to ensure the navigation blocker is cleared so the user can navigate away

      isFunction(fn) && fn();

      toast({
        title: "Transaction failed",
        description: (
          <Span className="whitespace-pre-wrap">{getErrorMessage(error)}</Span>
        ),
        variant: "destructive",
      });
    },
  } satisfies MutationOptions<AllEvents>;
};

const useClient = () => {
  const chain = useChainId();
  const publicClient = usePublicClient();
  return chain === 1 ? mainnet_private_rpc_client : publicClient;
};

export const useWaitForTransactionReceipt = <T extends AllEvents>(
  key: MutationKey = [],
) => {
  const client = useClient();

  return useMutation({
    mutationKey: ["waitForTransactionReceipt", ...key],
    mutationFn: (hash: `0x${string}`) => {
      if (!client) {
        throw new Error("Public client not found");
      }
      return client?.waitForTransactionReceipt({ hash }).then((receipt) => ({
        ...receipt,
        events: receipt.logs.reduce((acc, log) => {
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
        }, [] as T[]),
      }));
    },
  });
};

export const useWaitForTransactionReceipt_Testnet = () => {
  const client = useClient();

  return useMutation({
    mutationKey: ["waitForTransactionReceipt"],
    mutationFn: (hash: `0x${string}`) => {
      if (!client) {
        throw new Error("Public client not found");
      }
      return client?.waitForTransactionReceipt({ hash }).then((receipt) => ({
        ...receipt,
        events: receipt.logs.reduce((acc, log) => {
          try {
            acc.push(
              decodeEventLog({
                abi: TestnetV4SetterABI,
                data: log.data,
                topics: log.topics,
              }),
            );
          } catch (e) {
            console.error(e);
          }
          return acc;
        }, [] as TestnetEvent[]),
      }));
    },
  });
};
