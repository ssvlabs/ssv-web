import { OperatorAvatar } from "@/components/operator/operator-avatar";
import { CopyBtn } from "@/components/ui/copy-btn";
import { SsvExplorerBtn } from "@/components/ui/ssv-explorer-btn";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import type { Operator } from "@/types/api";
import type { ComponentPropsWithoutRef, FC, LegacyRef } from "react";
import { useEffect, useRef, useState } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip, useIsInsideTooltip } from "@/components/ui/tooltip.tsx";
import { FaPowerOff } from "react-icons/fa";
import VerifiedSVG from "@/assets/images/verified.svg?react";

export type OperatorDetailsProps = {
  operator: Pick<Operator, "id" | "name"> &
    Partial<
      Pick<
        Operator,
        "logo" | "is_private" | "id_str" | "is_deleted" | "verified_operator"
      >
    >;
  isShowExplorerLink?: boolean;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof OperatorDetailsProps> &
    OperatorDetailsProps
>;

export const OperatorDetails: FCProps = ({
  operator,
  className,
  isShowExplorerLink = true,
  ...props
}) => {
  const { ref, isInsideTooltip } = useIsInsideTooltip();
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (textRef.current) {
      const isOverflow =
        textRef.current.scrollWidth > textRef.current.offsetWidth;
      setIsOverflowing(isOverflow);
    }
  }, []);

  return (
    <div
      ref={ref as LegacyRef<HTMLDivElement>}
      className={cn(className, "flex items-center gap-3")}
      {...props}
    >
      <OperatorAvatar
        size="lg"
        src={operator.logo}
        isPrivate={operator.is_private}
      />
      <div className="flex flex-col h-full justify-between">
        <div className="flex gap-2 items-center">
          <Tooltip asChild content={isOverflowing ? operator.name : ""}>
            <Text
              ref={textRef}
              variant="body-2-medium"
              className="text-gray-800 w-[179px] whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {operator.name}
              {operator.verified_operator && !operator.is_deleted ? (
                <VerifiedSVG className="inline" />
              ) : null}
            </Text>
          </Tooltip>
          {operator.is_deleted ? (
            <div className="flex gap-2">
              <div className="size-5 rounded bg-error-100 flex items-center justify-center">
                <FaPowerOff className="size-3 text-error-500" />
              </div>
              {!isInsideTooltip && (
                <Tooltip
                  asChild
                  content="This operator has left the network permanently."
                >
                  <FaCircleInfo className="text-gray-400 size-3.5" />
                </Tooltip>
              )}
            </div>
          ) : (
            isShowExplorerLink && <SsvExplorerBtn operatorId={operator.id} />
          )}
        </div>
        <div className="flex gap-2 items-center">
          <Text variant="body-3-medium" className="text-gray-500">
            ID: {operator.id}
          </Text>
          {!isInsideTooltip && (
            <CopyBtn text={operator.id.toString()} className="text-gray-500" />
          )}
        </div>
      </div>
    </div>
  );
};

OperatorDetails.displayName = "OperatorDetails";
