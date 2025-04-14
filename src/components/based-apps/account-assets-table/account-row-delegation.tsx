import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { textVariants } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import { Link } from "react-router-dom";
import { currencyFormatter, formatSSV } from "@/lib/utils/number";
import type { AccountAsset } from "@/hooks/b-app/use-account-assets";
import { useStrategyAssetWithdrawalRequest } from "@/hooks/b-app/use-asset-withdrawal-request";

type DelegationRowProps = {
  delegation: NonNullable<AccountAsset["slashableAsset"]>["deposits"][0];
  asset: AccountAsset;
  className?: string;
  onWithdrawClick?: (strategyId: string) => void;
};

export const DelegationRow = ({
  delegation,
  asset,
  className,
  onWithdrawClick,
}: DelegationRowProps) => {
  const request = useStrategyAssetWithdrawalRequest({
    strategyId: delegation.strategyId,
    asset: asset.token,
  });

  console.log("request:", request);
  return (
    <TableRow
      className={cn(
        "cursor-pointer max-h-7 bg-gray-100 hover:bg-gray-100",
        className,
      )}
    >
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <Button
          variant="link"
          size="sm"
          as={Link}
          className="px-2"
          to={`/account/strategies/${delegation.strategyId}`}
        >
          {delegation.name || `Strategy ${delegation.strategyId}`}
        </Button>
      </TableCell>
      <TableCell
        className={textVariants({ variant: "body-3-medium" })}
      ></TableCell>
      <TableCell
        className={textVariants({ variant: "body-3-medium" })}
      ></TableCell>
      <TableCell
        className={textVariants({
          variant: "body-3-medium",
          className: "text-right",
        })}
      >
        {formatSSV(BigInt(delegation.depositAmount), asset.tokenInfo.decimals)}
      </TableCell>
      <TableCell
        className={textVariants({
          variant: "body-3-medium",
          className: "text-right text-gray-500",
        })}
      >
        {currencyFormatter.format(+delegation.fiatDepositAmount)}
      </TableCell>
      <TableCell
        className={textVariants({
          variant: "body-3-medium",
          className: "w-5",
        })}
      >
        <Button
          size="sm"
          onClick={(ev) => {
            ev.stopPropagation();
            onWithdrawClick?.(delegation.strategyId);
          }}
        >
          Withdraw
        </Button>
      </TableCell>
    </TableRow>
  );
};
