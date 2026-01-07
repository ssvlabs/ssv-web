import { Container } from "@/components/ui/container.tsx";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Text } from "@/components/ui/text.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { useEffect, useMemo, useState } from "react";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/grid-table";
import { CopyBtn } from "@/components/ui/copy-btn";
import { SsvExplorerBtn } from "@/components/ui/ssv-explorer-btn";
import { add0x, shortenAddress } from "@/lib/utils/strings";
import { Badge } from "@/components/ui/badge";
import { BigNumberInput } from "@/components/ui/number-input";
import { Tooltip } from "@/components/ui/tooltip";
import { FaCircleInfo } from "react-icons/fa6";
import { getValidatorsEffectiveBalance } from "@/api/validators";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { numberFormatter } from "@/lib/utils/number";
import { globals } from "@/config";

const EffectiveValidatorsBalance = () => {
  const navigate = useNavigate();
  const { state } = useRegisterValidatorContext;
  const { shares, effectiveBalance: savedEffectiveBalance } =
    useRegisterValidatorContext();

  const validatorCount = useMemo(() => shares.length, [shares]);

  const [validatorBalances, setValidatorBalances] = useState<
    Record<string, number>
  >({});
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);

  const estimatedTotalBalance = useMemo(() => {
    const totalFromApi = Object.values(validatorBalances).reduce(
      (sum, balance) => sum + balance,
      0,
    );
    return totalFromApi > 0
      ? totalFromApi
      : validatorCount * globals.VALIDATOR_FULL_DEPOSIT_VALUE_IN_ETH;
  }, [validatorBalances, validatorCount]);

  const [hasEdited, setHasEdited] = useState(false);
  const [balanceValue, setBalanceValue] = useState(() =>
    savedEffectiveBalance > 0n
      ? savedEffectiveBalance
      : BigInt(estimatedTotalBalance),
  );
  const [isConfirmed, setIsConfirmed] = useState(false);

  const tabLabels = {
    all: "All",
    deposited: "Deposited",
    notDeposited: "Not Deposited",
  } as const;

  type TabKey = keyof typeof tabLabels;
  const [selectedTab, setSelectedTab] = useState<TabKey>("all");

  const validatorsWithStatus = useMemo(
    () =>
      shares.map((share) => ({
        publicKey: share.publicKey,
        status:
          validatorBalances[share.publicKey] >=
          globals.VALIDATOR_FULL_DEPOSIT_VALUE_IN_ETH
            ? ("Deposited" as const)
            : ("Not Deposited" as const),
        effectiveBalance:
          validatorBalances[share.publicKey] ??
          globals.VALIDATOR_FULL_DEPOSIT_VALUE_IN_ETH,
      })),
    [shares, validatorBalances],
  );

  const counts = useMemo(() => {
    const deposited = validatorsWithStatus.filter(
      (validator) => validator.status === "Deposited",
    ).length;
    const notDeposited = validatorsWithStatus.filter(
      (validator) => validator.status === "Not Deposited",
    ).length;
    return {
      all: validatorsWithStatus.length,
      deposited,
      notDeposited,
    };
  }, [validatorsWithStatus]);

  const filteredValidators = useMemo(() => {
    if (selectedTab === "all") return validatorsWithStatus;
    if (selectedTab === "deposited") {
      return validatorsWithStatus.filter(
        (validator) => validator.status === "Deposited",
      );
    }
    return validatorsWithStatus.filter(
      (validator) => validator.status === "Not Deposited",
    );
  }, [selectedTab, validatorsWithStatus]);

  const numericBalance = Number(balanceValue);
  const maxEffectiveBalance = validatorCount * 2048;

  const isLowBalance =
    numericBalance > 0 &&
    estimatedTotalBalance > 0 &&
    numericBalance < estimatedTotalBalance;
  const isHighBalance =
    maxEffectiveBalance > 0 && numericBalance > maxEffectiveBalance;
  const isInvalidBalance = isLowBalance || isHighBalance;

  useEffect(() => {
    const fetchEffectiveBalances = async () => {
      if (shares.length === 0) return;

      setIsLoadingBalances(true);
      try {
        const publicKeys = shares.map((share) => share.publicKey);
        const response = await getValidatorsEffectiveBalance(publicKeys);

        console.log("Effective Balance Response:", response);

        const balanceMap: Record<string, number> = {};
        response.validators.forEach((validator) => {
          balanceMap[validator.publicKey] = validator.effectiveBalance;
        });

        setValidatorBalances(balanceMap);
      } catch (error) {
        console.error("Failed to fetch effective balances:", error);
      } finally {
        setIsLoadingBalances(false);
      }
    };

    fetchEffectiveBalances();
  }, [shares]);

  useEffect(() => {
    if (!hasEdited) {
      setBalanceValue(BigInt(estimatedTotalBalance));
    }
  }, [hasEdited, estimatedTotalBalance]);

  const handleBalanceChange = (value: bigint) => {
    setHasEdited(true);
    setBalanceValue(value);
  };

  const handleNext = () => {
    state.effectiveBalance = balanceValue;
    navigate("../funding");
  };

  return (
    <Container variant="vertical" size="xl" className="py-6 h-full">
      <NavigateBackBtn to={`/`} persistSearch />
      <div className="flex w-full gap-6">
        <Card className="w-full flex-1 flex flex-col gap-6 p-8 bg-white rounded-2xl">
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
              value={balanceValue}
              onChange={handleBalanceChange}
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

          <Alert variant="warning" className="rounded-lg text-gray-700">
            <AlertDescription className="text-sm font-medium">
              <span className="font-semibold">Cluster Liquidation Warning</span>
              <br />
              If the actual Effective Balance reported by Oracles is higher than
              the amount set here, your operational burn rate will increase.
              This risks an insufficient runway and possible cluster
              liquidation.
            </AlertDescription>
          </Alert>

          {isLowBalance && (
            <Alert variant="error" className="rounded-lg">
              <AlertDescription className="text-sm font-medium">
                The entered total projected balance is lower than our
                estimation. This may lead to an insufficient runway. Please
                double-check the balance entered.
              </AlertDescription>
            </Alert>
          )}

          {isHighBalance && (
            <Alert variant="error" className="rounded-lg">
              <AlertDescription className="text-sm font-medium">
                The entered total projected balance is higher than the max EB
                per validator. Please double-check the balance entered.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-start gap-3">
            <Checkbox
              checked={isConfirmed}
              onCheckedChange={(checked) => setIsConfirmed(checked === true)}
              className="mt-0.5"
            />
            <Text variant="body-3-medium" className="text-gray-700">
              I confirm that the total projected balance is accurate, and I
              understand that an insufficient funding balance based on this
              amount could lead to my cluster being liquidated.
            </Text>
          </div>

          <Button
            size="xl"
            width="full"
            className="font-semibold"
            onClick={handleNext}
            disabled={!isConfirmed || numericBalance <= 0 || isInvalidBalance}
          >
            Next
          </Button>
        </Card>

        <Card className="flex-1 flex min-h-0 flex-col gap-4 p-6 bg-white rounded-2xl">
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
              <TabsTrigger
                value="deposited"
                className="flex items-center gap-2"
              >
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
                {numberFormatter.format(estimatedTotalBalance)}
              </Text>
              <img
                src="/images/networks/dark.svg"
                alt="ETH"
                className="size-4"
              />
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
              const displayBalance = isLoadingBalances
                ? "..."
                : validator.effectiveBalance;
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
      </div>
    </Container>
  );
};

export default EffectiveValidatorsBalance;
