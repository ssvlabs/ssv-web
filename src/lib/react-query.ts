/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { ms } from "@/lib/utils/number";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { hashFn } from "@wagmi/core/query";
import type {
  dataTagSymbol,
  DefaultOptions,
  FetchStatus,
  Updater,
  UseMutationOptions,
  UseQueryOptions as DefaultUseQueryOptions,
  UseInfiniteQueryOptions as DefaultUseInfiniteQueryOptions,
  UseQueryResult,
  QueryKey,
} from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { Address } from "abitype";
import { deserialize, serialize } from "wagmi";

const storageKey = "ssv:query-client-offline-cache";
const versionKey = "ssv:web-app-version";

const prevVersion = window.localStorage.getItem(versionKey);
if (prevVersion !== "random-version-so-we-can-clear-the-cache") {
  window.localStorage.removeItem(storageKey);
  window.localStorage.setItem(
    versionKey,
    "random-version-so-we-can-clear-the-cache",
  );
  console.log("cleared cache");
}

export const queryConfig = {
  queries: {
    staleTime: ms(1, "minutes"),
    gcTime: ms(24, "hours"),
    queryKeyHashFn: hashFn,
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

export type QueryOptionsWithChainId = {
  chainId?: number;
  account?: Address;
  options?: UseQueryOptions;
};

export const getDefaultChainedQueryOptions = ({
  chainId,
  account,
  options,
}: QueryOptionsWithChainId = {}): QueryOptionsWithChainId => {
  return {
    chainId: chainId ?? getSSVNetworkDetails().networkId,
    account,
    options: {
      ...options,
      enabled: options?.enabled ?? true,
    },
  };
};

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

type CustomQueryKey = (string | undefined | number)[] & {
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

type UnavailableQuery = {
  fetchStatus: FetchStatus;
  isPending: boolean;
  isPlaceholderData?: boolean;
  dataUpdatedAt?: number;
  errorUpdatedAt?: number;
};

// Refetching a query that has no data resets it to status "pending" (error
// cleared) for the whole retry cycle; its last settled outcome is still the
// failure, so it stays unavailable until a fetch succeeds.
// With keepPreviousData a new key reports the previous key's data as
// "success" (isPlaceholderData) instead, which is just as stale.
const isRetryingAfterError = (query: UnavailableQuery) =>
  (query.isPending || Boolean(query.isPlaceholderData)) &&
  query.fetchStatus !== "idle" &&
  (query.errorUpdatedAt ?? 0) > (query.dataUpdatedAt ?? 0);

/**
 * Adds `isPaused` / `isUnavailable` to a (combined) query status and narrows
 * `isPending` to queries that are actually on their way to a result.
 *
 * - A read that cannot reach the RPC parks at fetchStatus "paused" and never
 *   resolves to an error, so paused counts as unavailable too.
 * - A disabled query sits at fetchStatus "idle" with status "pending" forever;
 *   it counts as neither pending nor unavailable and is reported as `isIdle`.
 *   `!isPending && !isUnavailable` is therefore not proof of a value: gate
 *   rendered amounts on `isSuccess` (or check `isIdle`).
 */
export const withUnavailable = <
  T extends { isError: boolean; isPending: boolean },
>(
  status: T,
  queries: UnavailableQuery[],
) => {
  const isPaused = queries.some((query) => query.fetchStatus === "paused");
  const isRetrying = queries.some(isRetryingAfterError);
  const hasActivePending = queries.some(
    (query) =>
      query.isPending &&
      query.fetchStatus !== "idle" &&
      !isRetryingAfterError(query),
  );
  return {
    ...status,
    isPaused,
    isIdle: status.isPending && !hasActivePending && !isPaused && !isRetrying,
    isUnavailable: status.isError || isPaused || isRetrying,
    isPending: status.isPending && hasActivePending && !isPaused && !isRetrying,
  };
};

type RefetchableQuery = {
  isError: boolean;
  refetch: (options?: { cancelRefetch?: boolean }) => unknown;
};

/**
 * Retries errored reads on an interval while `isUnavailable` holds.
 *
 * A query that exhausted its retries stays in error until something refetches
 * it (mount, focus, a `watch` interval), so a read without `watch` would show
 * "Unavailable" until the page is reloaded. Paused reads resume on their own
 * once the browser is back online, so only errored ones are retried here.
 * `cancelRefetch: false` lets every observer of a shared query join one fetch.
 */
export const useRefetchWhileUnavailable = (
  queries: RefetchableQuery[],
  isUnavailable: boolean,
  intervalMs = ms(12, "seconds"),
) => {
  const queriesRef = useRef(queries);
  queriesRef.current = queries;

  useEffect(() => {
    if (!isUnavailable) return;
    const id = setInterval(() => {
      queriesRef.current.forEach((query) => {
        if (query.isError) query.refetch({ cancelRefetch: false });
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [isUnavailable, intervalMs]);
};

export const enabled = (...booleans: (unknown | undefined)[]): boolean => {
  return Boolean(booleans.every((bool) => bool ?? true));
};
