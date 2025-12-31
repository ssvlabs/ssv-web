import { SwitchWizardStepOneAndHalf } from "@/components/wizard";
import { useInfiniteClusterValidators } from "@/hooks/cluster/use-infinite-cluster-validators";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { ValidatorStatus } from "@/lib/utils/validator-status-mapping";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { formatUnits, parseEther } from "viem";

export const SwitchWizardStepOneAndHalfRoute = () => {
  const navigate = useNavigate();
  const { clusterHash } = useClusterPageParams();
  const basePath = `/switch-wizard/${clusterHash}`;
  const { validators } = useInfiniteClusterValidators(clusterHash);

  const validatorRows = useMemo(
    () =>
      validators.map(
        (validator) =>
          ({
            publicKey: validator.public_key,
            status:
              validator.displayedStatus === ValidatorStatus.NOT_DEPOSITED
                ? "Not Deposited"
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
      validatorRows.reduce((total, validator) => {
        if (validator.status === "Not Deposited") {
          return total + 32;
        }
        return total + Number(formatUnits(validator.effectiveBalance, 9));
      }, 0),
    [validatorRows],
  );

  return (
    <SwitchWizardStepOneAndHalf
      onNext={(effectiveBalance) => {
        navigate(`${basePath}/step-two`, {
          state: {
            effectiveBalance: parseEther(effectiveBalance.toString()),
          },
        });
      }}
      backButtonLabel="Back"
      navigateRoutePath={basePath}
      validators={validatorRows}
      totalEffectiveBalance={totalEffectiveBalance}
    />
  );
};
