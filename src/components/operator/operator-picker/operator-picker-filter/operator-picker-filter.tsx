import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Button } from "@/components/ui/button";
import { BiFilterAlt } from "react-icons/bi";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";

export type OperatorPickerFilterProps = {
  onChange: (filters: {
    isVerifiedChecked: boolean;
    isDKGChecked: boolean;
  }) => void;
  isVerifiedChecked: boolean;
  isDKGChecked: boolean;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof OperatorPickerFilterProps> &
    OperatorPickerFilterProps
>;

export const OperatorPickerFilter: FCProps = ({
  onChange,
  isVerifiedChecked,
  isDKGChecked,
  className,
  ...props
}) => {
  const count = Number(isVerifiedChecked) + Number(isDKGChecked);
  return (
    <div className={cn(className, "flex gap-2")} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            variant={count > 0 ? "secondary" : "outline"}
            className={cn("pl-4", {
              "border border-primary-500": count > 0,
              "pr-4": count > 0,
            })}
          >
            <BiFilterAlt className="mr-2" />
            <Text>Filters</Text>
            {count > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary-500 rounded-full">
                {count}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            checked={isVerifiedChecked}
            onCheckedChange={() =>
              onChange({
                isVerifiedChecked: !isVerifiedChecked,
                isDKGChecked,
              })
            }
          >
            <span>Verified</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={isDKGChecked}
            onCheckedChange={() =>
              onChange({
                isVerifiedChecked,
                isDKGChecked: !isDKGChecked,
              })
            }
          >
            <span>DKG</span>
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

OperatorPickerFilter.displayName = "OperatorPickerFilter";
