import type { FC } from "react";
import { Container } from "@/components/ui/container.tsx";
import { StrategiesTable } from "@/components/based-apps/strategies-table/strategies-table.tsx";
import { Text } from "@/components/ui/text.tsx";
import { Button } from "@/components/ui/button.tsx";
import { SearchInput } from "@/components/ui/search-input.tsx";
import { Link } from "react-router-dom";
import { useStrategies } from "@/hooks/b-app/use-strategies.tsx";

export const Strategies: FC = () => {
  const { pagination, strategies } = useStrategies();

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
          <Button as={Link} to={"create/bApps"} size="sm" className="px-5 h-10">
            Create Strategy
          </Button>
        </div>
      </div>
      <StrategiesTable strategies={strategies} pagination={pagination} />
    </Container>
  );
};

Strategies.displayName = "Strategies";
