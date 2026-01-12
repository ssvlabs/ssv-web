/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import type { UseReadContractReturnType } from "wagmi";
import { useBlockNumber, useReadContract, useWriteContract } from "wagmi";
import type { Abi, AbiFunction, Address, ExtractAbiFunctions } from "abitype";
import { getChainId, type WriteContractErrorType } from "@wagmi/core";
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
import { config } from "@/wagmi/config";
import { isUndefined } from "lodash-es";
import type { UseQueryOptions } from "@/lib/react-query";
import { isAddress } from "viem";
import type { Prettify } from "@/types/ts-utils";

type WriteParams<T extends AbiFunction> = {
  args: Prettify<AbiInputsToParams<T["inputs"]>>;
  value?: bigint;
  options?: MutationOptions<AllEvents>;
};

type WriteHookResult<T extends AbiFunction> = {
  error: Error | null;
  isSuccess: boolean;
  isPending: boolean;
  mutation: ReturnType<typeof useWriteContract>;
  write: T["inputs"] extends readonly []
    ? (params?: Prettify<Partial<WriteParams<T>>>) => Promise<unknown>
    : (params: Prettify<WriteParams<T>>) => Promise<unknown>;
  send: T["inputs"] extends readonly []
    ? (params?: Prettify<Partial<WriteParams<T>>>) => Promise<`0x${string}`>
    : (params: Prettify<WriteParams<T>>) => Promise<`0x${string}`>;
  wait: ReturnType<typeof useWaitForTransactionReceipt>;
};

type WriteHooksObject<T extends AbiFunction[]> = {
  [Fn in T[number] as `use${Capitalize<Fn["name"]>}`]: (args?: {
    chainId?: number;
    contract?: Address;
  }) => WriteHookResult<Fn>;
};
type CustomQueryOptions = {
  chainId?: number;
  enabled?: boolean;
  watch?: boolean;
  contract?: Address;
};

