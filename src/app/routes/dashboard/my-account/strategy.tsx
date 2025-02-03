import { Container } from "@/components/ui/container.tsx";
import { Text } from "@/components/ui/text.tsx";

const MOCK_TIER_DATA = [
  {
    label: "Delegators",
    value: "56",
    tooltipText: "Delegators",
  },
  {
    label: "Delegated Non Slashable Assets",
    value: "64,000 VB ETH",
    tooltipText: "Delegators",
  },
  {
    label: "Delegated Slashable Assets Value",
    value: "$ 7.9M",
    tooltipText: "Delegators",
  },
  {
    label: "Total Delegated Value",
    value: "$ 225M",
    tooltipText: "Delegators",
  },
  {
    label: "Account",
    value: "Pier Two",
    tooltipText: "Delegators",
  },
];

const Strategy = () => {
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
            <Text variant={"body-1-bold"}>{value}</Text>
          </div>
        ))}
      </div>
      <Text variant="body-1-semibold">My Strategies</Text>
    </Container>
  );
};

export default Strategy;
