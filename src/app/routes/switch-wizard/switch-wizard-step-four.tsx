import { SwitchWizardStepFour } from "@/components/wizard";
import { useClusterState } from "@/hooks/cluster/use-cluster-state";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useOperators } from "@/hooks/operator/use-operators";

export const SwitchWizardStepFourRoute = () => {
  const { clusterHash } = useClusterPageParams();
  const { cluster } = useClusterState(clusterHash!, {
    isLiquidated: { enabled: false },
    balance: { enabled: false },
  });
  const operatorsQuery = useOperators(cluster.data?.operators ?? []);
  const operators = operatorsQuery.data ?? [];
  const clusterPath = `/clusters/${clusterHash}`;

  return (
    <SwitchWizardStepFour
      clusterHash={clusterHash}
      operators={operators}
      clusterPath={clusterPath}
    />
  );
};
