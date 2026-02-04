import { useInfiniteClusterValidators } from "@/hooks/cluster/use-infinite-cluster-validators";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { ValidatorStatus } from "@/lib/utils/validator-status-mapping";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatUnits, parseEther } from "viem";
import { EffectiveBalanceForm } from "@/components/effective-balance/effective-balance-form";
import { Loading } from "@/components/ui/Loading";

export const SwitchWizardStepOneAndHalfRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clusterHash } = useClusterPageParams();
  const basePath = `/switch-wizard/${clusterHash}`;
  const { validators, infiniteQuery } = useInfiniteClusterValidators(
    clusterHash,
    1000,
  );
  const { fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    infiniteQuery;

  const locationState = location.state as { from?: unknown } | null;
  const from =
    typeof locationState?.from === "string" ? locationState.from : undefined;

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const validatorRows = useMemo(
    () =>
      validators.map((validator) => {
        const effectiveBalanceBigInt = BigInt(
          validator.validator_info?.effective_balance ?? 0,
        );
        return {
          publicKey: validator.public_key,
          status:
            validator.displayedStatus === ValidatorStatus.NOT_DEPOSITED
              ? ("Not Deposited" as const)
              : ("Deposited" as const),
          effectiveBalance:
            validator.displayedStatus === ValidatorStatus.NOT_DEPOSITED
              ? 32
              : Number(formatUnits(effectiveBalanceBigInt, 9)),
        };
      }),
    [validators],
  );

  if (isPending || isFetchingNextPage || hasNextPage) {
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
    <EffectiveBalanceForm
      clusterHash={clusterHash}
      validators={validatorRows}
      onNext={handleNext}
      backTo={basePath}
      backState={from ? { from } : undefined}
      showDetailedErrors
    />
  );
};
