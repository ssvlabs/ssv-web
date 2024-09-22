"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/tw";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";

interface Item {
  value: string;
  label: string;
}

interface MultipleSelectorProps<T extends Item> {
  items: T[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
}

export const MultipleSelector = <T extends Item>({
  items,
  selected,
  onChange,
  placeholder = "",
  emptyMessage = "No item found.",
}: MultipleSelectorProps<T>) => {
  const [open, setOpen] = React.useState(false);

  const handleSetValue = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((item) => item !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between min-h-12 h-auto w-full "
        >
          <div className="flex flex-wrap gap-2 justify-start">
            {selected.length ? (
              selected.map((val) => (
                <Badge
                  size="xs"
                  variant="multi-select"
                  className="rounded-full"
                  key={val}
                >
                  {val}
                </Badge>
              ))
            ) : (
              <Text variant="body-2-medium" className="text-gray-400">
                {placeholder}
              </Text>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[480px] p-0">
        <Command>
          <CommandInput placeholder={`${placeholder.toLowerCase()}...`} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => {
                    handleSetValue(item.value);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(item.value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
