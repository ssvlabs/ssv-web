import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import type { InputProps } from "@/components/ui/input";
import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";
import { Tooltip } from "@/components/ui/tooltip";

type SearchInputProps = {
  iconPlacement?: "left" | "right";
  tooltip?: string;
};
type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"input">, keyof InputProps> &
    InputProps &
    SearchInputProps
>;

export const SearchInput: FCProps = ({
  className,
  iconPlacement = "right",
  tooltip,
  ...props
}) => {
  return (
    <Tooltip content={tooltip} triggerProps={{ className: "w-full flex-1" }}>
      <Input
        className={cn("w-full flex-1", className)}
        rightSlot={
          iconPlacement === "right" ? <FiSearch className="mx-3" /> : undefined
        }
        leftSlot={iconPlacement === "left" ? <FiSearch /> : undefined}
        {...props}
      />
    </Tooltip>
  );
};

SearchInput.displayName = "SearchInput";
