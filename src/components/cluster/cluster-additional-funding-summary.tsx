import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Text } from "@/components/ui/text";
import { formatSSV } from "@/lib/utils/number";
import { Divider } from "@/components/ui/divider";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard";

type ClusterAdditionalFundingSummaryFC = FC<ComponentPropsWithoutRef<"div">>;

export const ClusterAdditionalFundingSummary: ClusterAdditionalFundingSummaryFC =
  ({ className, ...props }) => {
    const { depositAmount } = useRegisterValidatorContext();
    return (
      <>
        <div className={cn(className, "font-medium")} {...props}>
          <div className={cn("space-y-2")}>
            <Text variant="body-3-semibold" className="text-gray-500">
              Transaction Summary
            </Text>
            <div className="flex justify-between items-center">
              <Text variant="body-2-medium">SSV Deposit</Text>
              <Text variant="body-2-medium">
                {formatSSV(depositAmount ?? 0n)} SSV
              </Text>
            </div>
          </div>
        </div>
        <Divider />
        <div className="flex justify-between items-center">
          <Text variant="body-2-medium">Total</Text>
          <Text variant="body-1-bold">
            {formatSSV(depositAmount ?? 0n)} SSV
          </Text>
        </div>
      </>
    );
  };

ClusterAdditionalFundingSummary.displayName = "ClusterAdditionalFundingSummary";
