import { useAccount } from "@/hooks/account/use-account";
import { useAccountStats } from "@/hooks/account/use-account-stats";
import { useCreatedOptimisticOperators } from "@/hooks/operator/use-created-optimistic-operators";

export const useAccountState = () => {
  const account = useAccount();

  const stats = useAccountStats();
  const isLoading = stats.isLoading;

  const createdOptimisticOperators = useCreatedOptimisticOperators();

  const hasClusters = stats.data?.clusters ?? 0 > 0;
  const hasOperators =
    (stats.data?.operators ?? 0) > 0 ||
    (createdOptimisticOperators.data?.length ?? 0) > 0;

  const isNewAccount = isLoading ? false : !hasClusters && !hasOperators;

  const dvtRoutePath = isNewAccount
    ? "/join"
    : hasClusters
      ? "/clusters"
      : "/operators";

  const accountRoutePath = account.isDisconnected
    ? "/connect"
    : isLoading
      ? undefined
      : dvtRoutePath;

  return {
    isLoading,
    isLoadingClusters: isLoading,
    isLoadingOperators: isLoading,
    isNewAccount,
    hasClusters,
    hasOperators,
    accountRoutePath,
    dvtRoutePath,
  };
};
