import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { FaArrowUp } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { RiMoreFill } from "react-icons/ri";
import { formatDistance } from "date-fns";
import { useInterval, useUpdate } from "react-use";
import { ms } from "@/lib/utils/number";
import { useStrategyFeeChangeRequestStatus } from "@/hooks/b-app/strategy/use-strategy-fee-change-request";

export type StrategyFeeChangeRequestStatusIconProps = {
  strategyId: string;
};

type StrategyFeeChangeRequestStatusIconFC = FC<
  Omit<
    ComponentPropsWithoutRef<"div">,
    keyof StrategyFeeChangeRequestStatusIconProps
  > &
    StrategyFeeChangeRequestStatusIconProps
>;

export const StrategyFeeChangeRequestStatusIcon: StrategyFeeChangeRequestStatusIconFC =
  ({ className, strategyId, ...props }) => {
    const feeChangeRequest = useStrategyFeeChangeRequestStatus({
      strategyId: strategyId,
    });

    const shouldRerender =
      feeChangeRequest.hasRequested && !feeChangeRequest.isExpired;

    useInterval(useUpdate(), shouldRerender ? ms(1, "seconds") : null);

    if (feeChangeRequest.status === "none") return null;

    if (feeChangeRequest.status === "pending")
      return (
        <Tooltip
          asChild
          content={`Fee change pending, ${formatDistance(feeChangeRequest.periods.pending.end, Date.now())}`}
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
    if (feeChangeRequest.status === "executable")
      return (
        <Tooltip
          asChild
          content={`Fee change is now executable, expiring in ${formatDistance(
            feeChangeRequest.periods.execution.end,
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
            <FaArrowUp
              className="size-[0.5em]"
              strokeWidth="1"
              stroke="white"
            />
          </div>
        </Tooltip>
      );
    if (feeChangeRequest.status === "expired")
      return (
        <Tooltip asChild content="Your fee change request has expired">
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

StrategyFeeChangeRequestStatusIcon.displayName =
  "StrategyFeeChangeRequestStatusIcon";
