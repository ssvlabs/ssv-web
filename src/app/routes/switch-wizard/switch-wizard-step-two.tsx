import { SwitchWizardStepTwo } from "@/components/wizard";
import { useClusterState } from "@/hooks/cluster/use-cluster-state";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useClusterRunway } from "@/hooks/cluster/use-cluster-runway";
import { useOperators } from "@/hooks/operator/use-operators";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type {
  SwitchWizardStepThreeState,
  SwitchWizardStepTwoState,
} from "@/components/wizard/switch-wizard-types";

export const SwitchWizardStepTwoRoute = () => {
  const navigate = useNavigate();
  const { clusterHash } = useClusterPageParams();
  const { cluster, balanceSSV } = useClusterState(clusterHash!, {
    isLiquidated: { enabled: false },
    balance: { enabled: true },
  });
  const location = useLocation();
  const stepState = location.state as SwitchWizardStepTwoState | null;
  const effectiveBalance = stepState?.effectiveBalance;
  const from = typeof stepState?.from === "string" ? stepState.from : undefined;
  const { data: clusterRunway } = useClusterRunway(clusterHash);

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
      onNext={(nextState: SwitchWizardStepThreeState) => {
        const nextStateWithFrom = from ? { ...nextState, from } : nextState;
        navigate(`${basePath}/step-two-and-half`, {
          state: nextStateWithFrom,
        });
      }}
      backButtonLabel="Back"
      navigateRoutePath={`${basePath}/step-one`}
      navigateRouteOptions={from ? { state: { from } } : undefined}
      operators={operators}
      validatorsAmount={cluster.data?.validatorCount ?? 1}
      effectiveBalance={effectiveBalance}
      currentRunwayDays={Number(clusterRunway?.runway) || 0}
      ssvBalance={balanceSSV.data}
    />
  );
};
