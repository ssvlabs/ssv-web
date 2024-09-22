import { usePaginatedAccountClusters } from "@/hooks/cluster/use-paginated-account-clusters";
import { usePaginatedAccountOperators } from "@/hooks/operator/use-paginated-account-operators";

export const useIsNewAccount = () => {
  const clusters = usePaginatedAccountClusters();
  const operators = usePaginatedAccountOperators();

  const isLoading = clusters.query.isLoading || operators.query.isLoading;

  const hasClusters = (clusters.pagination.total ?? 0) > 0;
  const hasOperators = (operators.pagination.total ?? 0) > 0;

  const isNewAccount = isLoading ? false : !hasClusters && !hasOperators;

  const accountRoutePath = isLoading
    ? undefined
    : isNewAccount
      ? "/join"
      : hasClusters
        ? "/clusters"
        : "/operators";

  return {
    isLoading,
    isNewAccount,
    clusters,
    operators,
    hasClusters,
    hasOperators,
    accountRoutePath,
  };
};
