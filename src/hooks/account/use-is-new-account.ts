import { useAccount } from "@/hooks/account/use-account";
import { getPaginatedAccountClustersQueryOptions } from "@/hooks/cluster/use-paginated-account-clusters";
import { getPaginatedAccountOperatorsQueryOptions } from "@/hooks/operator/use-paginated-account-operators";
import { queryClient } from "@/lib/react-query";

import { useIsFetching } from "@tanstack/react-query";

export const useIsNewAccount = () => {
  const { address } = useAccount();

  const clusters = queryClient.getQueryData(
    getPaginatedAccountClustersQueryOptions(address).queryKey,
  );

  const operators = queryClient.getQueryData(
    getPaginatedAccountOperatorsQueryOptions(address).queryKey,
  );

  const isLoadingClusters =
    useIsFetching({
      exact: false,
      queryKey: ["paginated-account-clusters", address],
    }) && !clusters;

  const isLoadingOperators =
    useIsFetching({
      exact: false,
      queryKey: ["paginated-account-operators", address],
    }) && !operators;

  const isLoading = isLoadingClusters || isLoadingOperators;

  const hasClusters = (clusters?.pagination.total ?? 0) > 0;
  const hasOperators = (operators?.pagination.total ?? 0) > 0;

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
    isLoadingClusters,
    isLoadingOperators,
    isNewAccount,
    clusters,
    operators,
    hasClusters,
    hasOperators,
    accountRoutePath,
  };
};
