import { Container } from "@/components/ui/container.tsx";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Text } from "@/components/ui/text.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { useState, useMemo, useEffect } from "react";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/grid-table";
import { CopyBtn } from "@/components/ui/copy-btn";
import { SsvExplorerBtn } from "@/components/ui/ssv-explorer-btn";
import { shortenAddress, add0x } from "@/lib/utils/strings";
import { Badge } from "@/components/ui/badge";
import { BigNumberInput } from "@/components/ui/number-input";
import { Tooltip } from "@/components/ui/tooltip";
import { FaCircleInfo } from "react-icons/fa6";
import { getValidatorsEffectiveBalance } from "@/api/validators";

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
    return totalFromApi > 0 ? totalFromApi : validatorCount * 32;
  }, [validatorBalances, validatorCount]);

  const [hasEdited, setHasEdited] = useState(false);
  const [balanceValue, setBalanceValue] = useState(() =>
    savedEffectiveBalance > 0n
      ? savedEffectiveBalance
      : BigInt(estimatedTotalBalance),
  );
  const [isConfirmed, setIsConfirmed] = useState(false);

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

        <Card className="w-full flex-1 flex flex-col gap-4 min-h-0">
          <div className="flex items-center justify-between">
            <Text variant="headline4">Validator Breakdown</Text>
            <Badge variant="primary" size="sm" className="rounded-md">
              {validatorCount} Validators
            </Badge>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-primary-200 bg-primary-50 px-4 py-3">
            <Text variant="body-3-medium" className="text-gray-600">
              Estimated Total Balance
            </Text>
            <div className="flex items-center gap-2">
              <Text variant="body-2-semibold" className="text-gray-800">
                {estimatedTotalBalance}
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
            gridTemplateColumns="minmax(200px, 1fr) 140px"
            className="flex-1 min-h-0 max-h-[400px] bg-white"
          >
            <TableHeader className="sticky top-0 z-10 bg-gray-100">
              <TableCell>Public Key</TableCell>
              <TableCell className="justify-end">Expected Balance</TableCell>
            </TableHeader>
            {shares.map((share) => {
              const effectiveBalance = validatorBalances[share.publicKey] ?? 32;
              return (
                <TableRow key={share.publicKey} className="bg-white">
                  <TableCell className="flex items-center gap-2">
                    <Text variant="body-3-medium" className="text-gray-600">
                      {shortenAddress(add0x(share.publicKey))}
                    </Text>
                    <CopyBtn text={share.publicKey} />
                    <SsvExplorerBtn validatorId={share.publicKey} />
                  </TableCell>
                  <TableCell className="flex items-center justify-end gap-1">
                    <Text variant="body-3-medium" className="text-gray-800">
                      {isLoadingBalances ? "..." : effectiveBalance}
                    </Text>
                    <img
                      src="/images/networks/dark.svg"
                      alt="ETH"
                      className="size-3.5"
                    />
                    <Text variant="body-3-medium" className="text-gray-500">
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
