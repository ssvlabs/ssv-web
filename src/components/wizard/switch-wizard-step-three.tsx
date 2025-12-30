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
import { currencyFormatter, ethFormatter } from "@/lib/utils/number";
import { formatUnits } from "viem";
import { useRates } from "@/hooks/use-rates";

type SwitchWizardStepThreeProps = {
  onNext: () => void;
  onBack?: () => void;
  backButtonLabel?: string;
  navigateRoutePath?: string;
  operators: Pick<Operator, "id" | "name" | "logo" | "eth_fee">[];
  fundingDays: number;
  totalDeposit?: number;
};

// Mock data - will be replaced with real calculations
const mockFundingSummary = {
  operatorsFee: "0.0416 ETH",
  networkFee: "0.0203 ETH",
  liquidationCollateral: "0.0015 ETH",
  effectiveBalance: "32 ETH",
  operatorsSubtotal: "1.3312 ETH",
  networkSubtotal: "0.6496 ETH",
  liquidationSubtotal: "0.0048 ETH",
  totalDeposit: "2.5502 ETH",
  totalDepositUSD: "~$3,444.78",
  withdrawSSV: "50 SSV",
  withdrawSSVUSD: "~$344.78",
};

export const SwitchWizardStepThree = ({
  onNext,
  onBack,
  backButtonLabel = "Back",
  navigateRoutePath,
  operators,
  fundingDays,
  totalDeposit,
}: SwitchWizardStepThreeProps) => {
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const rates = useRates();
  const ethRate = rates.data?.eth ?? 0;

  const formatETH = (value: bigint) =>
    `${ethFormatter.format(+formatUnits(value, 18))} ETH`;
  const formatUsd = (value: bigint) =>
    `~${currencyFormatter.format(ethRate * +formatUnits(value, 18))}`;

  const handleSubmit = () => {
    if (!isAcknowledged) return;
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
                  <Text variant="body-2-medium">{formatETH(yearlyEthFee)}</Text>
                  <Text variant="body-3-medium" className="text-gray-500">
                    {formatUsd(yearlyEthFee)} /year
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
              {mockFundingSummary.operatorsFee}
            </Text>
            <Text variant="body-2-medium" className="text-right">
              {mockFundingSummary.effectiveBalance}
            </Text>
            <Text variant="body-2-medium" className="text-right">
              {mockFundingSummary.operatorsSubtotal}
            </Text>

            <Text variant="body-2-medium">Network fee</Text>
            <Text variant="body-2-medium" className="text-right">
              {mockFundingSummary.networkFee}
            </Text>
            <Text variant="body-2-medium" className="text-right">
              {mockFundingSummary.effectiveBalance}
            </Text>
            <Text variant="body-2-medium" className="text-right">
              {mockFundingSummary.networkSubtotal}
            </Text>

            <div className="flex gap-2 items-center">
              <Text variant="body-2-medium">Liquidation collateral</Text>
              <Tooltip content="Liquidation collateral information">
                <FaCircleInfo className="size-3.5 text-gray-500" />
              </Tooltip>
            </div>
            <Text variant="body-2-medium" className="text-right">
              {mockFundingSummary.liquidationCollateral}
            </Text>
            <Text variant="body-2-medium" className="text-right">
              {mockFundingSummary.effectiveBalance}
            </Text>
            <Text variant="body-2-medium" className="text-right">
              {mockFundingSummary.liquidationSubtotal}
            </Text>
          </div>

          <Divider />

          <div className="flex items-start justify-between">
            <Text variant="body-2-medium">Total Deposit</Text>
            <div className="flex flex-col items-end">
              <Text variant="headline4">{totalDeposit ?? "-"}</Text>
              <Text variant="body-3-medium" className="text-gray-500">
                {totalDeposit ?? ""}
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
              <Text variant="headline4">{mockFundingSummary.withdrawSSV}</Text>
              <Text variant="body-3-medium" className="text-gray-500">
                {mockFundingSummary.withdrawSSVUSD}
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
            I acknowledge that switching this cluster to ETH-based payments is a
            permanent action and cannot be undone, and that all future operator
            and network fees will be paid exclusively in ETH.
          </Text>
        </div>

        <Button
          size="xl"
          width="full"
          onClick={handleSubmit}
          disabled={!isAcknowledged}
          className="font-semibold"
        >
          Switch Cluster to ETH
        </Button>
      </Card>
    </Container>
  );
};
