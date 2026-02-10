import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useLocation, useNavigate } from "react-router-dom";
import { parseEther } from "viem";
import { Loading } from "@/components/ui/Loading";
import { useClusterTotalEffectiveBalance } from "@/hooks/cluster/use-cluster-total-effective-balance";
import { MigrationEffectiveBalanceForm } from "@/components/effective-balance/migration-effective-balance-form";
import { useCluster } from "@/hooks/cluster/use-cluster";

export const SwitchWizardStepOneAndHalfRoute = () => {
  const { clusterHash } = useClusterPageParams();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = `/switch-wizard/${clusterHash}`;
  const locationState = location.state as { from?: unknown } | null;
  const from =
    typeof locationState?.from === "string" ? locationState.from : undefined;

  const cluster = useCluster(clusterHash!);

  const totalEffectiveBalance = useClusterTotalEffectiveBalance(clusterHash!);
  const maxEffectiveBalance = (cluster.data?.validatorCount ?? 0) * 2048;

  if (totalEffectiveBalance.isPending) {
    return <Loading />;
  }

  const handleNext = (effectiveBalance: bigint) => {
    // Convert from ETH to Wei
    const effectiveBalanceWei = parseEther(effectiveBalance.toString());
    navigate(`${basePath}/step-two`, {
      state: {
        effectiveBalance: effectiveBalanceWei,
        ...(from ? { from } : {}),
      },
    });
  };

  return (
    <MigrationEffectiveBalanceForm
      clusterHash={clusterHash!}
      totalEffectiveBalance={totalEffectiveBalance.data!}
      maxEffectiveBalance={maxEffectiveBalance}
      onNext={handleNext}
      backTo={basePath}
      backState={from ? { from } : undefined}
      showDetailedErrors
    />
  );
};
