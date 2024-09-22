import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Text } from "@/components/ui/text";
import { globals } from "@/config";
import { Button } from "@/components/ui/button";

export type ClusterSize =
  (typeof globals.CLUSTER_SIZES)[keyof typeof globals.CLUSTER_SIZES];

export type OperatorClusterSizePickerProps = {
  value: ClusterSize;
  onChange: (value: ClusterSize) => void;
};

type OperatorClusterSizePickerFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof OperatorClusterSizePickerProps> &
    OperatorClusterSizePickerProps
>;

export const OperatorClusterSizePicker: OperatorClusterSizePickerFC = ({
  className,
  value,
  onChange,
  ...props
}) => {
  return (
    <div className={cn("flex items-center gap-2 w-full", className)} {...props}>
      <Text variant="body-2-bold" className="text-gray-500">
        Cluster Size
      </Text>
      <div className="flex flex-1 gap-2 [&>*]:flex-1">
        {Object.values(globals.CLUSTER_SIZES).map((size) => (
          <Button
            key={size}
            variant={value === size ? "secondary" : "outline"}
            className={cn({
              "border border-primary-300": value === size,
            })}
            onClick={() => onChange(size)}
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  );
};

OperatorClusterSizePicker.displayName = "OperatorClusterSizePicker";
