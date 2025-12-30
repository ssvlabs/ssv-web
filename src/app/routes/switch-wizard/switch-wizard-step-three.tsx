import { SwitchWizardStepThree } from "@/components/wizard";
import { useClusterState } from "@/hooks/cluster/use-cluster-state";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useOperators } from "@/hooks/operator/use-operators";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { SwitchWizardStepThreeState } from "@/components/wizard/switch-wizard-types";

export const SwitchWizardStepThreeRoute = () => {
  const navigate = useNavigate();
  const { clusterHash } = useClusterPageParams();
  const { cluster, balanceSSV } = useClusterState(clusterHash!, {
    isLiquidated: { enabled: false },
  });
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
    typeof effectiveBalance === "number" && typeof fundingDays === "number";
  useEffect(() => {
    if (!hasRequiredState) {
      navigate(`${basePath}/step-two`, { replace: true });
    }
  }, [basePath, hasRequiredState, navigate]);

  return (
    <SwitchWizardStepThree
      onNext={() => {
        navigate(`${basePath}/step-four`);
      }}
      backButtonLabel="Back"
      navigateRoutePath={`${basePath}/step-two`}
      operators={operators}
      fundingDays={fundingDays}
      fundingSummary={fundingSummary}
      effectiveBalance={effectiveBalance}
      totalDeposit={totalDeposit}
      validatorsAmount={cluster.data?.validatorCount ?? 1}
      withdrawSsvBalance={balanceSSV.data}
    />
  );
};
