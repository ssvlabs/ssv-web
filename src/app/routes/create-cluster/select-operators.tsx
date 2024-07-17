import { OperatorPickerFilter } from "@/components/operator/operator-picker-filter/operator-picker-filter";
import { OperatorPicker } from "@/components/operator/operator-picker/operator-picker";
import { cn } from "@/lib/utils/tw";
import { xor } from "lodash-es";
import { useState, type ComponentPropsWithoutRef, type FC } from "react";

export type SelectOperatorsProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof SelectOperatorsProps> &
    SelectOperatorsProps
>;

export const SelectOperators: FCProps = ({ className, ...props }) => {
  const [selectedOperatorIds, setSelectedOperatorIds] = useState<number[]>([]);
  return (
    <div className={cn(className, "flex flex-col h-full")} {...props}>
      <OperatorPickerFilter />
      <OperatorPicker
        maxSelection={5}
        className="flex-1"
        selectedOperatorIds={selectedOperatorIds}
        onOperatorCheckedChange={(id) => {
          setSelectedOperatorIds(xor(selectedOperatorIds, [id]));
        }}
      />
    </div>
  );
};

SelectOperators.displayName = "SelectOperators";
