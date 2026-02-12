import { useWriteContract } from "wagmi";
import { useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import type {
  MainnetEvent,
  MutationOptions,
} from "./utils/useWaitForTransactionReceipt";
import { useWaitForTransactionReceipt } from "./utils/useWaitForTransactionReceipt";
import { MainnetV4SetterABI } from "@/lib/abi/mainnet/v4/setter";
import type { ExtractAbiFunction, ExtractAbiFunctionNames } from "abitype";
import type { AbiInputsToParams } from "./utils";
import { paramsToArray, extractAbiFunction } from "./utils";
import type { WriteContractErrorType } from "@wagmi/core";
import type { WaitForTransactionReceiptErrorType } from "viem";

type WritableFunctionName = Exclude<
  ExtractAbiFunctionNames<typeof MainnetV4SetterABI, "nonpayable" | "payable">,
  "owner"
>;

export function createContractHook<
  T extends WritableFunctionName = "acceptOwnership",
  Fn extends ExtractAbiFunction<
    typeof MainnetV4SetterABI,
    T
  > = ExtractAbiFunction<typeof MainnetV4SetterABI, T>,
>(functionName: T) {
  const abiFunction = extractAbiFunction(MainnetV4SetterABI, functionName);
  return () => {
    const { setterContractAddress } = useSSVNetworkDetails();
    const wait = useWaitForTransactionReceipt();
    const mutation = useWriteContract();

    const write = (
      params: AbiInputsToParams<Fn["inputs"]>,
      options: MutationOptions<MainnetEvent> = {},
    ) => {
      return mutation
        .writeContractAsync(
          // @ts-expect-error - this is a workaround to avoid the error
          {
            abi: MainnetV4SetterABI,
            address: setterContractAddress,
            functionName: functionName,
            // @ts-expect-error - this is a workaround to avoid the error
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
    };
  };
}
