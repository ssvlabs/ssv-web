import { type FC, useMemo, useState } from "react";
import { Card } from "@/components/ui/card.tsx";
import { Text } from "@/components/ui/text.tsx";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/grid-table";
import { CopyBtn } from "@/components/ui/copy-btn";
import { BeaconchainBtn } from "@/components/ui/ssv-explorer-btn";
import { add0x, shortenAddress } from "@/lib/utils/strings";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { FaCircleInfo } from "react-icons/fa6";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { numberFormatter } from "@/lib/utils/number";
import type { ValidatorItem } from "./effective-balance-form";

const tabLabels = {
  all: "All",
  deposited: "Deposited",
  notDeposited: "Not Deposited",
} as const;

type TabKey = keyof typeof tabLabels;

export type ValidatorsBreakdownProps = {
  validators: ValidatorItem[];
  estimatedTotalBalance: number;
};

export const ValidatorsBreakdown: FC<ValidatorsBreakdownProps> = ({
  validators,
  estimatedTotalBalance,
}) => {
  const [selectedTab, setSelectedTab] = useState<TabKey>("all");

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

  return (
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
          <TabsTrigger value="deposited" className="flex items-center gap-2">
            <Text variant="body-3-medium">{tabLabels.deposited}</Text>
            <Badge variant="success" size="xs" className="rounded-md">
              {counts.deposited}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="notDeposited" className="flex items-center gap-2">
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
          const displayBalance = validator.effectiveBalance;
          return (
            <TableRow key={validator.publicKey} className="bg-white">
              <TableCell className="flex items-center gap-2">
                <Text variant="body-3-medium" className="text-gray-600">
                  {shortenAddress(add0x(validator.publicKey))}
                </Text>
                <CopyBtn text={validator.publicKey} />
                <BeaconchainBtn validatorId={validator.publicKey} />
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
  );
};
