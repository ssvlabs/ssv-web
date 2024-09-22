/* eslint-disable @typescript-eslint/no-explicit-any */
import { ms } from "@/lib/utils/number";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import type {
  dataTagSymbol,
  DefaultOptions,
  Updater,
  UseMutationOptions,
  UseQueryOptions as DefaultUseQueryOptions,
  UseInfiniteQueryOptions as DefaultUseInfiniteQueryOptions,
  UseQueryResult,
  QueryKey,
} from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { deserialize, serialize } from "wagmi";

const storageKey = "ssv:query-client-offline-cache";
const versionKey = "ssv:web-app-version";

const prevVersion = window.localStorage.getItem(versionKey);
console.log("prevVersion:", prevVersion);
if (prevVersion !== APP_VERSION) {
  window.localStorage.removeItem(storageKey);
  window.localStorage.setItem(versionKey, APP_VERSION);
}

export const queryConfig = {
  queries: {
    staleTime: ms(1, "minutes"),
    gcTime: ms(24, "hours"),
  },
} satisfies DefaultOptions;

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

export const persister = createSyncStoragePersister({
  key: storageKey,
  serialize,
  storage: window.localStorage,
  deserialize,
});

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

export type QueryConfig<
  T extends (...args: any) => any = (...args: any) => any,
> = Omit<ReturnType<T>, "queryKey" | "queryFn">;

export type UseQueryOptions<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  DefaultUseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  "queryKey" | "queryFn"
>;

export type UseInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  DefaultUseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  "queryKey" | "queryFn"
>;

export type MutationConfig<
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;

type ExtractDataTagSymbol<T> = T extends {
  [K in typeof dataTagSymbol]: infer U;
}
  ? U
  : never;

type CustomQueryKey = (string | undefined)[] & {
  [dataTagSymbol]: unknown;
};

export const setOptimisticData = <
  T extends CustomQueryKey,
  Data = ExtractDataTagSymbol<T>,
>(
  queryKey: T,
  updater: Updater<Data | undefined, Data | undefined>,
) => {
  queryClient.cancelQueries({ queryKey });
  // @ts-expect-error don't know how to fix this
  queryClient.setQueryData(queryKey, updater);
};

type MinimalQueryStatus = Pick<
  UseQueryResult,
  | "isFetched"
  | "isLoading"
  | "isPending"
  | "isSuccess"
  | "isFetching"
  | "error"
  | "isError"
>;

export const combineQueryStatus = (
  ...queries: MinimalQueryStatus[]
): MinimalQueryStatus => {
  return {
    isPending: queries.some((query) => query.isPending),
    isLoading: queries.some((query) => query.isLoading),
    isFetched: queries.every((query) => query.isFetched),
    isFetching: queries.some((query) => query.isFetching),
    isError: queries.some((query) => query.isError),
    isSuccess: queries.every((query) => query.isSuccess),
    error: queries.find((query) => query.isError)?.error ?? null,
  };
};
