import { getOperatorQueryOptions } from "@/hooks/operator/use-operator";
import { getGetOperatorByIdQueryOptions } from "@/lib/contract-interactions/read/use-get-operator-by-id";
import { combineQueryStatus, queryClient } from "@/lib/react-query";
import type { Operator } from "@/types/api";
import type { OperatorID } from "@/types/types";
import { useQueries } from "@tanstack/react-query";

export const queryFetchOperators = async (operatorIds: OperatorID[]) => {
  return Promise.all(
    operatorIds.map((id) =>
      queryClient.fetchQuery(getOperatorQueryOptions(id)),
    ),
  );
};

export const useOperators = (operatorIds: OperatorID[]) => {
  return useQueries({
    queries: operatorIds.map((id) => getOperatorQueryOptions(id)),
    combine: (queries) => {
      const operators = queries.map((query) => query.data) as Operator[];
      const status = combineQueryStatus(...queries);
      return {
        data: status.isSuccess && !status.isError ? operators : undefined,
        ...status,
      };
    },
  });
};

export const useBlockchainOperators = (operatorIds: OperatorID[]) => {
  return useQueries({
    queries: operatorIds.map((id) =>
      getGetOperatorByIdQueryOptions({
        operatorId: BigInt(id),
      }),
    ),
    combine: (queries) => {
      const operators = queries.map((query) => {
        if (!query.data) return undefined;
        const [
          owner,
          fee,
          validatorCount,
          whitelistedAddress,
          isPrivate,
          isActive,
        ] = query.data;
        return {
          owner,
          fee,
          validatorCount,
          whitelistedAddress,
          isPrivate,
          isActive,
        };
      });
      const status = combineQueryStatus(...queries);
      return {
        data: status.isSuccess && !status.isError ? operators : undefined,
        ...status,
      };
    },
  });
};
