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
import { MainnetV4SetterABI } from "@/lib/abi/mainnet/v4/setter";
import type { ExtractAbiFunction } from "abitype";
import type { AbiInputsToParams } from "@/lib/contract-interactions/utils";
import {
  paramsToArray,
  extractAbiFunction,
} from "@/lib/contract-interactions/utils";
import type { WriteContractErrorType } from "@wagmi/core";
import type { WaitForTransactionReceiptErrorType } from "viem";

type Fn = ExtractAbiFunction<typeof MainnetV4SetterABI, "upgradeToAndCall">;
const abiFunction = extractAbiFunction(MainnetV4SetterABI, "upgradeToAndCall");
// type State = "idle" | "confirming" | "mining" | "mined" | "error";

export const useUpgradeToAndCall = () => {
  const { setterContractAddress } = useSSVNetworkDetails();

  const wait = useWaitForTransactionReceipt<MainnetEvent>([
    "useUpgradeToAndCall",
    setterContractAddress,
  ]);
  const mutation = useWriteContract();

  const write = (
    params: AbiInputsToParams<Fn["inputs"]>,
    value?: bigint,
    options: MutationOptions<MainnetEvent> = {},
  ) => {
    options.onInitiated?.();
    return mutation
      .writeContractAsync(
        {
          value,
          abi: MainnetV4SetterABI,
          address: setterContractAddress,
          functionName: "upgradeToAndCall",
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
