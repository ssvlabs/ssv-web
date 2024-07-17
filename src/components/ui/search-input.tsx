import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Input, InputProps } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"input">, keyof InputProps> & InputProps
>;

export const SearchInput: FCProps = ({ className, ...props }) => {
  return (
    <Input
      className={cn(className)}
      rightSlot={<FiSearch className="mx-3" />}
      {...props}
    />
  );
};

SearchInput.displayName = "SearchInput";
