import { getOperators } from "@/api/operator";
import { queryClient, type QueryConfig } from "@/lib/react-query";
import { createDefaultOperator, sortOperators } from "@/lib/utils/operator";
import type { OperatorID } from "@/types/types";

import { queryOptions, useQuery } from "@tanstack/react-query";

export const operatorsQueryOptions = (operatorIds: OperatorID[]) => {
  const ids = operatorIds.map(Number);
  return queryOptions({
    queryKey: ["operators", ids],
    // `perPage: 20` is a safe upper bound: a cluster has at most 13 operators, so one page
    // always fits every ID in the cluster. This hook is only for resolving cluster operators—
    // use a paginated operators search hook for open-ended lists.
    queryFn: () =>
      getOperators({ id: ids, perPage: 20 }).then(({ operators }) =>
        sortOperators(
          ids.map(
            (id) =>
              operators.find((operator) => operator.id == id) ||
              // Operator not found, return removed operator
              createDefaultOperator({
                id: Number(id),
                is_deleted: true,
                status: "Removed",
              }),
          ),
        ),
      ),
  });
};

export const queryFetchOperators = async (operatorIds: OperatorID[]) => {
  return queryClient.fetchQuery(operatorsQueryOptions(operatorIds));
};

export const useOperators = (
  operatorIds: OperatorID[],
  options: QueryConfig<typeof operatorsQueryOptions> = {},
) => {
  return useQuery({
    ...operatorsQueryOptions(operatorIds),
    ...options,
  });
};
