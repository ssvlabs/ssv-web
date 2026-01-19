import { SwitchWizardStepOne } from "@/components/wizard";
import { useClusterState } from "@/hooks/cluster/use-cluster-state";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useOperators } from "@/hooks/operator/use-operators";
import { useLocation, useNavigate } from "react-router-dom";

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

  const location = useLocation();
  const locationState = location.state as { from?: unknown } | null;
  const from =
    typeof locationState?.from === "string" ? locationState.from : undefined;
  const backTo = from ?? `/clusters/${clusterHash}`;

  return (
    <SwitchWizardStepOne
      onNext={() => {
        navigate(
          `${basePath}/step-one`,
          from ? { state: { from } } : undefined,
        );
      }}
      backButtonLabel="Back"
      navigateRoutePath={backTo}
      operators={operators}
    />
  );
};
