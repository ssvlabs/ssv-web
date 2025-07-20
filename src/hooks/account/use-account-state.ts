import { useAccount } from "@/hooks/account/use-account";
import { getPaginatedAccountClustersQueryOptions } from "@/hooks/cluster/use-paginated-account-clusters";
import { useCreatedOptimisticOperators } from "@/hooks/operator/use-created-optimistic-operators";
import { getPaginatedAccountOperatorsQueryOptions } from "@/hooks/operator/use-paginated-account-operators";
import { useQuery } from "@tanstack/react-query";
import { useMyBAppAccount } from "@/hooks/b-app/use-my-b-app-account.ts";
import { useAppVersion } from "@/hooks/temp-delete-after-merge/use-app-version";

export const useAccountState = () => {
  const account = useAccount();

  const clusters = useQuery(
    getPaginatedAccountClustersQueryOptions(account.address),
  );

  const operators = useQuery(
    getPaginatedAccountOperatorsQueryOptions(account.address),
  );

  const myBAppAccount = useMyBAppAccount();

  const createdOptimisticOperators = useCreatedOptimisticOperators();

  const app = useAppVersion();

  const isLoading =
    clusters.isLoading || operators.isLoading || myBAppAccount.isLoading;

  const hasClusters = (clusters.data?.pagination.total ?? 0) > 0;
  const hasOperators =
    ((operators.data?.pagination.total ?? 0) ||
      (createdOptimisticOperators.data?.length ?? 0)) > 0;

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
      : app.isDvtOnly
        ? dvtRoutePath
        : "/account/my-delegations";

  return {
    isLoading,
    isLoadingClusters: clusters.isLoading,
    isLoadingOperators: operators.isLoading,
    isNewAccount,
    hasClusters,
    hasOperators,
    accountRoutePath,
    dvtRoutePath,
  };
};
