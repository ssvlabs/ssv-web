import { type FC, useMemo, useState } from "react";
import { Card } from "@/components/ui/card.tsx";
import { Text } from "@/components/ui/text.tsx";
import { TableCell, TableRow } from "@/components/ui/grid-table";
import { VirtualizedInfinityTable } from "@/components/ui/virtualized-infinity-table";
import { CopyBtn } from "@/components/ui/copy-btn";
import { BeaconchainBtn } from "@/components/ui/ssv-explorer-btn";
import { add0x, shortenAddress } from "@/lib/utils/strings";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip } from "@/components/ui/tooltip";
import { FaCircleInfo } from "react-icons/fa6";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { numberFormatter } from "@/lib/utils/number";
import { ValidatorStatus } from "@/lib/utils/validator-status-mapping";
import { useInfiniteClusterValidators } from "@/hooks/cluster/use-infinite-cluster-validators";
import { formatUnits } from "viem";
import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import { getValidatorsStatusCounts } from "@/api/validators";
import { useValidatorsSearchFilters } from "@/hooks/cluster/use-validators-search-filters";

const tabLabels = {
  all: "All",
  deposited: "Deposited",
  notDeposited: "Not Deposited",
} as const;

type TabKey = keyof typeof tabLabels;

export type ExistingClusterValidatorsBreakdownProps = {
  clusterHash: string;
  totalEffectiveBalance: number;
};

export const ExistingClusterValidatorsBreakdown: FC<
  ExistingClusterValidatorsBreakdownProps
> = ({ clusterHash, totalEffectiveBalance }) => {
  const [selectedTab, _setSelectedTab] = useState<TabKey>("all");

  const [, setFilters] = useValidatorsSearchFilters();

  const setSelectedTab: typeof _setSelectedTab = (value) => {
    switch (value) {
      case "all":
        setFilters({ status: [] });
        break;
      case "deposited":
        setFilters({
          status: [
            "active",
            "exited",
            "exiting",
            "slashed",
            "pending",
            "inactive",
          ],
        });
        break;
      case "notDeposited":
        setFilters({ status: ["notDeposited"] });
        break;
    }
    _setSelectedTab(value as TabKey);
  };

  const statusesQuery = useChainedQuery({
    queryKey: ["validators-status-counts", clusterHash],
    queryFn: () => getValidatorsStatusCounts(clusterHash!),
    enabled: Boolean(clusterHash),
  });

  const total = Object.values(statusesQuery.data ?? {}).reduce(
    (acc, curr) => acc + curr,
    0,
  ) as number;

  const { validators: apiValidators, infiniteQuery } =
    useInfiniteClusterValidators(clusterHash, 30);

  const validators = useMemo(
    () =>
      apiValidators.map((validator) => {
        const effectiveBalanceBigInt = BigInt(
          validator.validator_info?.effective_balance ?? 0,
        );
        return {
          publicKey: validator.public_key,
          status:
            validator.displayedStatus === ValidatorStatus.NOT_DEPOSITED
              ? ("Not Deposited" as const)
              : ("Deposited" as const),
          effectiveBalance:
            validator.displayedStatus === ValidatorStatus.NOT_DEPOSITED
              ? 32
              : Number(formatUnits(effectiveBalanceBigInt, 9)),
        };
      }),
    [apiValidators],
  );

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
            {statusesQuery.isLoading ? (
              <Spinner size="sm" />
            ) : (
              <Badge variant="primary" size="xs" className="rounded-md">
                {total}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="deposited" className="flex items-center gap-2">
            <Text variant="body-3-medium">{tabLabels.deposited}</Text>

            {statusesQuery.isLoading ? (
              <Spinner size="sm" />
            ) : (
              <Badge variant="success" size="xs" className="rounded-md">
                {total - (statusesQuery.data?.notDeposited ?? 0)}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="notDeposited" className="flex items-center gap-2">
            <Text variant="body-3-medium">{tabLabels.notDeposited}</Text>
            {statusesQuery.isLoading ? (
              <Spinner size="sm" />
            ) : (
              <Badge variant="warning" size="xs" className="rounded-md">
                {statusesQuery.data?.notDeposited ?? 0}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center justify-between rounded-lg border border-primary-200 bg-primary-50 px-4 py-3">
        <Text variant="body-3-medium" className="text-gray-600">
          Estimated Effective Balance
        </Text>
        <div className="flex items-center gap-2">
          <Text variant="body-2-semibold" className="text-gray-800">
            {numberFormatter.format(totalEffectiveBalance)}
          </Text>
          <img src="/images/networks/dark.svg" alt="ETH" className="size-4" />
          <Text variant="body-3-medium" className="text-gray-500">
            ETH
          </Text>
        </div>
      </div>

      <VirtualizedInfinityTable
        gridTemplateColumns="minmax(200px, 1fr) 120px 140px"
        className="flex-1 min-h-0 max-h-[360px] bg-white"
        query={infiniteQuery}
        headers={[
          "Public Key",
          "Status",
          <div className="flex justify-end w-full">Effective Balance</div>,
        ]}
        items={validators}
        renderRow={({ item: validator }) => {
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
        }}
      />
    </Card>
  );
};
