import { SwitchWizardStepOne } from "@/components/wizard";
import { useClusterState } from "@/hooks/cluster/use-cluster-state";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useOperators } from "@/hooks/operator/use-operators";
import { useNavigate } from "react-router-dom";

export const SwitchWizardStepOneRoute = () => {
  const navigate = useNavigate();
  const { clusterHash } = useClusterPageParams();
  const { cluster } = useClusterState(clusterHash!, {
    isLiquidated: { enabled: false },
    balance: { enabled: false },
  });
  const operatorsQuery = useOperators(cluster.data?.operators ?? []);
  const operators = operatorsQuery.data ?? [];
  const basePath = `/switch-wizard/${clusterHash}`;

  return (
    <SwitchWizardStepOne
      onNext={() => {
        navigate(`${basePath}/step-one`);
      }}
      backButtonLabel="Back"
      operators={operators}
    />
  );
};
