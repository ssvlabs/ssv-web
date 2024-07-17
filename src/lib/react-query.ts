import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import {
  DefaultOptions,
  QueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { deserialize, serialize } from "wagmi";

export const queryConfig = {
  queries: {
    staleTime: 10000, // 1 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  },
} satisfies DefaultOptions;

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

export const persister = createSyncStoragePersister({
  serialize,
  storage: window.localStorage,
  deserialize,
});

export type ApiFnReturnType<
  FnType extends (...args: unknown[]) => Promise<unknown>,
> = Awaited<ReturnType<FnType>>;

export type QueryConfig<T extends (...args: unknown[]) => unknown> = Omit<
  ReturnType<T>,
  "queryKey" | "queryFn"
>;

export type MutationConfig<
  MutationFnType extends (...args: unknown[]) => Promise<unknown>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;
