import { useState } from "react";
import { OperatorDetails } from "@/components/operator/operator-details";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Text } from "@/components/ui/text";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip } from "@/components/ui/tooltip";
import { FaCircleInfo } from "react-icons/fa6";
import type { Operator } from "@/types/api";
import { getYearlyFee } from "@/lib/utils/operator";
import { currencyFormatter, ethFormatter, formatSSV } from "@/lib/utils/number";
import { formatUnits } from "viem";
import { useRates } from "@/hooks/use-rates";
import type { SwitchWizardFundingSummary } from "./switch-wizard-types";

type SwitchWizardStepThreeProps = {
  onNext: () => void;
  onBack?: () => void;
  backButtonLabel?: string;
  navigateRoutePath?: string;
  operators: Pick<Operator, "id" | "name" | "logo" | "eth_fee">[];
  fundingDays: number;
  totalDeposit?: bigint;
  effectiveBalance?: bigint;
  fundingSummary?: SwitchWizardFundingSummary;
  validatorsAmount?: number;
  withdrawSsvBalance?: bigint;
  isSubmitting?: boolean;
  isSubmitDisabled?: boolean;
};

export const SwitchWizardStepThree = ({
  onNext,
  onBack,
  backButtonLabel = "Back",
  navigateRoutePath,
  operators,
  fundingDays,
  totalDeposit,
  effectiveBalance,
  fundingSummary,
  validatorsAmount,
  withdrawSsvBalance,
  isSubmitting = false,
  isSubmitDisabled = false,
}: SwitchWizardStepThreeProps) => {
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const rates = useRates();
  const ethRate = rates.data?.eth ?? 0;
  const ssvRate = rates.data?.ssv ?? 0;
  const validatorsCount = validatorsAmount ?? 1;
  const isMultiValidator = validatorsCount > 1;

  const formatETH = (value: bigint) =>
    `${ethFormatter.format(+formatUnits(value, 18))} ETH`;
  const formatUsd = (value: bigint) =>
    `~${currencyFormatter.format(ethRate * +formatUnits(value, 18))}`;
  const formatEthValue = (value?: bigint) =>
    value !== undefined ? formatETH(value) : "-";

  const effectiveBalanceDisplay =
    effectiveBalance !== undefined ? formatETH(effectiveBalance) : "-";
  const totalDepositFallback = fundingSummary
    ? fundingSummary.operatorsSubtotal +
      fundingSummary.networkSubtotal +
      fundingSummary.liquidationSubtotal
    : undefined;
  const withdrawSsvDisplay =
    withdrawSsvBalance !== undefined
      ? `${formatSSV(withdrawSsvBalance)} SSV`
      : "0 SSV";
  const withdrawSsvUsd =
    withdrawSsvBalance !== undefined
      ? `~${currencyFormatter.format(
          ssvRate * Number(formatUnits(withdrawSsvBalance, 18)),
        )}`
      : "";

  const handleSubmit = () => {
    if (!isAcknowledged || isSubmitting || isSubmitDisabled) return;
    onNext();
  };

  return (
    <Container
      variant="vertical"
      className="py-6"
      backButtonLabel={backButtonLabel}
      navigateRoutePath={navigateRoutePath}
      onBackButtonClick={onBack}
    >
      <Card
        variant="unstyled"
        className="w-full flex flex-col gap-5 p-8 bg-white rounded-2xl"
      >
        <div className="flex justify-between w-full">
          <Text variant="headline4">Transaction Details</Text>
        </div>

        <div className="space-y-2">
          <Text variant="body-3-semibold" className="text-gray-500">
            Selected Operators
          </Text>
          {operators.map((operator) => {
            const yearlyEthFee = getYearlyFee(BigInt(operator.eth_fee || "0"));
            const yearlyEthFeeDisplay = isMultiValidator
              ? yearlyEthFee * BigInt(validatorsCount)
              : yearlyEthFee;
            const yearlyFeeSuffix = isMultiValidator
              ? ` (total for ${validatorsCount} validators)`
              : "";

            return (
              <div
                className="flex justify-between items-center"
                key={operator.id}
              >
                <OperatorDetails
                  operator={operator}
                  isShowExplorerLink={false}
                />
                <div className="text-end space-y-1">
                  <Text variant="body-2-medium">
                    {formatETH(yearlyEthFeeDisplay)}
                  </Text>
                  <Text variant="body-3-medium" className="text-gray-500">
                    {formatUsd(yearlyEthFeeDisplay)} /year{yearlyFeeSuffix}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>

        <Divider />

        {/* Funding Summary */}
        <div className="flex flex-col gap-2">
          <div
            className="grid gap-2 gap-x-8"
            style={{ gridTemplateColumns: "1fr auto auto auto" }}
          >
            <Text variant="body-3-semibold" className="text-gray-500">
              Funding Summary
            </Text>
            <Text
              variant="body-3-semibold"
              className="text-gray-500 text-right"
            >
              Fee ({fundingDays} Days)
            </Text>
            <Text
              variant="body-3-semibold"
              className="text-gray-500 text-right"
            >
              Effective Balance
            </Text>
            <Text
              variant="body-3-semibold"
              className="text-gray-500 text-right"
            >
              Subtotal
            </Text>

            <Text variant="body-2-medium">Operators fee</Text>
            <Text variant="body-2-medium" className="text-right">
              {formatEthValue(fundingSummary?.operatorsPerEth)}
            </Text>
            <Text variant="body-2-medium" className="text-right">
              {effectiveBalanceDisplay}
            </Text>
            <Text variant="body-2-medium" className="text-right">
              {formatEthValue(fundingSummary?.operatorsSubtotal)}
            </Text>

            <Text variant="body-2-medium">Network fee</Text>
            <Text variant="body-2-medium" className="text-right">
              {formatEthValue(fundingSummary?.networkPerEth)}
            </Text>
            <Text variant="body-2-medium" className="text-right">
              {effectiveBalanceDisplay}
            </Text>
            <Text variant="body-2-medium" className="text-right">
              {formatEthValue(fundingSummary?.networkSubtotal)}
            </Text>

            <div className="flex gap-2 items-center">
              <Text variant="body-2-medium">Liquidation collateral</Text>
              <Tooltip content="Liquidation collateral information">
                <FaCircleInfo className="size-3.5 text-gray-500" />
              </Tooltip>
            </div>
            <Text variant="body-2-medium" className="text-right">
              {formatEthValue(fundingSummary?.liquidationPerEth)}
            </Text>
            <Text variant="body-2-medium" className="text-right">
              {effectiveBalanceDisplay}
            </Text>
            <Text variant="body-2-medium" className="text-right">
              {formatEthValue(fundingSummary?.liquidationSubtotal)}
            </Text>
          </div>

          <Divider />

          <div className="flex items-start justify-between">
            <Text variant="body-2-medium">Total Deposit</Text>
            <div className="flex flex-col items-end">
              <Text variant="headline4">
                {totalDeposit !== undefined
                  ? formatETH(totalDeposit)
                  : formatEthValue(totalDepositFallback)}
              </Text>
              <Text variant="body-3-medium" className="text-gray-500">
                {totalDeposit !== undefined
                  ? formatUsd(totalDeposit)
                  : totalDepositFallback !== undefined
                    ? formatUsd(totalDepositFallback)
                    : ""}
              </Text>
            </div>
          </div>

          <Divider />

          <div className="flex items-start justify-between">
            <div className="flex gap-2 items-center">
              <Text variant="body-2-medium">Withdraw SSV</Text>
              <Tooltip content="SSV withdrawal information">
                <FaCircleInfo className="size-3.5 text-gray-500" />
              </Tooltip>
            </div>
            <div className="flex flex-col items-end">
              <Text variant="headline4">{withdrawSsvDisplay}</Text>
              <Text variant="body-3-medium" className="text-gray-500">
                {withdrawSsvUsd}
              </Text>
            </div>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <Checkbox
            checked={isAcknowledged}
            onCheckedChange={(checked) => setIsAcknowledged(checked === true)}
            className="mt-0.5"
          />
          <Text variant="body-3-medium" className="text-gray-700 flex-1">
            By checking this box, I acknowledge and agree that after my first
            ETH deposit, my cluster runway will be calculated in ETH only, my
            SSV balance will be withdrawn to my wallet, and this process is
            irreversible.
          </Text>
        </div>

        <Button
          size="xl"
          width="full"
          onClick={handleSubmit}
          disabled={!isAcknowledged || isSubmitting || isSubmitDisabled}
          isLoading={isSubmitting}
          className="font-semibold"
        >
          Switch Cluster to ETH
        </Button>
      </Card>
    </Container>
  );
};
