import { checkOperatorDKGHealth } from "@/api/operator";
import type { Operator } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

import { queryOptions } from "@tanstack/react-query";
import { ms } from "@/lib/utils/number";
import type { QueryConfig } from "@/lib/react-query";

export type OperatorDKGHealthResponse = {
  id: number;
  isHealthy: boolean;
};

export const getOperatorsDKGHealthQueryOptions = (
  operators: Pick<Operator, "id" | "dkg_address">[],
) => {
  return queryOptions({
    gcTime: 0,
    staleTime: ms(10, "seconds"),
    queryKey: ["operators-dkg-health", operators.map(({ id }) => id)],
    queryFn: async (): Promise<OperatorDKGHealthResponse[]> => {
      return await Promise.all(
        operators.map(async ({ id, dkg_address }) => {
          return {
            id,
            isHealthy: await checkOperatorDKGHealth(dkg_address)
              .then(Boolean)
              .catch(() => false),
          };
        }),
      );
    },
    enabled: operators.length > 0,
  });
};

type UseOperatorsDKGHealthOptions = QueryConfig<
  typeof getOperatorsDKGHealthQueryOptions
>;

export const useOperatorsDKGHealth = (
  operators: Pick<Operator, "id" | "dkg_address">[],
  options: UseOperatorsDKGHealthOptions = { enabled: true },
) => {
  const queryOptions = getOperatorsDKGHealthQueryOptions(operators);
  return useQuery({
    ...queryOptions,
    ...options,
    enabled: queryOptions.enabled && options?.enabled,
  });
};
