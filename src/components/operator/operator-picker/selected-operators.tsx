import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Text } from "@/components/ui/text";
import type { Operator } from "@/types/api";
import { SelectedOperatorItem } from "@/components/operator/operator-picker/selected-operator-item";
import { SelectedOperatorPlaceholder } from "@/components/operator/operator-picker/selected-operator-placholder";

export type SelectedOperatorsProps = {
  clusterSize: number;
  selectedOperators: Operator[];
  onRemoveOperator: (operator: Operator) => void;
};

type SelectedOperatorsFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof SelectedOperatorsProps> &
    SelectedOperatorsProps
>;

export const SelectedOperators: SelectedOperatorsFC = ({
  className,
  onRemoveOperator,
  selectedOperators,
  clusterSize,
  ...props
}) => {
  return (
    <div className={cn(className, "space-y-6")} {...props}>
      <div className="flex justify-between items-center">
        <Text variant="headline4">Selected Operators</Text>
        <Text variant="headline4" className="text-primary-500">
          {selectedOperators.length}/{clusterSize}
        </Text>
      </div>
      <div className="flex flex-col gap-3 max-h-[400px] pt-2 overflow-auto">
        {selectedOperators.map((operator) => (
          <SelectedOperatorItem
            className="mr-2"
            key={operator.public_key}
            operator={operator}
            onRemoveOperator={onRemoveOperator}
          />
        ))}
        {new Array(clusterSize - selectedOperators.length)
          .fill(0)
          .map((_, index) => (
            <SelectedOperatorPlaceholder
              key={index}
              number={selectedOperators.length + index + 1}
            />
          ))}
      </div>
    </div>
  );
};

SelectedOperators.displayName = "SelectedOperators";
