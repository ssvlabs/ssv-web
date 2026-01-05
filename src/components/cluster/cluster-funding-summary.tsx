import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import type { UseFundingCostArgs } from "@/hooks/use-compute-funding-cost";
import { useFundingCost } from "@/hooks/use-compute-funding-cost";
import { Text } from "@/components/ui/text";
import { formatSSV } from "@/lib/utils/number";
import { Divider } from "@/components/ui/divider";
import { Spinner } from "@/components/ui/spinner";
import { humanizeFundingDuration } from "@/lib/utils/date";

export type ClusterFundingSummaryProps = UseFundingCostArgs;

type ClusterFundingSummaryFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof ClusterFundingSummaryProps> &
    ClusterFundingSummaryProps
>;

export const ClusterFundingSummary: ClusterFundingSummaryFC = ({
  validatorsAmount,
  fundingDays,
  operators,
  effectiveBalance,
  className,
  ...props
}) => {
  // const isBulk = validatorsAmount > 1;
  const cost = useFundingCost({
    operators,
    validatorsAmount,
    fundingDays,
    effectiveBalance,
  });

  if (cost.isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner />
      </div>
    );
  }

  // const renderSingular = () => (
  //   <div className={cn("space-y-2")}>
  //     <Text variant="body-3-semibold" className="text-gray-500">
  //       Funding Summary{" "}
  //       {fundingDays > 1 ? `(${humanizeFundingDuration(fundingDays)})` : ""}
  //     </Text>
  //     <div className="flex justify-between">
  //       <Text variant="body-2-medium">Operators Fee</Text>
  //       <Text variant="body-2-medium">
  //         {formatSSV(cost.data?.subtotal.operatorsCost ?? 0n)} ETH
  //       </Text>
  //     </div>
  //     <div className="flex justify-between">
  //       <Text variant="body-2-medium">Network Fee</Text>
  //       <Text variant="body-2-medium">
  //         {formatSSV(cost.data?.subtotal.networkCost ?? 0n)} ETH
  //       </Text>
  //     </div>
  //     <div className="flex justify-between">
  //       <Text variant="body-2-medium">Liquidation Collateral</Text>
  //       <Text variant="body-2-medium">
  //         {formatSSV(cost.data?.subtotal.liquidationCollateral ?? 0n)} ETH
  //       </Text>
  //     </div>
  //   </div>
  // );

  const renderBulk = () => (
    <div
      className={cn("grid gap-2 gap-x-8")}
      style={{ gridTemplateColumns: "1fr auto auto auto" }}
    >
      <Text variant="body-3-semibold" className="text-gray-500">
        Funding Summary
      </Text>
      <Text variant="body-3-semibold" className="text-gray-500 text-end">
        Fee {fundingDays > 1 ? `(${humanizeFundingDuration(fundingDays)})` : ""}
      </Text>
      <Text variant="body-3-semibold" className="text-gray-500 text-end">
        Effective Balance
      </Text>
      <Text variant="body-3-semibold" className="text-gray-500 text-end">
        Subtotal
      </Text>
      <Text variant="body-2-medium">Operators Fee</Text>
      <Text variant="body-2-medium" className="text-end">
        {formatSSV(cost.data?.perValidator.operatorsCost ?? 0n)} ETH
      </Text>
      <Text variant="body-2-medium" className="text-end">
        {effectiveBalance ? Number(effectiveBalance) : "-"}
      </Text>
      <Text variant="body-2-medium" className="text-end">
        {formatSSV(cost.data?.subtotal.operatorsCost ?? 0n)} ETH
      </Text>
      <Text variant="body-2-medium">Network Fee</Text>
      <Text variant="body-2-medium" className="text-end">
        {formatSSV(cost.data?.perValidator.networkCost ?? 0n)} ETH
      </Text>
      <Text variant="body-2-medium" className="text-end">
        {effectiveBalance ? Number(effectiveBalance) : "-"}
      </Text>
      <Text variant="body-2-medium" className="text-end">
        {formatSSV(cost.data?.subtotal.networkCost ?? 0n)} ETH
      </Text>
      <Text variant="body-2-medium">Liquidation Collateral</Text>
      <Text variant="body-2-medium" className="text-end">
        {formatSSV(cost.data?.perValidator.liquidationCollateral ?? 0n)} ETH
      </Text>
      <Text variant="body-2-medium" className="text-end">
        {effectiveBalance ? Number(effectiveBalance) : "-"}
      </Text>
      <Text variant="body-2-medium" className="text-end">
        {formatSSV(cost.data?.subtotal.liquidationCollateral ?? 0n)} ETH
      </Text>
    </div>
  );

  return (
    <>
      <div className={cn(className, "font-medium")} {...props}>
        {renderBulk()}
      </div>
      <Divider />
      <div className="flex justify-between">
        <Text variant="body-2-medium">Total</Text>
        <Text variant="body-2-medium">
          {formatSSV(cost.data?.total ?? 0n)} ETH
        </Text>
      </div>
    </>
  );
};

ClusterFundingSummary.displayName = "ClusterFundingSummary";
