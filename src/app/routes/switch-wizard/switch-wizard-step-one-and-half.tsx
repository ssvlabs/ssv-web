import { SwitchWizardStepOneAndHalf } from "@/components/wizard";
import { useInfiniteClusterValidators } from "@/hooks/cluster/use-infinite-cluster-validators";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { ValidatorStatus } from "@/lib/utils/validator-status-mapping";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { formatUnits } from "viem";

export const SwitchWizardStepOneAndHalfRoute = () => {
  const navigate = useNavigate();
  const { clusterHash } = useClusterPageParams();
  const basePath = `/switch-wizard/${clusterHash}`;
  const { validators } = useInfiniteClusterValidators(clusterHash);
  console.log(validators);

  const validatorRows = useMemo(
    () =>
      validators.map(
        (validator) =>
          ({
            publicKey: validator.public_key,
            status:
              validator.displayedStatus === ValidatorStatus.NOT_DEPOSITED
                ? "Undeposited"
                : "Deposited",
            effectiveBalance: BigInt(
              validator.validator_info?.effective_balance ?? 0,
            ),
          }) as const,
      ),
    [validators],
  );

  const totalEffectiveBalance = useMemo(
    () =>
      Number(
        formatUnits(
          validatorRows.reduce(
            (total, validator) => total + validator.effectiveBalance,
            0n,
          ),
          9,
        ),
      ),
    [validatorRows],
  );

  return (
    <SwitchWizardStepOneAndHalf
      onNext={() => {
        navigate(`${basePath}/step-two`);
      }}
      backButtonLabel="Back"
      navigateRoutePath={basePath}
      validators={validatorRows}
      totalEffectiveBalance={totalEffectiveBalance}
    />
  );
};
