import { Text } from "@/components/ui/text";
import { useRates } from "@/hooks/use-rates";
import { formatSSV } from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { formatEther } from "viem";

type CustomDisplayProps = {
  formatted: string;
  symbol: string;
  usd: string;
};
export type BalanceDisplayProps = {
  amount: bigint;
  token: "ETH" | "SSV";
  custom?: FC<CustomDisplayProps>;
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

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
  compactDisplay: "short",
});

export const BalanceDisplay: FC<BalanceDisplayProps> = ({
  amount,
  token,
  className,
  custom,
  ...props
}) => {
  const rates = useRates();
  const usd =
    (rates.data?.[
      token.toLowerCase() as Lowercase<BalanceDisplayProps["token"]>
    ] ?? 0) * +formatEther(BigInt(amount));
  const formattedUSD = usdFormatter.format(usd);

  if (custom)
    return custom({
      formatted: formatAmount(amount),
      symbol: token,
      usd: formattedUSD,
    });
  return (
    <div className={cn("flex items-start gap-2", className)} {...props}>
      <img src={getTokenIcon(token)} className="size-7" alt={token} />
      <div className="flex flex-col gap-0.5">
        <Text variant="headline4">
          {formatAmount(amount)} {token}
        </Text>
        <Text variant="body-3-medium" className="text-gray-500">
          {formattedUSD}
        </Text>
      </div>
    </div>
  );
};

BalanceDisplay.displayName = "BalanceDisplay";
