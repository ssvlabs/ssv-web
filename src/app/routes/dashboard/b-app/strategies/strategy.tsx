import { Container } from "@/components/ui/container.tsx";
import { Text } from "@/components/ui/text.tsx";
import { convertToPercentage, formatSSV } from "@/lib/utils/number.ts";
import { useStrategy } from "@/hooks/b-app/use-strategy.ts";
import { shortenAddress } from "@/lib/utils/strings.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { StrategyAssetsTable } from "@/components/based-apps/strategy-assets-table/strategy-assets-table.tsx";

const Strategy = () => {
  const { account, strategy } = useStrategy();
  console.log(account);
  console.log(strategy);
  const MOCK_TIER_DATA = [
    {
      label: "Fee",
      value: `${convertToPercentage(strategy.fee)}%`,
      tooltipText: "Delegators",
    },
    {
      label: "Delegators",
      value: strategy.totalDelegators,
      tooltipText: "Delegators",
    },
    {
      label: "Total Delegated Value",
      value: strategy.totalDelegatedFiat,
      tooltipText: "Delegators",
    },
    {
      label: "Strategy Owner",
      value: (
        <div className="flex items-center gap-2">
          <img
            className="rounded-[8px] size-7 border-gray-400 border"
            src={"/images/operator_default_background/light.svg"}
            onError={(e) => {
              e.currentTarget.src =
                "/images/operator_default_background/light.svg";
            }}
          />
          {shortenAddress(strategy?.ownerAddress || "0x")}
        </div>
      ),
      tooltipText: "Delegators",
    },
  ];

  return (
    <Container variant="vertical" size="xl" className="py-6">
      <div className=" flex items-center gap-2">
        <Text variant="body-1-semibold">{strategy.name}</Text>
      </div>
      <div className="h-[100px] w-full flex items-center gap-10 rounded-[16px] bg-white p-6">
        {MOCK_TIER_DATA.map(({ label, value }) => (
          <div className="w-[288px] flex-col items-center gap-1">
            <Text className="text-gray-500" variant={"caption-medium"}>
              {label}
            </Text>
            <Text variant={"body-1-medium"}>{value as string}</Text>
          </div>
        ))}
      </div>
      <Text variant="body-1-semibold">Assets</Text>
      <Table className={"w-full rounded-t-xl overflow-hidden"}>
        <TableHeader>
          <TableHead>Non Slashable Assets</TableHead>
          <TableHead>Total Delegated</TableHead>
          <TableHead>Total Delegated Value</TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <div className="flex gap-2 w-[c320px]">
                <img
                  className={"h-[24px] w-[15px]"}
                  src={`/images/balance-validator/balance-validator.svg`}
                />
                Validator Balance
                <Text className="text-gray-500 font-medium">ETH</Text>
              </div>
            </TableCell>
            <TableCell>
              {formatSSV((strategy.totalNonSlashableTokens || 0n) as bigint, 9)}{" "}
              ETH
            </TableCell>
            <TableCell>
              {formatSSV((strategy.totalNonSlashableFiat || 0n) as bigint, 9)} $
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <StrategyAssetsTable assets={strategy.delegationsPerToken || []} />
      <Text variant="body-1-semibold">Supported bApps</Text>
    </Container>
  );
};

export default Strategy;
