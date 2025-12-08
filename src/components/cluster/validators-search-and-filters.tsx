import type { FC } from "react";
import { useState } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { VALIDATOR_STATUS_FILTER_KEYS } from "@/lib/search-parsers/validators-search-parsers";
import { startCase, xor } from "lodash-es";
import { getValidatorsStatusCounts } from "@/api/validators";
import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import { Settings2 } from "lucide-react";
import { TableMenuButton } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Spacer } from "@/components/ui/spacer";
import { extractValidatorsPublicKeys } from "@/lib/utils/strings";
import { useValidatorsSearchFilters } from "@/hooks/cluster/use-validators-search-filters";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/tw";

export type ValidatorsSearchAndFiltersProps = {
  clusterHash?: string;
  statusCounts?: Record<string, number>;
};

export const ValidatorsSearchAndFilters: FC<
  ValidatorsSearchAndFiltersProps
> = ({
  clusterHash: externalClusterHash,
  statusCounts: externalStatusCounts,
}) => {
  const [filters, setFilters] = useValidatorsSearchFilters();
  const { clusterHash: routeClusterHash } = useClusterPageParams();
  const clusterHash = externalClusterHash || routeClusterHash;

  const [isStatusesOpen, setIsStatusesOpen] = useState(false);
  const [search, setSearch] = useState(filters.publicKey?.join(", ") || "");

  const { data: statusCounts, isLoading: isStatusCountsLoading } =
    useChainedQuery({
      queryKey: ["validators-status-counts", clusterHash],
      queryFn: () => getValidatorsStatusCounts(clusterHash!),
      enabled: Boolean(clusterHash) && isStatusesOpen && !externalStatusCounts,
    });

  const displayStatusCounts = externalStatusCounts || statusCounts;

  const handleSearch = (value: string) => {
    setSearch(value);
    setFilters({
      publicKey: extractValidatorsPublicKeys(value),
    });
  };

  return (
    <div className="flex items-center gap-2">
      <SearchInput
        iconPlacement="left"
        className="h-10 bg-gray-100"
        placeholder="0xb510…42b7, 0x3od5…88bd"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        tooltip="Enter multiple keys, separated by commas or whitespaces"
      />
      <Popover open={isStatusesOpen} onOpenChange={setIsStatusesOpen}>
        <PopoverTrigger asChild>
          <TableMenuButton
            isActive={isStatusesOpen}
            icon={<Settings2 />}
            className=" border border-gray-300"
            activeCount={filters.status?.length}
            onClear={() => setFilters({ status: [] })}
          >
            <span className="hidden md:block">Filters</span>
          </TableMenuButton>
        </PopoverTrigger>
        <PopoverContent className="view-transition-card bg-gray-50 rounded-2xl border-gray-300 p-0 w-[400px] max-w-full">
          <div className="flex flex-col pb-2 w-full">
            <div className="h-[52px] flex items-center pl-4 pr-2 justify-between">
              <Text variant="body-3-semibold">Select Status</Text>
              <Button
                size="sm"
                variant="ghost"
                className="text-primary-500 bg-transparent"
                onClick={() => setFilters({ status: [] })}
                disabled={!filters.status?.length}
              >
                Reset
              </Button>
            </div>
            {VALIDATOR_STATUS_FILTER_KEYS.map((key) => {
              const isDisabled =
                !isStatusCountsLoading && !displayStatusCounts?.[key];
              return (
                <Button
                  as="label"
                  key={key}
                  variant="ghost"
                  htmlFor={key}
                  className={cn("h-10 flex justify-start items-center gap-2 ", {
                    "opacity-100 bg-transparent": isDisabled,
                  })}
                  disabled={isDisabled}
                >
                  <Checkbox
                    tabIndex={-1}
                    id={key}
                    checked={filters.status?.includes(key)}
                    disabled={isDisabled}
                    onCheckedChange={() => {
                      setFilters((prev) => ({
                        ...prev,
                        status: xor(prev.status, [key]),
                      }));
                    }}
                  />
                  <Text variant="body-3-medium">{startCase(key)}</Text>
                  <Spacer />
                  {isStatusCountsLoading ? (
                    <Skeleton className="w-6 h-3" />
                  ) : (
                    <Text
                      variant="body-3-medium"
                      className="font-robotoMono text-gray-500"
                    >
                      {displayStatusCounts?.[key]}
                    </Text>
                  )}
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
