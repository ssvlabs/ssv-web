import { Text } from "@/components/ui/text";
import { formatSSV } from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";

export type BalanceDisplayProps = {
  amount: string | bigint;
  token: "ETH" | "SSV";
} & ComponentPropsWithoutRef<"div">;

const getTokenIcon = (token: "ETH" | "SSV") => {
  if (token === "ETH") {
    return "/images/networks/dark.svg";
  }
  return "/images/ssvIcons/icon.svg";
};

const formatAmount = (amount: string | bigint) => {
  if (typeof amount === "bigint") {
    return formatSSV(amount);
  }
  return amount;
};

const getUsdPlaceholder = () => {
  // Placeholder USD calculation - will be replaced with actual calculation later
  return "~$0.0";
};

export const BalanceDisplay: FC<BalanceDisplayProps> = ({
  amount,
  token,
  className,
  ...props
}) => {
  return (
    <div className={cn("flex items-start gap-2", className)} {...props}>
      <img src={getTokenIcon(token)} className="size-7" alt={token} />
      <div className="flex flex-col gap-0.5">
        <Text variant="headline4">
          {formatAmount(amount)} {token}
        </Text>
        <Text variant="body-3-medium" className="text-gray-500">
          {getUsdPlaceholder()}
        </Text>
      </div>
    </div>
  );
};

BalanceDisplay.displayName = "BalanceDisplay";
