import { OperatorAvatar } from "@/components/operator/operator-avatar";
import { MevRelays } from "@/components/operator/operator-picker/operator-picker-item/mev-relays/mev-relays";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";
import { percentageFormatter } from "@/lib/utils/number";
import { getYearlyFee } from "@/lib/utils/operator";
import { cn } from "@/lib/utils/tw";
import { Operator } from "@/types/api";
import type { ComponentPropsWithoutRef, FC } from "react";
import { MdOutlineQueryStats } from "react-icons/md";
import { Link } from "react-router-dom";

export type OperatorPickerItemProps = {
  operator: Operator;
  isSelected?: boolean;
  isDisabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"label">, keyof OperatorPickerItemProps> &
    OperatorPickerItemProps
>;

export const OperatorPickerItem: FCProps = ({
  className,
  operator,
  onCheckedChange,
  isSelected,
  isDisabled,
  ...props
}) => {
  return (
    <label
      htmlFor={operator.id.toString()}
      className={cn(
        "grid grid-cols-7 gap-2 text-sm p-4 rounded-sm font-medium items-center",
        isSelected && "bg-primary-100",
        isDisabled && "opacity-50 pointer-events-none",
        className,
      )}
      style={{
        gridTemplateColumns: "32px 1fr 1fr 1fr 1fr 1fr 1fr",
      }}
      {...props}
    >
      <Checkbox
        checked={isSelected}
        id={operator.id.toString()}
        onCheckedChange={isDisabled ? undefined : onCheckedChange}
      >
        Hello
      </Checkbox>
      <div className="flex items-center gap-2 overflow-hidden">
        <OperatorAvatar size="md" />
        <Text className="flex-1 text-ellipsis overflow-hidden">
          {operator.name}
        </Text>
      </div>
      <div>{operator.validators_count}</div>
      <div>{percentageFormatter.format(operator.performance["30d"] / 100)}</div>
      <div>{getYearlyFee(BigInt(operator.fee), { format: true })}</div>
      <MevRelays mevRelays={operator.mev_relays} />
      <Link to={`/operator/${operator.id}`}>
        <Button variant="secondary" size="sm">
          <MdOutlineQueryStats className="mr-2" />
          Details
        </Button>
      </Link>
    </label>
  );
};

OperatorPickerItem.displayName = "OperatorPickerItem";
