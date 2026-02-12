import { OperatorPickerItem } from "@/components/operator/operator-picker/operator-picker-item/operator-picker-item";
import { Text } from "@/components/ui/text";
import { VirtualizedInfinityTable } from "@/components/ui/virtualized-infinity-table";
import type { useSearchOperators } from "@/hooks/use-search-operators";
import type { Operator } from "@/types/api";
import type { FC } from "react";
import type { VListProps } from "virtua";
import type { OrderBy, Sort } from "@/api/operator.ts";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { cn } from "@/lib/utils/tw.ts";

export type OperatorPickerProps = {
  selectedOperatorIds: readonly number[];
  onOperatorCheckedChange: (operatorId: number, checked: boolean) => void;
  maxSelection?: number;
  handleOrdering: (type: OrderBy) => void;
  orderBy: OrderBy;
  sort: Sort;
  operators: Operator[];
  query: ReturnType<typeof useSearchOperators>["infiniteQuery"];
};

type FCProps = FC<Omit<VListProps, "children"> & OperatorPickerProps>;

export const OperatorPicker: FCProps = ({
  selectedOperatorIds,
  onOperatorCheckedChange,
  operators,
  orderBy,
  sort,
  maxSelection,
  query,
  className,
  handleOrdering,
}) => {
  const isMaxSelected = selectedOperatorIds.length === maxSelection;

  const headers: { type?: OrderBy; title: string }[] = [
    { type: "name", title: "Name" },
    { type: "validatorsCount", title: "Validators" },
    { type: "performance30d", title: "30D Performance" },
    { type: "fee", title: "Yearly Fee" },
    { type: "mev", title: "MEV Relays" },
  ];

  return (
    <VirtualizedInfinityTable
      className={className}
      gridTemplateColumns="38px 180px 100px 140px 120px minmax(50px, auto) 80px"
      query={query}
      headers={[
        null,
        ...headers.map((header) => (
          <div
            className={
              "cursor-default flex gap-1 justify-center items-center flex-nowrap text-nowrap font-normal"
            }
            onClick={() => {
              if (header?.type) handleOrdering(header?.type);
            }}
          >
            {header.title}
            <div
              className={
                "size-4 flex flex-col justify-center items-center gap-0"
              }
            >
              <FaAngleUp
                className={cn("p-0 size-4  mb-[-2px]", {
                  "text-primary-500": sort === "asc" && orderBy === header.type,
                })}
              />
              <FaAngleDown
                className={cn("p-0 size-4 mt-[-2px]", {
                  "text-primary-500":
                    sort === "desc" && orderBy === header.type,
                })}
              />
            </div>
          </div>
        )),
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
