// ------------------------------------------------
// This file is auto-generated by createWriteContractQueries.js
// ------------------------------------------------

import { useWriteContract } from "wagmi";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import type {
  BAppEvent,
  MutationOptions,
} from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useWaitForTransactionReceipt } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { BAppABI } from "@/lib/abi/b-app/b-app";
import type { ExtractAbiFunction } from "abitype";
import type { AbiInputsToParams } from "@/lib/contract-interactions/utils";
import {
  paramsToArray,
  extractAbiFunction,
} from "@/lib/contract-interactions/utils";
import type { WriteContractErrorType } from "@wagmi/core";
import type { WaitForTransactionReceiptErrorType } from "viem";

type Fn = ExtractAbiFunction<typeof BAppABI, "proposeWithdrawal">;
const abiFunction = extractAbiFunction(BAppABI, "proposeWithdrawal");
// type State = "idle" | "confirming" | "mining" | "mined" | "error";

export const useProposeWithdrawal = () => {
  const { bAppContractAddress } = useSSVNetworkDetails();

  const wait = useWaitForTransactionReceipt<BAppEvent>([
    "useProposeWithdrawal",
    bAppContractAddress,
  ]);
  const mutation = useWriteContract();

  const write = (
    params: AbiInputsToParams<Fn["inputs"]>,
    options: MutationOptions<BAppEvent> = {},
  ) => {
    options.onInitiated?.();
    return mutation
      .writeContractAsync(
        {
          abi: BAppABI,
          address: bAppContractAddress,
          functionName: "proposeWithdrawal",
          args: paramsToArray({ params, abiFunction }),
        },
        {
          onSuccess: (hash) => options.onConfirmed?.(hash),
          onError: (error) =>
            options.onError?.(error as WriteContractErrorType),
        },
      )
      .then((result) =>
        wait.mutateAsync(result, {
          onSuccess: (receipt) => options.onMined?.(receipt),
          onError: (error) =>
            options.onError?.(error as WaitForTransactionReceiptErrorType),
        }),
      );
  };

  const isPending = mutation.isPending || wait.isPending;

  return {
    error: mutation.error || wait.error,
    isSuccess: wait.isSuccess,
    isPending,
    mutation,
    write,
    wait,
  };
};
