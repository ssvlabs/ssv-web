import { useAccount } from "@/hooks/account/use-account";
import { getPaginatedAccountClustersQueryOptions } from "@/hooks/cluster/use-paginated-account-clusters";
import { getPaginatedAccountOperatorsQueryOptions } from "@/hooks/operator/use-paginated-account-operators";
import { useQuery } from "@tanstack/react-query";

export const useIsNewAccount = () => {
  const account = useAccount();

  const clusters = useQuery(
    getPaginatedAccountClustersQueryOptions(account.address),
  );

  const operators = useQuery(
    getPaginatedAccountOperatorsQueryOptions(account.address),
  );

  const isLoading = clusters.isLoading || operators.isLoading;

  const hasClusters = (clusters.data?.pagination.total ?? 0) > 0;
  const hasOperators = (operators.data?.pagination.total ?? 0) > 0;

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
    isLoadingClusters: clusters.isLoading,
    isLoadingOperators: operators.isLoading,
    isNewAccount,
    hasClusters,
    hasOperators,
    accountRoutePath,
  };
};
