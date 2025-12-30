import { SwitchWizardStepThree } from "@/components/wizard";
import { useClusterState } from "@/hooks/cluster/use-cluster-state";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useOperators } from "@/hooks/operator/use-operators";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useClusterRunway } from "@/hooks/cluster/use-cluster-runway.ts";

export const SwitchWizardStepThreeRoute = () => {
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
  const totalDeposit = (location.state as { totalDeposit?: number } | null)
    ?.totalDeposit;

  const { data: clusterRunway } = useClusterRunway(clusterHash);
  useEffect(() => {
    if (totalDeposit === undefined) {
      navigate(`${basePath}/step-two`, { replace: true });
    }
  }, [basePath, navigate, totalDeposit]);

  return (
    <SwitchWizardStepThree
      onNext={() => {
        navigate(`${basePath}/step-four`);
      }}
      backButtonLabel="Back"
      navigateRoutePath={`${basePath}/step-two`}
      operators={operators}
      fundingDays={Number(clusterRunway?.runway) || 0}
      totalDeposit={totalDeposit}
    />
  );
};
