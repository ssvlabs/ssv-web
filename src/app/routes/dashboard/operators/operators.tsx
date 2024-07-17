import { OperatorPicker } from "@/components/operator/operator-picker/operator-picker";
import { cn } from "@/lib/utils/tw";
import { xor } from "lodash-es";
import { useState, type ComponentPropsWithoutRef, type FC } from "react";

export const Operators: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const [selectedOperatorIds, setSelectedOperatorIds] = useState<number[]>([]);
  console.log("selectedOperatorIds:", selectedOperatorIds);
  return (
    <div className={cn(className, "flex flex-col h-full")} {...props}>
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

Operators.displayName = "Operators";
