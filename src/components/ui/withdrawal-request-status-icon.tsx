import { Tooltip } from "@/components/ui/tooltip";
import { useStrategyAssetWithdrawalRequest } from "@/hooks/b-app/use-asset-withdrawal-request";
import { cn } from "@/lib/utils/tw";
import type { Address } from "abitype";
import type { ComponentPropsWithoutRef, FC } from "react";
import { FaArrowUp } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { RiMoreFill } from "react-icons/ri";
import { formatDistance } from "date-fns";
import { useInterval, useUpdate } from "react-use";
import { ms } from "@/lib/utils/number";

export type WithdrawalRequestStatusIconProps = {
  strategyId: string;
  asset: Address;
};

type WithdrawalRequestStatusIconFC = FC<
  Omit<
    ComponentPropsWithoutRef<"div">,
    keyof WithdrawalRequestStatusIconProps
  > &
    WithdrawalRequestStatusIconProps
>;

export const WithdrawalRequestStatusIcon: WithdrawalRequestStatusIconFC = ({
  className,
  strategyId,
  asset,
  ...props
}) => {
  const withdrawalRequest = useStrategyAssetWithdrawalRequest({
    strategyId: strategyId,
    asset: asset,
  });

  const shouldRerender =
    withdrawalRequest.hasRequested && !withdrawalRequest.isExpired;

  useInterval(useUpdate(), shouldRerender ? ms(1, "seconds") : null);

  if (withdrawalRequest.status === "none") return null;

  if (withdrawalRequest.status === "pending")
    return (
      <Tooltip
        asChild
        content={`Withdrawal pending, ${formatDistance(withdrawalRequest.periods.pending.end, Date.now())}`}
      >
        <div
          className={cn(
            "flex items-center justify-center text-base size-[1em] border-[2px] text-orange-300 border-orange-500 rounded-full",
            className,
          )}
          {...props}
        >
          <RiMoreFill className="size-[0.75em]" strokeWidth="1" />
        </div>
      </Tooltip>
    );
  if (withdrawalRequest.status === "withdrawable")
    return (
      <Tooltip
        asChild
        content={`Withdrawal is now executable, expiring in ${formatDistance(
          withdrawalRequest.periods.execution.end,
          Date.now(),
        )}`}
      >
        <div
          className={cn(
            "flex items-center justify-center text-base size-[1em] border-[2px] text-[#fff] bg-success-500 border-success-700 rounded-full",
            className,
          )}
          {...props}
        >
          <FaArrowUp className="size-[0.5em]" strokeWidth="1" stroke="white" />
        </div>
      </Tooltip>
    );
  if (withdrawalRequest.status === "expired")
    return (
      <Tooltip asChild content="Your withdrawal period has expired">
        <div
          className={cn(
            "flex items-center justify-center text-base size-[1em]  text-white bg-gray-500 rounded-full",
            className,
          )}
          {...props}
        >
          <FaXmark className="size-[0.68em]" />
        </div>
      </Tooltip>
    );
};

WithdrawalRequestStatusIcon.displayName = "WithdrawalRequestStatusIcon";
