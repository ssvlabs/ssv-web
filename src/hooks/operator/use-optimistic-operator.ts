import { getOperatorQueryOptions } from "@/hooks/operator/use-operator";
import type { Operator } from "@/types/api";
import { useQueries, useQuery } from "@tanstack/react-query";

export const useOptimisticOrProvidedOperator = (operator: Operator) => {
  const optimisticOperator = useQuery({
    ...getOperatorQueryOptions(operator.id),
    enabled: false,
  });
  if (optimisticOperator.isStale) return operator;
  return optimisticOperator.data ?? operator;
};

export const useOptimisticOrProvidedOperators = (operators: Operator[]) => {
  const optimisticOperators = useQueries({
    queries: operators.map((operator) => ({
      ...getOperatorQueryOptions(operator.id),
      enabled: false,
    })),
  });

  return operators.map((operator, index) => {
    const optimisticOperator = optimisticOperators[index];
    if (optimisticOperator?.isStale) return operator;
    return optimisticOperator?.data ?? operator;
  });
};
