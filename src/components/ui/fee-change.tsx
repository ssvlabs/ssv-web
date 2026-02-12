import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Text } from "@/components/ui/text";
import { formatBigintInput } from "@/lib/utils/number";
import { HiArrowNarrowRight } from "react-icons/hi";

export type FeeChangeProps = {
  previousFee: bigint;
  newFee: bigint;
  reversed?: boolean;
};

type FeeChangeFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof FeeChangeProps> & FeeChangeProps
>;

export const FeeChange: FeeChangeFC = ({
  className,
  previousFee,
  reversed,
  newFee,
  ...props
}) => {
  return (
    <div className={cn("flex gap-3 items-center", className)} {...props}>
      <Text variant="headline3">{formatBigintInput(previousFee)} SSV</Text>
      <HiArrowNarrowRight
        className={cn("text-primary-500 size-5", {
          "transform rotate-180": reversed,
          "text-error-500": reversed,
        })}
      />
      <Text variant="headline3">{formatBigintInput(newFee)} SSV</Text>
    </div>
  );
};

FeeChange.displayName = "FeeChange";
