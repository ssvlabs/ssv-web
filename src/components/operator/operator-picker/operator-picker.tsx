import { OperatorPickerItem } from "@/components/operator/operator-picker/operator-picker-item/operator-picker-item";
import { useSearchOperators } from "@/hooks/use-search-operators";
import type { FC } from "react";
import { VList, VListProps } from "virtua";

export type OperatorPickerProps = {
  selectedOperatorIds: number[];
  onOperatorCheckedChange: (operatorId: number, checked: boolean) => void;
  maxSelection?: number;
};

type FCProps = FC<Omit<VListProps, "children"> & OperatorPickerProps>;

export const OperatorPicker: FCProps = ({
  selectedOperatorIds,
  onOperatorCheckedChange,
  maxSelection,
  ...props
}) => {
  const infiniteQuery = useSearchOperators();
  const isMaxSelected = selectedOperatorIds.length === maxSelection;

  return (
    <VList
      className="flex-1"
      {...props}
      onRangeChange={async (_, end) => {
        const page = infiniteQuery.data?.pages.at(-1);
        if (!page || infiniteQuery.isFetching) return;
        const last = page.pagination.page * page.pagination.per_page;
        if (end + page.pagination.per_page * 0.5 > last) {
          infiniteQuery.fetchNextPage();
        }
      }}
    >
      {infiniteQuery.data?.pages.map((page) =>
        page.operators.map((operator) => {
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
        }),
      )}
      {infiniteQuery.isFetchingNextPage && <div>Loading...</div>}
      {!infiniteQuery.hasNextPage && !infiniteQuery.isSuccess && (
        <div>The end...</div>
      )}
    </VList>
  );
};

OperatorPicker.displayName = "OperatorPicker";
