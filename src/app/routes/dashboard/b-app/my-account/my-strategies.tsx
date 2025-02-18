import { Text } from "@/components/ui/text.tsx";
import { Container } from "@/components/ui/container.tsx";
import { StrategiesTable } from "@/components/based-apps/strategies-table/strategies-table.tsx";
import { useMyBAppAccount } from "@/hooks/b-app/use-my-b-app-account.ts";
import { formatSSV } from "@/lib/utils/number.ts";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";

const MyStrategies = () => {
  const { myStrategies, effectiveBalance } = useMyBAppAccount();

  const MOCK_TIER_DATA = [
    {
      label: "Delegating Accounts",
      value: myStrategies.strategies.reduce(
        (acc, currentValue) => acc + (currentValue.totalDelegators || 0),
        0,
      ),
      tooltipText: "Delegators",
    },
    {
      label: "Validator Balance (Non Slashable)",
      value: (
        <div className="flex gap-2">
          {formatSSV(effectiveBalance || 0n, 9)}
          <img
            className={"h-[24px] w-[15px]"}
            src={`/images/balance-validator/balance-validator.svg`}
          />
          <Text className="text-gray-500 font-medium">ETH</Text>
        </div>
      ),
      tooltipText: "Delegators",
    },
    {
      label: "Assets Value (Slashable)",
      value: "$ 7.9M",
      tooltipText: "Delegators",
    },
    {
      label: "Total Delegated Value",
      value: "$ 7.9M",
      tooltipText: "Delegators",
    },
    {
      label: "Account",
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
          Account Name
        </div>
      ),
      tooltipText: "Delegators",
    },
  ];
  return (
    <Container variant="vertical" size="xl" className="py-6">
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
      <div className="w-full flex items-center justify-between">
        <Text variant="body-1-semibold">My Strategies</Text>
        <Button
          as={Link}
          to={"strategies/create/bApps"}
          size="sm"
          className="px-5 h-10"
        >
          Create Strategy
        </Button>
      </div>
      <StrategiesTable strategies={myStrategies.strategies} />
    </Container>
  );
};

export default MyStrategies;
