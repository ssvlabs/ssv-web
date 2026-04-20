import { computeDailyAmount } from "@/lib/utils/keystore";
import type { Operator } from "@/types/api";
import { useRates } from "@/hooks/use-rates";
import { currencyFormatter, formatETH } from "@/lib/utils/number";
import { getOperatorEthFee } from "@/lib/utils/operator";
import { formatUnits } from "viem";
import type { SwitchWizardFundingSummary } from "@/components/wizard/switch-wizard-types";

type OperatorFeeDisplay = {
  operatorId: number;
  periodFee: bigint;
  periodFeeDisplay: string;
  periodFeeUsd: string;
};

type UseMigrationCalculationDataArgs = {
  operators: Operator[];
  fundingDays: number;
  effectiveBalance?: bigint;
  fundingSummary?: SwitchWizardFundingSummary;
  totalDeposit?: bigint;
  withdrawSsvBalance?: bigint;
};

/**
 * Hook for calculating and formatting all data needed in the migration flow.
 * Handles operator fees, funding summary, and display formatting.
 *
 * Operator fees are calculated per period (not yearly) for 32 ETH validator.
 * Multiplication by validator count happens in Funding Summary through Effective Balance.
 */
export const useMigrationCalculationData = ({
  operators,
  fundingDays,
  effectiveBalance,
  fundingSummary,
  totalDeposit,
  withdrawSsvBalance,
}: UseMigrationCalculationDataArgs) => {
  const rates = useRates();
  const ethRate = rates.data?.eth ?? 0;
  const ssvRate = rates.data?.ssv ?? 0;

  // Format helpers
  const formatEthDisplay = (value: bigint) => `${formatETH(value)} ETH`;
  const formatUsd = (value: bigint) =>
    `~${currencyFormatter.format(ethRate * +formatUnits(value, 18))}`;
  const formatEthValue = (value?: bigint) =>
    value !== undefined ? formatEthDisplay(value) : "-";

  // Calculate operator fees for the selected period (per 32 ETH validator)
  const operatorFees: OperatorFeeDisplay[] = operators.map((operator) => {
    const periodFee = computeDailyAmount(
      getOperatorEthFee(operator, true),
      fundingDays,
    );
    return {
      operatorId: operator.id,
      periodFee,
      periodFeeDisplay: formatEthDisplay(periodFee),
      periodFeeUsd: formatUsd(periodFee),
    };
  });

  // Effective Balance display
  const effectiveBalanceDisplay =
    effectiveBalance !== undefined ? formatEthDisplay(effectiveBalance) : "-";

  // Total deposit calculation
  const totalDepositFallback = fundingSummary
    ? fundingSummary.operatorsSubtotal +
      fundingSummary.networkSubtotal +
      fundingSummary.liquidationSubtotal
    : undefined;

  const totalDepositDisplay =
    totalDeposit !== undefined
      ? formatEthDisplay(totalDeposit)
      : formatEthValue(totalDepositFallback);

  const totalDepositUsd =
    totalDeposit !== undefined
      ? formatUsd(totalDeposit)
      : totalDepositFallback !== undefined
        ? formatUsd(totalDepositFallback)
        : "";

  // SSV withdrawal display
  const withdrawSsvDisplay =
    withdrawSsvBalance !== undefined
      ? `${formatETH(withdrawSsvBalance)} SSV`
      : "0 SSV";

  const withdrawSsvUsd =
    withdrawSsvBalance !== undefined
      ? `~${currencyFormatter.format(
          ssvRate * Number(formatUnits(withdrawSsvBalance, 18)),
        )}`
      : "";

  return {
    operatorFees,
    effectiveBalanceDisplay,
    totalDepositDisplay,
    totalDepositUsd,
    withdrawSsvDisplay,
    withdrawSsvUsd,
    formatEthValue,
    ethRate,
    ssvRate,
  };
};
