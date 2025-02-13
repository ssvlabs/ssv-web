import { Container } from "@/components/ui/container.tsx";
import { Text } from "@/components/ui/text.tsx";
import { shortenAddress } from "@/lib/utils/strings.ts";
import AssetsTable from "@/app/routes/dashboard/b-app/my-account/assets-table.tsx";
import {
  convertToPercentage,
  ethFormatter,
  formatSSV,
  percentageFormatter,
} from "@/lib/utils/number.ts";
import { useCreateStrategyContext } from "@/guard/create-strategy-context.ts";
import { formatUnits } from "viem";

const Strategy = () => {
  const { strategyData } = useCreateStrategyContext();

  const MOCK_TIER_DATA = [
    {
      label: "Fee",
      value: percentageFormatter.format(convertToPercentage(strategyData.fee)),
      tooltipText: "Delegators",
    },
    {
      label: "Delegating Accounts",
      value: strategyData.delegators,
      tooltipText: "Delegators",
    },
    {
      label: "Total Delegated Value",
      value: formatSSV(strategyData.totalDelegatedValue as bigint, 18),
      tooltipText: "Delegators",
    },
    {
      label: "Strategy Owner",
      value: shortenAddress(strategyData.ownerAddress),
      tooltipText: "Delegators",
    },
    {
      label: "",
      value: "",
      tooltipText: "",
    },
  ];

  return (
    <Container variant="vertical" size="xl" className="py-6">
      <div className=" flex items-center gap-2">
        {/*<Text variant="body-1-semibold">Pier Two</Text>*/}
      </div>
      <div className="h-[100px] w-full flex items-center gap-10 rounded-[16px] bg-white p-6">
        {MOCK_TIER_DATA.map(({ label, value }) => (
          <div className="w-[288px] flex-col items-center gap-1">
            <Text className="text-gray-500" variant={"caption-medium"}>
              {label}
            </Text>
            <Text variant={"body-1-bold"}>{value as string}</Text>
          </div>
        ))}
      </div>
      <Text variant="body-1-semibold">Assets</Text>
      <AssetsTable
        // onRowClick={() => null}
        data={[
          {
            rows: [
              <div className="flex gap-2 w-[c320px]">
                <img
                  className={"h-[24px] w-[15px]"}
                  src={`/images/balance-validator/balance-validator.svg`}
                />
                Validator Balance
                <Text className="text-gray-500 font-medium">ETH</Text>
              </div>,
              Math.floor(
                Number(
                  ethFormatter.format(
                    +formatUnits(
                      BigInt(strategyData.totalDelegatedValue || 0n),
                      18,
                    ),
                  ),
                ) * 100,
              ) / 100,
            ],
          },
        ]}
        // isLoading={isLoading}
        tableHeads={[
          {
            label: "Non Slashable Assets",
            textAlign: "w-[348px]",
            size: 348,
          },
          {
            label: "Total delegated",
            textAlign: "w-[200px]",
            size: 200,
          },
          {
            label: "Total Delegated Value",
            textAlign: "text-right w-[240px]",
            size: 240,
          },
        ]}
      />
    </Container>
  );
};

export default Strategy;
