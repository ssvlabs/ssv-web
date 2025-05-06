import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import type { InputProps } from "@/components/ui/input";
import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";

type SearchInputProps = {
  iconPlacement?: "left" | "right";
};
type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"input">, keyof InputProps> &
    InputProps &
    SearchInputProps
>;

export const SearchInput: FCProps = ({
  className,
  iconPlacement = "right",
  ...props
}) => {
  return (
    <Input
      className={cn(className)}
      rightSlot={
        iconPlacement === "right" ? <FiSearch className="mx-3" /> : undefined
      }
      leftSlot={iconPlacement === "left" ? <FiSearch /> : undefined}
      {...props}
    />
  );
};

SearchInput.displayName = "SearchInput";
