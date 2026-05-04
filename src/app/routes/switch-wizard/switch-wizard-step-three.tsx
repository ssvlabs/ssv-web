import { SwitchWizardStepThree } from "@/components/wizard";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterBalance } from "@/hooks/cluster/use-cluster-balance";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useOperators } from "@/hooks/operator/use-operators";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { SwitchWizardStepThreeState } from "@/components/wizard/switch-wizard-types";
import { useMigrateClusterToETH } from "@/lib/contract-interactions/hooks/setter";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { toSolidityCluster } from "@/lib/utils/cluster";
import { bigintifyNumbers } from "@/lib/utils/bigint";
import { getOperatorIds } from "@/lib/utils/operator";
import { getCluster } from "@/api/cluster";
import { retryPromiseUntilSuccess } from "@/lib/utils/promise";
import { queryClient } from "@/lib/react-query";
import { getClusterQueryOptions } from "@/hooks/cluster/use-cluster";

export const SwitchWizardStepThreeRoute = () => {
  const navigate = useNavigate();
  const { clusterHash } = useClusterPageParams();
  const cluster = useCluster(clusterHash!);
  const balance = useClusterBalance(clusterHash!);
  const migrate = useMigrateClusterToETH();
  const operatorsQuery = useOperators(cluster.data?.operators ?? []);
  const operators = operatorsQuery.data ?? [];
  const basePath = `/switch-wizard/${clusterHash}`;
  const location = useLocation();
  const stepState = location.state as SwitchWizardStepThreeState | null;
  const effectiveBalance = stepState?.effectiveBalance;
  const fundingDays = stepState?.fundingDays ?? 0;
  const fundingSummary = stepState?.fundingSummary;
  const totalDeposit = stepState?.totalDeposit;
  const hasRequiredState =
    typeof effectiveBalance === "bigint" && typeof fundingDays === "number";
  const canSubmit = Boolean(cluster.data && totalDeposit !== undefined);
  useEffect(() => {
    if (!hasRequiredState) {
      navigate(`${basePath}/step-two`, { replace: true });
    }
  }, [basePath, hasRequiredState, navigate]);

  return (
    <SwitchWizardStepThree
      onNext={() => {
        if (!cluster.data || totalDeposit === undefined) return;
        const wasSSVCluster = !cluster.data.migrated;
        migrate.write({
          args: {
            operatorIds: bigintifyNumbers(
              getOperatorIds(cluster.data?.operators ?? []),
            ),
            cluster: toSolidityCluster(cluster.data),
          },
          value: totalDeposit,
          options: withTransactionModal({
            variant: "2-step",
            onMined: async () => {
              // Wait until cluster is indexed and switched from SSV to ETH
              await retryPromiseUntilSuccess(() =>
                getCluster(clusterHash!)
                  .then(
                    (updatedCluster) =>
                      updatedCluster &&
                      wasSSVCluster &&
                      updatedCluster.migrated,
                  )
                  .catch(() => false),
              );

              // Refetch cluster data after migration
              await queryClient.refetchQueries({
                queryKey: getClusterQueryOptions(clusterHash!).queryKey,
              });

              return () => navigate(`${basePath}/step-four`);
            },
          }),
        });
      }}
      backButtonLabel="Back"
      navigateRoutePath={`${basePath}/step-two-and-half`}
      navigateRouteOptions={{
        replace: true,
        state: stepState ?? undefined,
      }}
      operators={operators}
      fundingDays={fundingDays}
      fundingSummary={fundingSummary}
      effectiveBalance={effectiveBalance}
      totalDeposit={totalDeposit}
      withdrawSsvBalance={balance.data}
      isSubmitting={migrate.isPending}
      isSubmitDisabled={!canSubmit}
    />
  );
};
