import { SwitchWizardStepTwo } from "@/components/wizard";
import { useClusterState } from "@/hooks/cluster/use-cluster-state";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useOperators } from "@/hooks/operator/use-operators";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const SwitchWizardStepTwoRoute = () => {
  const navigate = useNavigate();
  const { clusterHash } = useClusterPageParams();
  const { cluster } = useClusterState(clusterHash!, {
    isLiquidated: { enabled: false },
    balance: { enabled: false },
  });
  const location = useLocation();
  const effectiveBalance = (
    location.state as { effectiveBalance?: number } | null
  )?.effectiveBalance;

  const operatorsQuery = useOperators(cluster.data?.operators ?? []);
  const operators = operatorsQuery.data ?? [];
  const basePath = `/switch-wizard/${clusterHash}`;

  useEffect(() => {
    if (effectiveBalance === undefined) {
      navigate(`${basePath}/step-one`, { replace: true });
    }
  }, [basePath, effectiveBalance, navigate]);

  return (
    <SwitchWizardStepTwo
      onNext={() => {
        navigate(`${basePath}/step-three`);
      }}
      backButtonLabel="Back"
      navigateRoutePath={`${basePath}/step-one`}
      operators={operators}
      validatorsAmount={cluster.data?.validatorCount ?? 1}
      effectiveBalance={effectiveBalance}
    />
  );
};
