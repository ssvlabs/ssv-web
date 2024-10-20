// ------------------------------------------------
// This file is auto-generated by createWriteContractQueries.js
// ------------------------------------------------

import { useWriteContract } from "wagmi";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import type {
  MainnetEvent,
  MutationOptions,
} from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useWaitForTransactionReceipt } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { TokenABI } from "@/lib/abi/token";
import type { ExtractAbiFunction } from "abitype";
import type { AbiInputsToParams } from "@/lib/contract-interactions/utils";
import {
  paramsToArray,
  extractAbiFunction,
} from "@/lib/contract-interactions/utils";
import type { WriteContractErrorType } from "@wagmi/core";
import type { WaitForTransactionReceiptErrorType } from "viem";

type Fn = ExtractAbiFunction<typeof TokenABI, "burnFrom">;
const abiFunction = extractAbiFunction(TokenABI, "burnFrom");
// type State = "idle" | "confirming" | "mining" | "mined" | "error";

export const useBurnFrom = () => {
  const { tokenAddress } = useSSVNetworkDetails();

  const wait = useWaitForTransactionReceipt(["useBurnFrom", tokenAddress]);
  const mutation = useWriteContract();

  const write = (
    params: AbiInputsToParams<Fn["inputs"]>,
    options: MutationOptions<MainnetEvent> = {},
  ) => {
    options.onInitiated?.();
    return mutation
      .writeContractAsync(
        {
          abi: TokenABI,
          address: tokenAddress,
          functionName: "burnFrom",
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