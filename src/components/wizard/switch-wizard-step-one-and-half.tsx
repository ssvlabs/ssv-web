import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/grid-table";
import { CopyBtn } from "@/components/ui/copy-btn";
import { SsvExplorerBtn } from "@/components/ui/ssv-explorer-btn";
import { Tooltip } from "@/components/ui/tooltip";
import { ethFormatter, numberFormatter } from "@/lib/utils/number";
import { add0x, shortenAddress } from "@/lib/utils/strings";
import { FaCircleInfo } from "react-icons/fa6";
import { formatUnits } from "viem";

type ValidatorRow = {
  publicKey: string;
  status: "Deposited" | "Undeposited";
  effectiveBalance: bigint;
};

type SwitchWizardStepOneAndHalfProps = {
  onNext: () => void;
  onBack?: () => void;
  backButtonLabel?: string;
  navigateRoutePath?: string;
  validators?: ValidatorRow[];
  totalEffectiveBalance?: number;
};

const tabLabels = {
  all: "All",
  deposited: "Deposited",
  undeposited: "Undeposited",
} as const;

type TabKey = keyof typeof tabLabels;

export const SwitchWizardStepOneAndHalf = ({
  onNext,
  onBack,
  backButtonLabel = "Back",
  navigateRoutePath,
  validators = [],
  totalEffectiveBalance = 0,
}: SwitchWizardStepOneAndHalfProps) => {
  const [hasEdited, setHasEdited] = useState(false);
  const [balanceInput, setBalanceInput] = useState(() =>
    numberFormatter.format(totalEffectiveBalance),
  );
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TabKey>("all");

  const normalizedBalance = balanceInput.replace(/,/g, "");
  const numericBalance = normalizedBalance ? Number(normalizedBalance) : 0;

  useEffect(() => {
    if (!hasEdited) {
      setBalanceInput(numberFormatter.format(totalEffectiveBalance));
    }
  }, [hasEdited, totalEffectiveBalance]);

  const counts = useMemo(() => {
    const deposited = validators.filter(
      (validator) => validator.status === "Deposited",
    ).length;
    const undeposited = validators.filter(
      (validator) => validator.status === "Undeposited",
    ).length;
    return {
      all: validators.length,
      deposited,
      undeposited,
    };
  }, [validators]);

  const filteredValidators = useMemo(() => {
    if (selectedTab === "all") return validators;
    return validators.filter(
      (validator) =>
        validator.status.toLowerCase() === selectedTab.toLowerCase(),
    );
  }, [selectedTab, validators]);

  const handleBalanceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value.replace(/[^\d]/g, "");
    if (!nextValue) {
      setHasEdited(true);
      setBalanceInput("");
      return;
    }
    setHasEdited(true);
    setBalanceInput(numberFormatter.format(Number(nextValue)));
  };

  const formatEthBalance = (value: bigint) =>
    ethFormatter.format(Number(formatUnits(value, 9)));

  return (
    <Container
      variant="horizontal"
      size="xl"
      className="py-6"
      backButtonLabel={backButtonLabel}
      navigateRoutePath={navigateRoutePath}
      onBackButtonClick={onBack}
    >
      <Card
        variant="unstyled"
        className="flex-1 flex flex-col gap-6 p-8 bg-white rounded-2xl"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Text variant="headline4">Enter Total Effective Balance</Text>
            <Tooltip content="Total effective balance across all validators.">
              <FaCircleInfo className="size-3.5 text-gray-400" />
            </Tooltip>
          </div>
          <Text variant="body-2-medium" className="text-gray-600">
            To accurately estimate your cluster's fees and runway, please enter
            the total effective balance (in ETH) of all validators you are
            onboarding.
          </Text>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Text
              as="label"
              htmlFor="total-effective-balance"
              variant="body-3-semibold"
              className="text-gray-500"
            >
              Total Effective Balance
            </Text>
            <Tooltip content="Sum of validator effective balances in ETH.">
              <FaCircleInfo className="size-3 text-gray-400" />
            </Tooltip>
          </div>
          <Input
            id="total-effective-balance"
            value={balanceInput}
            onChange={handleBalanceChange}
            inputMode="numeric"
            className="h-[64px] border-primary-200 bg-white focus-within:border-primary-500"
            placeholder="0"
            rightSlot={
              <div className="flex items-center gap-2 pr-1 text-gray-500">
                <img
                  src="/images/networks/dark.svg"
                  alt="ETH"
                  className="size-4"
                />
                <Text variant="body-2-medium" className="text-gray-500">
                  ETH
                </Text>
              </div>
            }
            inputProps={{
              className:
                "text-2xl font-semibold text-gray-800 placeholder:text-gray-400",
            }}
          />
        </div>

        <Alert variant="warning" className="rounded-lg text-gray-700">
          <AlertDescription className="text-sm font-medium">
            Once onboarded, your validators' effective balance is continuously
            updated by network oracles. If the actual balance exceeds the value
            you enter, your fees will be higher than estimated, which could
            shorten your runway and put your cluster at risk of liquidation.
          </AlertDescription>
        </Alert>

        <div className="flex items-start gap-3">
          <Checkbox
            checked={isConfirmed}
            onCheckedChange={(checked) => setIsConfirmed(checked === true)}
            className="mt-0.5"
          />
          <Text variant="body-3-medium" className="text-gray-700">
            I confirm that the total projected balance is accurate, and I
            understand that an insufficient funding balance based on this amount
            could lead to my cluster being liquidated.
          </Text>
        </div>

        <Button
          size="xl"
          width="full"
          className="font-semibold"
          onClick={onNext}
          disabled={!isConfirmed || numericBalance <= 0}
        >
          Next
        </Button>
      </Card>

      <Card
        variant="unstyled"
        className="flex-1 flex min-h-0 flex-col gap-4 p-6 bg-white rounded-2xl"
      >
        <div className="flex items-center gap-2">
          <Text variant="headline4">Validator Breakdown</Text>
          <Tooltip content="Overview of validator statuses and balances.">
            <FaCircleInfo className="size-3.5 text-gray-400" />
          </Tooltip>
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={(value) => setSelectedTab(value as TabKey)}
        >
          <TabsList className="flex w-full [&>*]:flex-1">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Text variant="body-3-medium">{tabLabels.all}</Text>
              <Badge variant="primary" size="xs" className="rounded-md">
                {counts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="deposited" className="flex items-center gap-2">
              <Text variant="body-3-medium">{tabLabels.deposited}</Text>
              <Badge variant="success" size="xs" className="rounded-md">
                {counts.deposited}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="undeposited"
              className="flex items-center gap-2"
            >
              <Text variant="body-3-medium">{tabLabels.undeposited}</Text>
              <Badge variant="warning" size="xs" className="rounded-md">
                {counts.undeposited}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center justify-between rounded-lg border border-primary-200 bg-primary-50 px-4 py-3">
          <Text variant="body-3-medium" className="text-gray-600">
            Estimated Effective Balance
          </Text>
          <div className="flex items-center gap-2">
            <Text variant="body-2-semibold" className="text-gray-800">
              {numberFormatter.format(balanceInput ? numericBalance : 0)}
            </Text>
            <img src="/images/networks/dark.svg" alt="ETH" className="size-4" />
            <Text variant="body-3-medium" className="text-gray-500">
              ETH
            </Text>
          </div>
        </div>

        <Table
          gridTemplateColumns="minmax(200px, 1fr) 120px 140px"
          className="flex-1 min-h-0 max-h-[360px] bg-white"
        >
          <TableHeader className="sticky top-0 z-10 bg-gray-100">
            <TableCell>Public Key</TableCell>
            <TableCell>Status</TableCell>
            <TableCell className="justify-end">Effective Balance</TableCell>
          </TableHeader>
          {filteredValidators.map((validator) => {
            const isUndeposited = validator.status === "Undeposited";
            return (
              <TableRow key={validator.publicKey} className="bg-white">
                <TableCell className="flex items-center gap-2">
                  <Text variant="body-3-medium" className="text-gray-600">
                    {shortenAddress(add0x(validator.publicKey))}
                  </Text>
                  <CopyBtn text={validator.publicKey} />
                  <SsvExplorerBtn validatorId={validator.publicKey} />
                </TableCell>
                <TableCell>
                  <Badge
                    variant={isUndeposited ? "warning" : "success"}
                    size="xs"
                    className="rounded-md"
                  >
                    {validator.status}
                  </Badge>
                </TableCell>
                <TableCell className="flex items-center justify-end gap-1">
                  <Text
                    variant="body-3-medium"
                    className={
                      isUndeposited ? "text-warning-500" : "text-gray-800"
                    }
                  >
                    {formatEthBalance(validator.effectiveBalance)}
                  </Text>
                  <img
                    src="/images/networks/dark.svg"
                    alt="ETH"
                    className="size-3.5"
                  />
                  <Text
                    variant="body-3-medium"
                    className={
                      isUndeposited ? "text-warning-500" : "text-gray-500"
                    }
                  >
                    ETH
                  </Text>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      </Card>
    </Container>
  );
};

SwitchWizardStepOneAndHalf.displayName = "SwitchWizardStepOneAndHalf";