type ReadHooksObject<T extends AbiFunction[]> = {
  [Fn in T[number] as `use${Capitalize<Fn["name"]>}`]: Fn["inputs"] extends readonly []
    ? (
        options?: CustomQueryOptions &
          //@ts-expect-error - Fn["name"] is not a valid ContractFunctionName
          UseQueryOptions<UseReadContractReturnType<T, Fn["name"]>["data"]>,
        //@ts-expect-error - Fn["name"] is not a valid ContractFunctionName
      ) => UseReadContractReturnType<T, Fn["name"]>
    : (
        params: AbiInputsToParams<Fn["inputs"]>,
        options?: CustomQueryOptions &
          //@ts-expect-error - Fn["name"] is not a valid ContractFunctionName
          UseQueryOptions<UseReadContractReturnType<T, Fn["name"]>["data"]>,
        //@ts-expect-error - Fn["name"] is not a valid ContractFunctionName
      ) => UseReadContractReturnType<T, Fn["name"]>;
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export function createContractHooks<
  T extends Abi,
  DefaultContractAddressGetter extends () => Address | undefined,
>(abi: T, defaultContractAddressGetter?: DefaultContractAddressGetter) {
  // Filter write functions from ABI
  const writeFunctions = abi.filter(
    (item) =>
      item.type === "function" &&
      item.stateMutability !== "view" &&
      item.stateMutability !== "pure",
  ) as AbiFunction[];

  const readFunctions = abi.filter(
    (item) =>
      item.type === "function" &&
      (item.stateMutability === "view" || item.stateMutability === "pure"),
  ) as AbiFunction[];

  const hooks = {};

  readFunctions.forEach((fn) => {
    const hookName = `use${capitalize(fn.name)}`;
    const functionName = fn.name;
    const hasInputs = Boolean(fn.inputs?.length);
    const abiFunction = extractAbiFunction(abi, functionName);

    if (hasInputs) {
      //@ts-expect-error - TODO: fix this
      hooks[hookName] = (
        params: AbiInputsToParams<typeof fn.inputs>,
        {
          enabled = true,
          watch = false,
          chainId = getChainId(config),
          contract = defaultContractAddressGetter?.(),
        }: CustomQueryOptions = {},
      ) => {
        const contractAddress = contract || defaultContractAddressGetter?.();

        const blockNumber = useBlockNumber({
          watch: watch,
          chainId: chainId,
        });
        const args = paramsToArray({ params, abiFunction });

        return useReadContract({
          abi,
          address: contractAddress,
          functionName: functionName as string,
          args: args as readonly unknown[],
          chainId: chainId,
          blockNumber: watch ? blockNumber.data : undefined,
          query: {
            enabled:
              (enabled ?? true) &&
              !!contractAddress &&
              args?.every((arg) => !isUndefined(arg)),
          },
        } as any);
      };
    } else {
      // Create hook function for functions without parameters
      //@ts-expect-error - TODO: fix this
      hooks[hookName] = ({
        enabled = true,
        watch = false,
        chainId = getChainId(config),
        contract = defaultContractAddressGetter?.(),
      }: CustomQueryOptions = {}) => {
        const contractAddress = contract || defaultContractAddressGetter?.();
        const blockNumber = useBlockNumber({ watch: watch });

        return useReadContract({
          abi,
          address: contractAddress,
          functionName: functionName as string,
          chainId: chainId,
          blockNumber: watch ? blockNumber.data : undefined,
          query: {
            enabled: enabled && !!contractAddress,
          },
        } as any);
      };
    }
  });

  writeFunctions.forEach((fn) => {
    const hookName = "use" + capitalize(fn.name);
    const hookFn = ({
      chainId = getChainId(config),
      contract = defaultContractAddressGetter?.(),
    }: CustomQueryOptions = {}) => {
      const isValidContract = isAddress(contract ?? "");
      if (!isValidContract) {
        throw new Error("Invalid contract address at hook: " + hookName);
      }
      const waitForTx = useWaitForTransactionReceipt([hookName, contract]);
      const functionName = fn.name;

      const abiFunction = useMemo(
        () => extractAbiFunction(abi, functionName),
        [functionName],
      );

      const mutation = useWriteContract();

      const write = (params?: WriteParams<any>) => {
        params?.options?.onInitiated?.();

        return mutation
          .writeContractAsync(
            // @ts-expect-error - TODO: fix this
            {
              abi,
              address: contract,
              functionName,
              chainId,
              args: params?.args
                ? paramsToArray({ params: params.args, abiFunction })
                : undefined,
              value: params?.value,
            },
            {
              onSuccess: (hash) => params?.options?.onConfirmed?.(hash),
              onError: (error) => params?.options?.onError?.(error),
            },
          )
          .then((hash) =>
            waitForTx.mutateAsync(hash, {
              onSuccess: async (receipt) => {
                await wait(1);
                return params?.options?.onMined?.(receipt);
              },
              onError: async (error) => {
                await wait(1);
                return params?.options?.onError?.(error as any);
              },
            }),
          );
      };

      const send = (params?: WriteParams<any>) => {
        params?.options?.onInitiated?.();

        return mutation.writeContractAsync(
          // @ts-expect-error - TODO: fix this
          {
            abi,
            address: contract,
            functionName,
            args: params?.args
              ? paramsToArray({ params: params.args, abiFunction })
              : undefined,
            value: params?.value,
          },
          {
            onSuccess: (hash) => params?.options?.onConfirmed?.(hash),
            onError: (error) =>
              params?.options?.onError?.(error as WriteContractErrorType),
          },
        );
      };

      return {
        error: mutation.error || waitForTx.error,
        isSuccess: waitForTx.isSuccess,
        isPending: mutation.isPending || waitForTx.isPending,
        mutation,
        write,
        send,
        wait: waitForTx,
      };
    };

    //@ts-expect-error - TODO: fix this
    hooks[hookName] = hookFn;
  });
  return hooks as WriteHooksObject<
    //@ts-expect-error - TODO: fix this
    ExtractAbiFunctions<T, "nonpayable" | "payable">[]
  > &
    //@ts-expect-error - TODO: fix this
    ReadHooksObject<ExtractAbiFunctions<T, "view" | "pure">[]>;
}
