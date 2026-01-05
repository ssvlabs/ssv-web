import { useId, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { BigNumberInput } from "@/components/ui/number-input";
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
import { Form } from "@/components/ui/form";
import { ethFormatter, numberFormatter } from "@/lib/utils/number";
import { add0x, shortenAddress } from "@/lib/utils/strings";
import { FaCircleInfo } from "react-icons/fa6";
import { formatUnits } from "viem";

type ValidatorRow = {
  publicKey: string;
  status: "Deposited" | "Not Deposited";
  effectiveBalance: bigint;
};

type SwitchWizardStepOneAndHalfProps = {
  onNext: (effectiveBalance: number) => void;
  onBack?: () => void;
  backButtonLabel?: string;
  navigateRoutePath?: string;
  validators?: ValidatorRow[];
  totalEffectiveBalance?: number;
};

const tabLabels = {
  all: "All",
  deposited: "Deposited",
  notDeposited: "Not Deposited",
} as const;

type TabKey = keyof typeof tabLabels;

const createSchema = (
  validators: ValidatorRow[],
  totalEffectiveBalance: number,
) => {
  const minBalance = Math.max(totalEffectiveBalance, validators.length * 32);
  const maxBalance = validators.length * 2048;

  return z.object({
    totalEffectiveBalance: z
      .number()
      .positive({ message: "Balance must be greater than 0" })
      .min(minBalance, {
        message: `Balance must be at least ${minBalance} ETH`,
      })
      .max(maxBalance, {
        message: `Balance cannot exceed ${maxBalance} ETH (max EB per validator)`,
      }),
  });
};

export const SwitchWizardStepOneAndHalf = ({
  onNext,
  onBack,
  backButtonLabel = "Back",
  navigateRoutePath,
  validators = [],
  totalEffectiveBalance = 0,
}: SwitchWizardStepOneAndHalfProps) => {
  const schema = useMemo(
    () => createSchema(validators, totalEffectiveBalance),
    [validators, totalEffectiveBalance],
  );

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      totalEffectiveBalance: 0,
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const isFormValid = useMemo(
    () =>
      Object.keys(form.formState.errors).length === 0 && form.formState.isDirty,
    [form.formState.errors, form.formState.isDirty],
  );

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TabKey>("all");
  const confirmId = useId();

  const balanceValue = form.watch("totalEffectiveBalance");
  const numericBalance = Number(balanceValue);

  const counts = useMemo(() => {
    const deposited = validators.filter(
      (validator) => validator.status === "Deposited",
    ).length;
    const notDeposited = validators.filter(
      (validator) => validator.status === "Not Deposited",
    ).length;
    return {
      all: validators.length,
      deposited,
      notDeposited,
    };
  }, [validators]);

  const filteredValidators = useMemo(() => {
    if (selectedTab === "all") return validators;
    if (selectedTab === "deposited") {
      return validators.filter((validator) => validator.status === "Deposited");
    }
    return validators.filter(
      (validator) => validator.status === "Not Deposited",
    );
  }, [selectedTab, validators]);

  const formatEthBalance = (value: bigint) =>
    ethFormatter.format(Number(formatUnits(value, 9)));

  const estimatedEffectiveBalance = Math.max(
    totalEffectiveBalance,
    validators.length * 32,
  );
  const minBalance = estimatedEffectiveBalance;
  const maxBalance = validators.length * 2048;
  const isLowBalance =
    numericBalance > 0 && minBalance > 0 && numericBalance < minBalance;
  const isHighBalance = maxBalance > 0 && numericBalance > maxBalance;

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
            <Text variant="headline4">Cluster Total Effective Balance</Text>
            <Tooltip content="Total effective balance across all validators.">
              <FaCircleInfo className="size-3.5 text-gray-400" />
            </Tooltip>
          </div>
          <Text variant="body-2-medium" className="text-gray-600">
            In order for us to properly calculate the cluster runway, we need
            your estimated Total Effective Balance (ETH) for the registered
            validators. Using this figure, we will accurately calculate the
            operational fees, liquidation collateral, and the Network fee.
          </Text>
        </div>

        <Form {...form}>
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
            <BigNumberInput
              id="total-effective-balance"
              value={BigInt(balanceValue)}
              onChange={(value) => {
                form.setValue("totalEffectiveBalance", Number(value), {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
                form.trigger();
              }}
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
              decimals={0}
              displayDecimals={0}
            />
          </div>
        </Form>

        {isLowBalance && (
          <Alert variant="error" className="rounded-lg">
            <AlertDescription className="text-sm font-medium">
              The entered total projected balance is lower than our estimation (
              {numberFormatter.format(minBalance)} ETH). This may lead to an
              insufficient runway. Please double-check the balance entered.
            </AlertDescription>
          </Alert>
        )}

        {isHighBalance && (
          <Alert variant="error" className="rounded-lg">
            <AlertDescription className="text-sm font-medium">
              The entered total projected balance is higher than the max EB per
              validator ({numberFormatter.format(maxBalance)} ETH). Please
              double-check the balance entered.
            </AlertDescription>
          </Alert>
        )}

        <Alert variant="warning" className="rounded-lg text-gray-700">
          <AlertDescription className="text-sm font-medium">
            <span className="font-semibold">Cluster Liquidation Warning</span>
            <br />
            If the actual Effective Balance reported by Oracles is higher than
            the amount set here, your operational burn rate will increase. This
            risks an insufficient runway and possible cluster liquidation.
          </AlertDescription>
        </Alert>

        <label
          htmlFor={confirmId}
          className="flex items-start gap-3 cursor-pointer"
        >
          <Checkbox
            id={confirmId}
            checked={isConfirmed}
            onCheckedChange={(checked) => setIsConfirmed(checked === true)}
            className="mt-0.5"
          />
          <Text as="span" variant="body-3-medium" className="text-gray-700">
            I confirm that the total projected balance is accurate, and I
            understand that an insufficient funding balance based on this amount
            could lead to my cluster being liquidated.
          </Text>
        </label>

        <Button
          size="xl"
          width="full"
          className="font-semibold"
          onClick={() => onNext(numericBalance)}
          disabled={!isConfirmed || !isFormValid}
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
              value="notDeposited"
              className="flex items-center gap-2"
            >
              <Text variant="body-3-medium">{tabLabels.notDeposited}</Text>
              <Badge variant="warning" size="xs" className="rounded-md">
                {counts.notDeposited}
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
              {numberFormatter.format(estimatedEffectiveBalance)}
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
            const isNotDeposited = validator.status === "Not Deposited";
            const displayBalance = isNotDeposited
              ? ethFormatter.format(32)
              : formatEthBalance(validator.effectiveBalance);
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
                    variant={isNotDeposited ? "warning" : "success"}
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
                      isNotDeposited ? "text-warning-500" : "text-gray-800"
                    }
                  >
                    {displayBalance}
                  </Text>
                  <img
                    src="/images/networks/dark.svg"
                    alt="ETH"
                    className="size-3.5"
                  />
                  <Text
                    variant="body-3-medium"
                    className={
                      isNotDeposited ? "text-warning-500" : "text-gray-500"
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
