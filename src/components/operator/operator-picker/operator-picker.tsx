import { OperatorPickerItem } from "@/components/operator/operator-picker/operator-picker-item/operator-picker-item";
import { Text } from "@/components/ui/text";
import { VirtualizedInfinityTable } from "@/components/ui/virtualized-infinity-table";
import type { useSearchOperators } from "@/hooks/use-search-operators";
import type { Operator } from "@/types/api";
import type { FC } from "react";
import type { VListProps } from "virtua";

export type OperatorPickerProps = {
  selectedOperatorIds: readonly number[];
  onOperatorCheckedChange: (operatorId: number, checked: boolean) => void;
  maxSelection?: number;
  operators: Operator[];
  query: ReturnType<typeof useSearchOperators>["infiniteQuery"];
};

type FCProps = FC<Omit<VListProps, "children"> & OperatorPickerProps>;

export const OperatorPicker: FCProps = ({
  selectedOperatorIds,
  onOperatorCheckedChange,
  operators,
  maxSelection,
  query,
  className,
}) => {
  const isMaxSelected = selectedOperatorIds.length === maxSelection;

  return (
    <VirtualizedInfinityTable
      className={className}
      gridTemplateColumns="38px 196px 90px 120px 120px minmax(50px, auto) 80px"
      query={query}
      headers={[
        null,
        "Name",
        "Validators",
        "30D Performance",
        "Yearly Fee",
        "MEV Relays",
        null,
      ]}
      items={operators}
      renderRow={({ item: operator }) => {
        const isSelected = selectedOperatorIds.includes(operator.id);
        return (
          <OperatorPickerItem
            key={operator.id}
            isSelected={isSelected}
            isDisabled={isMaxSelected && !isSelected}
            operator={operator}
            onCheckedChange={(checked) =>
              onOperatorCheckedChange(operator.id, checked)
            }
          />
        );
      }}
      emptyMessage={
        <div className="flex flex-col items-center justify-center">
          <Text variant="body-2-bold">No operators found</Text>
          <Text variant="body-2-medium" className="text-gray-500">
            Please try different keyword or filter
          </Text>
        </div>
      }
    />
  );
};

OperatorPicker.displayName = "OperatorPicker";
