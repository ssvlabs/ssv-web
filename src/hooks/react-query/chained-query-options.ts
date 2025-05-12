/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from "@/wagmi/config";
import type {
  DefaultError,
  QueryKey,
  UseQueryOptions,
} from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { getChainId } from "@wagmi/core";

type UndefinedInitialDataOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
  initialData?: undefined;
};

export function chainedQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
) {
  const chainId = getChainId(config);
  return queryOptions({
    ...options,
    queryKey: [...options.queryKey, chainId] as unknown as TQueryKey,
  });
}
