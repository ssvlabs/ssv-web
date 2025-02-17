import { useWriteContract } from "wagmi";
import type { Abi, AbiFunction, Address, ExtractAbiFunctions } from "abitype";
import type { WriteContractErrorType } from "@wagmi/core";
import type { WaitForTransactionReceiptErrorType, Hash } from "viem";
import { useWaitForTransactionReceipt } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import type {
  MutationOptions,
  AllEvents,
} from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import {
  paramsToArray,
  extractAbiFunction,
} from "@/lib/contract-interactions/utils";
import type { AbiInputsToParams } from "@/lib/contract-interactions/utils";
import { useMemo } from "react";
import { wait } from "@/lib/utils/promise";

type WriteParams<T extends AbiFunction> = {
  value?: bigint;
} & AbiInputsToParams<T["inputs"]>;

type Capitalize<S extends string> = S extends `${infer F}${infer R}`
  ? `${Uppercase<F>}${R}`
  : S;
type WriteHookResult<T extends WriteParams<AbiFunction> | void> = {
  error: Error | null;
  isSuccess: boolean;
  isPending: boolean;
  mutation: ReturnType<typeof useWriteContract>;
  write: (params: T, options?: MutationOptions<AllEvents>) => Promise<unknown>;
  wait: ReturnType<typeof useWaitForTransactionReceipt>;
};

type WriteHooksObject<T extends AbiFunction[]> = {
  [K in T[number]["name"] as `use${Capitalize<K>}Write`]: () => WriteHookResult<
    WriteParams<Extract<T[number], { name: K }>>
  >;
};

export function createWriteHooks<T extends Abi>(
  abi: T,
  contractAddressGetter: () => Address,
) {
  // Filter write functions from ABI
  const writeFunctions = abi.filter(
    (item) =>
      item.type === "function" &&
      item.stateMutability !== "view" &&
      item.stateMutability !== "pure",
  ) as AbiFunction[];

  return writeFunctions.reduce(
    (acc, fn) => {
      const hookName = "use" + fn.name;
      const contractAddress = contractAddressGetter();

      const waitForTx = useWaitForTransactionReceipt([
        hookName,
        contractAddress,
      ]);
      const functionName = fn.name;

      const abiFunction = useMemo(
        () => extractAbiFunction(abi, functionName),
        [functionName],
      );

      const mutation = useWriteContract();

      const write = (
        params: WriteParams<typeof fn>,
        options: MutationOptions<AllEvents> = {},
      ) => {
        options.onInitiated?.();

        return mutation
          .writeContractAsync(
            // @ts-expect-error - TODO: fix this
            {
              abi,
              address: contractAddress,
              functionName,
              ...(params && { args: paramsToArray({ params, abiFunction }) }),
              ...(fn.stateMutability === "payable" &&
                params?.value && { value: params.value }),
            },
            {
              onSuccess: (hash) => options.onConfirmed?.(hash),
              onError: (error) =>
                options.onError?.(error as WriteContractErrorType),
            },
          )
          .then((hash) =>
            waitForTx.mutateAsync(hash as Hash, {
              onSuccess: async (receipt) => {
                await wait(1);
                return options.onMined?.(receipt);
              },
              onError: async (error) => {
                await wait(1);
                return options.onError?.(
                  error as WaitForTransactionReceiptErrorType,
                );
              },
            }),
          );
      };

      // @ts-expect-error - we dont care about the type of the hook name
      acc[hookName] = {
        error: mutation.error || waitForTx.error,
        isSuccess: waitForTx.isSuccess,
        isPending: mutation.isPending || waitForTx.isPending,
        mutation,
        write,
        wait: waitForTx,
      };

      return acc;
    },
    {} as WriteHooksObject<ExtractAbiFunctions<T>[]>,
  );
}
