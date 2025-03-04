import type {
  DefaultError,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useChainId } from "wagmi";

type ChainedQueryAddons = {
  queryKey: QueryKey;
  invalidate: () => Promise<void>;
};
export function useChainedQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
): DefinedUseQueryResult<TData, TError> & ChainedQueryAddons;

export function useChainedQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> & ChainedQueryAddons;

export function useChainedQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> & ChainedQueryAddons;

export function useChainedQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  const queryClient = useQueryClient();
  const chainId = useChainId();
  // Fix the typing by casting the new array back to TQueryKey
  const queryKey = [...options.queryKey, chainId] as unknown as TQueryKey;

  const query = useQuery({
    ...options,
    queryKey,
  });

  (query as unknown as ChainedQueryAddons).queryKey = queryKey;
  (query as unknown as ChainedQueryAddons).invalidate = () =>
    queryClient.invalidateQueries({ queryKey });

  return query as UseQueryResult<TData, TError> & ChainedQueryAddons;
}
