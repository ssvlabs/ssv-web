import { SwitchWizardStepTwoAndHalf } from "@/components/wizard";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { SwitchWizardStepThreeState } from "@/components/wizard/switch-wizard-types";

export const SwitchWizardStepTwoAndHalfRoute = () => {
  const navigate = useNavigate();
  const { clusterHash } = useClusterPageParams();
  const basePath = `/switch-wizard/${clusterHash}`;
  const location = useLocation();
  const stepState = location.state as SwitchWizardStepThreeState | null;
  const hasRequiredState =
    typeof stepState?.effectiveBalance === "bigint" &&
    typeof stepState?.fundingDays === "number";

  useEffect(() => {
    if (!hasRequiredState) {
      navigate(`${basePath}/step-two`, { replace: true });
    }
  }, [basePath, hasRequiredState, navigate]);

  return (
    <SwitchWizardStepTwoAndHalf
      onNext={() => {
        if (!stepState) return;
        navigate(`${basePath}/step-three`, { state: stepState });
      }}
      backButtonLabel="Back"
      navigateRoutePath={`${basePath}/step-two`}
    />
  );
};
