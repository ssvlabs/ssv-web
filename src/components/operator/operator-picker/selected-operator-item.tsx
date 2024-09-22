import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import type { Operator } from "@/types/api";
import { OperatorAvatar } from "@/components/operator/operator-avatar";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Minus } from "lucide-react";
import { formatSSV } from "@/lib/utils/number";
import { getYearlyFee } from "@/lib/utils/operator";
import VerifiedSVG from "@/assets/images/verified.svg?react";

export type SelectedOperatorItemProps = {
  operator: Operator;
  onRemoveOperator: (operator: Operator) => void;
};

type SelectedOperatorItemFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof SelectedOperatorItemProps> &
    SelectedOperatorItemProps
>;

export const SelectedOperatorItem: SelectedOperatorItemFC = ({
  operator,
  className,
  onRemoveOperator,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative px-5 py-4 rounded-lg border border-gray-300",
        className,
      )}
      {...props}
    >
      <div className="flex w-full items-center gap-2">
        <OperatorAvatar
          size="md"
          src={operator.logo}
          isPrivate={operator.is_private}
        />
        <div className="flex flex-1 flex-col gap-0.5">
          <div className="flex w-full justify-between">
            <Text
              className="flex-1 text-ellipsis overflow-hidden"
              title={operator.name}
              variant="body-3-medium"
            >
              {operator.name}{" "}
              {operator.verified_operator && <VerifiedSVG className="inline" />}
            </Text>
            <Text title={operator.name} variant="body-3-medium">
              {formatSSV(getYearlyFee(BigInt(operator.fee)))} SSV
            </Text>
          </div>
          <Text variant="caption-medium" className="text-gray-500">
            ID: {operator.id}
          </Text>
        </div>
      </div>
      <Button
        variant="subtle"
        size="icon"
        className="absolute -top-2 -right-2 rounded-full size-6 bg-gray-400 text-gray-50"
        onClick={() => onRemoveOperator(operator)}
      >
        <Minus className="size-4" />
      </Button>
    </div>
  );
};

SelectedOperatorItem.displayName = "SelectedOperatorItem";
