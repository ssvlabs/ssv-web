import { SwitchWizardStepTwo } from "@/components/wizard";
import { useClusterState } from "@/hooks/cluster/use-cluster-state";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useOperators } from "@/hooks/operator/use-operators";
import { useNavigate } from "react-router-dom";

export const SwitchWizardStepTwoRoute = () => {
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
    <SwitchWizardStepTwo
      onNext={() => {
        navigate(`${basePath}/step-three`);
      }}
      backButtonLabel="Back"
      navigateRoutePath={basePath}
      operators={operators}
      validatorsAmount={cluster.data?.validatorCount ?? 1}
    />
  );
};
