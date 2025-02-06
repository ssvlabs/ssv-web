import type { FC } from "react";
import { Container } from "@/components/ui/container";
import { StrategiesTable } from "@/components/based-apps/strategies-table/strategies-table";
import { MOCK_DATA_STRATEGIES } from "@/lib/mock/strategies";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";

export const Strategies: FC = () => {
  return (
    <Container variant="vertical" size="xl" className="py-6">
      <div className="flex justify-between w-full items-center">
        <Text variant="body-1-semibold">Strategies</Text>
        <div className="flex items-center gap-2">
          <SearchInput
            placeholder="Search"
            iconPlacement="left"
            className="h-10 rounded-xl bg-gray-50 text-sm w-[536px] max-w-full"
            inputProps={{
              className: "bg-gray-50",
              placeholder: "Search Strategy...",
            }}
          />
          <Button size="sm" className="px-5 h-10">
            Create Strategy
          </Button>
        </div>
      </div>
      <StrategiesTable
        strategies={MOCK_DATA_STRATEGIES}
        pagination={{
          page: 1,
          pages: 1,
          per_page: MOCK_DATA_STRATEGIES.length,
          total: MOCK_DATA_STRATEGIES.length,
        }}
      />
    </Container>
  );
};

Strategies.displayName = "Strategies";
