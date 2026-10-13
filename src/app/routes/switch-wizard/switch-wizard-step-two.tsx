import { SwitchWizardStepTwo } from "@/components/wizard";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterBalance } from "@/hooks/cluster/use-cluster-balance";
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
  const cluster = useCluster(clusterHash!);
  const balance = useClusterBalance(clusterHash!);
  const location = useLocation();
  const stepState = location.state as SwitchWizardStepTwoState | null;
  const effectiveBalance = stepState?.effectiveBalance;
  const from = typeof stepState?.from === "string" ? stepState.from : undefined;
  const clusterRunway = useClusterRunway(clusterHash);
  // The runway is computed from defaulted inputs until its reads resolve, so
  // it must not seed the "current runway" funding period before then.
  // Idle means the cluster isn't there to read, which never resolves on its
  // own: show it as unavailable rather than an endless skeleton.
  const currentRunwayStatus =
    clusterRunway.isUnavailable || clusterRunway.isIdle
      ? "unavailable"
      : clusterRunway.isPending
        ? "pending"
        : "ready";

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
      currentRunwayDays={
        currentRunwayStatus === "ready"
          ? Number(clusterRunway.data.runway) || 0
          : undefined
      }
      currentRunwayStatus={currentRunwayStatus}
      ssvBalance={balance.data}
    />
  );
};
