/* eslint-disable react-hooks/rules-of-hooks */
import type {
  UseReadContractParameters,
  UseReadContractReturnType,
} from "wagmi";
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
  [Fn in ExtractAbiFunctions<
    TAbi,
    "nonpayable" | "payable"
  > as `use${Capitalize<Fn["name"]>}`]: (args?: {
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
  [Fn in ExtractAbiFunctions<
    TAbi,
    "view" | "pure"
  > as `use${Capitalize<Fn["name"]>}`]: Fn["inputs"] extends readonly []
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

/**
 * Two boundary helpers that cast only at the dynamic↔static-generic seam.
 * The factory iterates ABI entries at runtime (string functionName / unknown args),
 * while wagmi requires statically-known ContractFunctionName<TAbi> generics.
 * Isolating the casts here keeps all hook construction logic above cast-free.
 */
function toReadContractParams<TAbi extends Abi>(params: {
  abi: TAbi;
  address: Address | undefined;
  functionName: string;
  args?: readonly unknown[];
  chainId: number;
  query: Record<string, unknown>;
}): UseReadContractParameters {
  return params as UseReadContractParameters;
}

type WriteContractParams = Parameters<
  ReturnType<typeof useWriteContract>["writeContractAsync"]
>[0];

function toWriteContractParams<TAbi extends Abi>(params: {
  abi: TAbi;
  address: Address | undefined;
  functionName: string;
  chainId?: number;
  args?: readonly unknown[];
  value?: bigint;
}): WriteContractParams {
  return params as WriteContractParams;
}

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

  // Object.fromEntries: the cast is on the result of the full transformation,
  // not on an empty accumulator that is later mutated (which TypeScript cannot verify).
  const readHooks = Object.fromEntries(
    readFunctions.map((fn) => {
      const functionName = fn.name;
      const hasInputs = Boolean(fn.inputs?.length);
      const abiFunction = extractAbiFunction(abi, functionName);

      const hookFn = hasInputs
        ? (
            params: AbiInputsToParams<typeof fn.inputs>,
            {
              enabled = true,
              watch = false,
              chainId = getChainId(config),
              contract = defaultContractAddressGetter?.(),
              ...queryOptions
            }: CustomQueryOptions = {},
          ) => {
            const contractAddress =
              contract || defaultContractAddressGetter?.();
            const args = paramsToArray({ params, abiFunction });
            const query = useReadContract(
              toReadContractParams({
                abi,
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
              }),
            );
            useInterval(() => query.refetch, watch ? refetchInterval : null);
            return query;
          }
        : ({
            enabled = true,
            watch = false,
            chainId = getChainId(config),
            contract = defaultContractAddressGetter?.(),
            ...queryOptions
          }: CustomQueryOptions = {}) => {
            const contractAddress =
              contract || defaultContractAddressGetter?.();
            const query = useReadContract(
              toReadContractParams({
                abi,
                address: contractAddress,
                functionName,
                chainId,
                query: {
                  ...queryOptions,
                  enabled: enabled && !!contractAddress,
                },
              }),
            );
            useInterval(() => query.refetch, watch ? refetchInterval : null);
            return query;
          };

      return [`use${capitalize(functionName)}`, hookFn];
    }),
  ) as ReadHooksObject<T>;

  const writeHooks = Object.fromEntries(
    writeFunctions.map((fn) => {
      const hookName = `use${capitalize(fn.name)}`;

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

        const write = (params?: WriteParams<AbiFunction>) => {
          params?.options?.onInitiated?.();
          return mutation
            .writeContractAsync(
              toWriteContractParams({
                abi,
                address: contract,
                functionName,
                chainId,
                args: params?.args
                  ? paramsToArray({ params: params.args, abiFunction })
                  : undefined,
                value: params?.value,
              }),
              {
                onSuccess: (hash) => params?.options?.onConfirmed?.(hash),
                onError: (error: WriteContractErrorType) =>
                  params?.options?.onError?.(error),
              },
            )
            .then((hash) =>
              waitForTx.mutateAsync(hash, {
                onSuccess: async (receipt) => {
                  await wait(1);
                  return params?.options?.onMined?.(receipt);
                },
                onError: async (error: Error) => {
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
            toWriteContractParams({
              abi,
              address: contract,
              functionName,
              args: params?.args
                ? paramsToArray({ params: params.args, abiFunction })
                : undefined,
              value: params?.value,
            }),
            {
              onSuccess: (hash) => params?.options?.onConfirmed?.(hash),
              onError: (error: WriteContractErrorType) =>
                params?.options?.onError?.(error),
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

      return [hookName, hookFn];
    }),
  ) as WriteHooksObject<T>;

  // satisfies verifies the merged shape against both mapped types.
  return { ...readHooks, ...writeHooks } satisfies WriteHooksObject<T> &
    ReadHooksObject<T>;
}
