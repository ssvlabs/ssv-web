import { Text } from "@/components/ui/text";
import { useRates } from "@/hooks/use-rates";
import { currencyFormatter, formatSSV } from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { formatEther } from "viem";

export type BalanceDisplayProps = {
  amount: bigint;
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

export const BalanceDisplay: FC<BalanceDisplayProps> = ({
  amount,
  token,
  className,
  ...props
}) => {
  const rates = useRates();
  const formattedAmount = formatEther(BigInt(amount));
  const usd = currencyFormatter.format(
    (rates.data?.[
      token.toLowerCase() as Lowercase<BalanceDisplayProps["token"]>
    ] ?? 0) * +formattedAmount,
  );
  return (
    <div className={cn("flex items-start gap-2", className)} {...props}>
      <img src={getTokenIcon(token)} className="size-7" alt={token} />
      <div className="flex flex-col gap-0.5">
        <Text variant="headline4">
          {formatAmount(amount)} {token}
        </Text>
        <Text variant="body-3-medium" className="text-gray-500">
          {usd}
        </Text>
      </div>
    </div>
  );
};

BalanceDisplay.displayName = "BalanceDisplay";
