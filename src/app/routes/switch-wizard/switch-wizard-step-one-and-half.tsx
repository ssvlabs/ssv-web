import { useInfiniteClusterValidators } from "@/hooks/cluster/use-infinite-cluster-validators";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { ValidatorStatus } from "@/lib/utils/validator-status-mapping";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { formatUnits, parseEther } from "viem";
import { EffectiveBalanceForm } from "@/components/effective-balance/effective-balance-form";
import { ethFormatter } from "@/lib/utils/number";

export const SwitchWizardStepOneAndHalfRoute = () => {
  const navigate = useNavigate();
  const { clusterHash } = useClusterPageParams();
  const basePath = `/switch-wizard/${clusterHash}`;
  const { validators } = useInfiniteClusterValidators(clusterHash);

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

  const handleNext = (effectiveBalance: bigint) => {
    // Convert from ETH to Wei
    const effectiveBalanceWei = parseEther(effectiveBalance.toString());
    navigate(`${basePath}/step-two`, {
      state: {
        effectiveBalance: effectiveBalanceWei,
      },
    });
  };

  const formatBalance = (balance: number) => {
    return ethFormatter.format(balance);
  };

  return (
    <EffectiveBalanceForm
      validators={validatorRows}
      onNext={handleNext}
      backTo={basePath}
      formatBalance={formatBalance}
      showDetailedErrors
    />
  );
};
