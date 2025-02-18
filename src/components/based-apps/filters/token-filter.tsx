"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CommandLoading } from "cmdk";
import { xor } from "lodash-es";
import { Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Text } from "@/components/ui/text";
import { FilterButton } from "@/components/ui/filter/filter-button";
import { useTokensFilter } from "@/hooks/b-app/filters/use-tokens-filter";
import { cn } from "@/lib/utils/tw";
import { getBAppsAssets } from "@/api/b-app";
import { shortenAddress } from "@/lib/utils/strings";
import { AssetLogo } from "@/components/ui/asset-logo";

export function TokensFilter() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  const tokensFilter = useTokensFilter();

  const query = useQuery({
    queryKey: ["b-app-assets", "tokens", search],
    queryFn: async () => getBAppsAssets(),
    select: (data) => data.data ?? [],
    enabled: open,
  });

  const showList = open;

  return (
    <FilterButton
      name="Name"
      activeFiltersCount={tokensFilter.value?.length ?? 0}
      onClear={() => tokensFilter.set(null)}
      popover={{
        root: {
          open,
          onOpenChange: setOpen,
        },
        content: {
          className: "w-[320px]",
        },
      }}
    >
      <Command shouldFilter={false}>
        <div
          className={cn("p-2", {
            "pb-0": showList,
          })}
        >
          <CommandInput
            placeholder="Search names"
            value={search}
            onValueChange={(value) => setSearch(value)}
          />
        </div>

        {Boolean(tokensFilter.value?.length) && (
          <div className="flex flex-wrap gap-1 border-y border-gray-200 p-2">
            {tokensFilter.value?.map((token) => (
              <Button
                size="sm"
                key={token}
                className="h-6 gap-0.5 rounded-full pb-px pl-2 pr-1"
                variant="secondary"
                onClick={() => tokensFilter.set((prev) => xor(prev, [token]))}
              >
                <Text variant="caption-medium">{shortenAddress(token)}</Text>{" "}
                <div className="flex size-4 items-center justify-center">
                  <X className="size-2.5" />
                </div>
              </Button>
            ))}
          </div>
        )}
        {showList && (
          <CommandList className="max-h-none overflow-y-auto">
            {query.isPending ? (
              <CommandLoading className="flex items-center justify-center p-4">
                <Loader2 className="animate-spin" />
              </CommandLoading>
            ) : (
              <CommandEmpty>This list is empty.</CommandEmpty>
            )}
            <CommandGroup>
              {query.data?.map((asset) => (
                <CommandItem
                  key={asset.token}
                  value={asset.token}
                  className="flex h-10 items-center space-x-2 px-2"
                  onSelect={() => {
                    tokensFilter.set((prev) => xor(prev, [asset.token]));
                  }}
                >
                  <Checkbox
                    id={asset.token}
                    checked={tokensFilter.value?.includes(asset.token)}
                    className="mr-2"
                  />
                  <AssetLogo address={asset.token} className="size-5"/>
                  <span
                    className={cn(
                      "flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    )}
                  >
                    {shortenAddress(asset.token)}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </FilterButton>
  );
}
