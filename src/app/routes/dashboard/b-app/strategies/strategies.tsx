import type { FC } from "react";
import { Container } from "@/components/ui/container.tsx";
import { StrategiesTable } from "@/components/based-apps/strategies-table/strategies-table.tsx";
import { Text } from "@/components/ui/text.tsx";
import { Button } from "@/components/ui/button.tsx";
import { SearchInput } from "@/components/ui/search-input.tsx";
import { Link, useSearchParams } from "react-router-dom";
import { useStrategies } from "@/hooks/b-app/use-strategies.tsx";
import { TableMenuButton } from "@/components/ui/table";
import { useTokensFilter } from "@/hooks/b-app/filters/use-tokens-filter";
import { AssetLogo } from "@/components/ui/asset-logo";
import { X } from "lucide-react";
import type { Strategy } from "@/api/b-app";
import { useAssetsDelegationModal } from "@/signals/modal";
import type { Address } from "abitype";

export const Strategies: FC = () => {
  const { pagination, strategies, isStrategiesIsLoading } = useStrategies();
  const [, setSearchParams] = useSearchParams();

  const tokensFilter = useTokensFilter();

  const searchById = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("id", e.target.value);
      return params;
    });
  };

  const onDepositClick = (strategy: Strategy) => {
    useAssetsDelegationModal.state.open({
      strategy,
      asset: tokensFilter.value?.[0] as Address,
    });
  };
  return (
    <Container variant="vertical" size="xl" className="py-6">
      <div className="flex justify-between w-full items-center">
        <Text variant="body-1-semibold">Strategies</Text>
        <div className="flex items-center gap-2">
          <SearchInput
            onChange={searchById}
            placeholder="Search"
            iconPlacement="left"
            className="h-10 rounded-xl bg-gray-50 text-sm w-[536px] max-w-full"
            inputProps={{
              className: "bg-gray-50",
              placeholder: "Search Strategy...",
            }}
          />
          {tokensFilter.value && (
            <TableMenuButton isActive={true} className="pr-2">
              <AssetLogo className="size-4" address={tokensFilter.value[0]} />
              <div className="flex">Filters</div>
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  tokensFilter.set(null, {
                    history: "push",
                  });
                }}
                className="flex size-6 items-center justify-center rounded-md text-gray-500 hover:bg-primary-50 hover:text-primary-500"
              >
                <X className="size-4" />
              </div>
            </TableMenuButton>
          )}
          <Button as={Link} to={"create/bApps"} size="sm" className="px-5 h-10">
            Create Strategy
          </Button>
        </div>
      </div>
      <StrategiesTable
        strategies={strategies}
        pagination={pagination}
        isLoading={isStrategiesIsLoading}
        showDepositButtonOnHover={(tokensFilter.value?.length || 0) > 0}
        onDepositClick={onDepositClick}
      />
    </Container>
  );
};

Strategies.displayName = "Strategies";
