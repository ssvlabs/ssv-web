/* eslint-disable react-hooks/rules-of-hooks */
import type { UseReadContractParameters, UseReadContractReturnType } from "wagmi";
import { useReadContract, useWriteContract } from "wagmi";
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
import type { ContractFunctionName } from "viem";
import type { Prettify } from "@/types/ts-utils";
import { useInterval } from "react-use";

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

type WriteHooksObject<TAbi extends Abi> = {
  [Fn in ExtractAbiFunctions<TAbi, "nonpayable" | "payable"> as `use${Capitalize<Fn["name"]>}`]: (args?: {
    chainId?: number;
    contract?: Address;
  }) => WriteHookResult<Fn & AbiFunction>;
};

type CustomQueryOptions = {
  chainId?: number;
  enabled?: boolean;
  watch?: boolean;
  contract?: Address;
};

const refetchInterval = 12000;

type ReadFnName<TAbi extends Abi, TName extends string> = TName &
  ContractFunctionName<TAbi, "view" | "pure">;

type ReadHooksObject<TAbi extends Abi> = {
  [Fn in ExtractAbiFunctions<TAbi, "view" | "pure"> as `use${Capitalize<Fn["name"]>}`]: Fn["inputs"] extends readonly []
    ? (
        options?: CustomQueryOptions &
          UseQueryOptions<
            UseReadContractReturnType<
              TAbi,
              ReadFnName<TAbi, Fn["name"]>
            >["data"]
          >,
      ) => UseReadContractReturnType<TAbi, ReadFnName<TAbi, Fn["name"]>>
    : (
        params: AbiInputsToParams<Fn["inputs"]>,
        options?: CustomQueryOptions &
          UseQueryOptions<
            UseReadContractReturnType<
              TAbi,
              ReadFnName<TAbi, Fn["name"]>
            >["data"]
          >,
      ) => UseReadContractReturnType<TAbi, ReadFnName<TAbi, Fn["name"]>>;
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function createContractHooks<
  T extends Abi,
  DefaultContractAddressGetter extends () => Address | undefined,
>(abi: T, defaultContractAddressGetter?: DefaultContractAddressGetter) {
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

  const hooks: Record<string, unknown> = {};

  readFunctions.forEach((fn) => {
    const hookName = `use${capitalize(fn.name)}`;
    const functionName = fn.name;
    const hasInputs = Boolean(fn.inputs?.length);
    const abiFunction = extractAbiFunction(abi, functionName);

    if (hasInputs) {
      hooks[hookName] = (
        params: AbiInputsToParams<typeof fn.inputs>,
        {
          enabled = true,
          watch = false,
          chainId = getChainId(config),
          contract = defaultContractAddressGetter?.(),
          ...queryOptions
        }: CustomQueryOptions = {},
      ) => {
        const contractAddress = contract || defaultContractAddressGetter?.();

        const args = paramsToArray({ params, abiFunction });
        const query = useReadContract({
          abi: abi as Abi,
          address: contractAddress,
          functionName,
          args: args as readonly unknown[],
          chainId,
          query: {
            ...queryOptions,
            enabled:
              (enabled ?? true) &&
              !!contractAddress &&
              args?.every((arg) => !isUndefined(arg)),
          },
        } as UseReadContractParameters);

        useInterval(() => query.refetch, watch ? refetchInterval : null);

        return query;
      };
    } else {
      hooks[hookName] = ({
        enabled = true,
        watch = false,
        chainId = getChainId(config),
        contract = defaultContractAddressGetter?.(),
        ...queryOptions
      }: CustomQueryOptions = {}) => {
        const contractAddress = contract || defaultContractAddressGetter?.();

        const query = useReadContract({
          abi: abi as Abi,
          address: contractAddress,
          functionName,
          chainId,
          query: {
            ...queryOptions,
            enabled: enabled && !!contractAddress,
          },
        } as UseReadContractParameters);

        useInterval(() => query.refetch, watch ? refetchInterval : null);

        return query;
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

      type WriteMutationParams = Parameters<
        typeof mutation.writeContractAsync
      >[0];

      const write = (params?: WriteParams<AbiFunction>) => {
        params?.options?.onInitiated?.();

        return mutation
          .writeContractAsync(
            {
              abi,
              address: contract,
              functionName,
              chainId,
              args: params?.args
                ? paramsToArray({ params: params.args, abiFunction })
                : undefined,
              value: params?.value,
            } as WriteMutationParams,
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
                return params?.options?.onError?.(
                  error as WriteContractErrorType,
                );
              },
            }),
          );
      };

      const send = (params?: WriteParams<AbiFunction>) => {
        params?.options?.onInitiated?.();

        return mutation.writeContractAsync(
          {
            abi,
            address: contract,
            functionName,
            args: params?.args
              ? paramsToArray({ params: params.args, abiFunction })
              : undefined,
            value: params?.value,
          } as WriteMutationParams,
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

    hooks[hookName] = hookFn;
  });

  return hooks as WriteHooksObject<T> & ReadHooksObject<T>;
}
