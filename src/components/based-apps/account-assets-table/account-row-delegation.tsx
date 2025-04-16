import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { textVariants } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import { Link } from "react-router-dom";
import { currencyFormatter, formatSSV } from "@/lib/utils/number";
import type { AccountAsset } from "@/hooks/b-app/use-account-assets";
import { WithdrawalRequestStatusIcon } from "@/components/ui/withdrawal-request-status-icon";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { Tooltip } from "@/components/ui/tooltip";
import { useStrategyAssetWithdrawFeatureFlag } from "@/hooks/feature-flags/use-withdraw-feature-flag";

type DelegationRowProps = {
  delegation: NonNullable<AccountAsset["slashableAsset"]>["deposits"][0];
  asset: AccountAsset;
  className?: string;
  onWithdrawClick?: (strategyId: string) => void;
  onDelegateClick?: (strategyId: string) => void;
};

export const DelegationRow = ({
  delegation,
  asset,
  className,
  onWithdrawClick,
  onDelegateClick,
}: DelegationRowProps) => {
  const withdrawFeatureFlag = useStrategyAssetWithdrawFeatureFlag();
  return (
    <TableRow
      className={cn(
        "group  cursor-pointer max-h-7 bg-gray-100 hover:bg-gray-100",
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
          className: "text-right text-gray-500 relative",
        })}
      >
        {currencyFormatter.format(+delegation.fiatDepositAmount)}
        {withdrawFeatureFlag.enabled && (
          <div className="gap-1 items-center absolute top-1/2 -translate-y-1/2 right-0 mr-7 hidden group-hover:flex">
            <Tooltip content="Delegate" asChild>
              <Button
                className="w-12 h-8"
                variant="secondary"
                onClick={(ev) => {
                  ev.stopPropagation();
                  onDelegateClick?.(delegation.strategyId);
                }}
              >
                <FaArrowDown />
              </Button>
            </Tooltip>
            <Tooltip content="Withdraw" asChild>
              <Button
                className="w-12 h-8"
                variant="secondary"
                onClick={(ev) => {
                  ev.stopPropagation();
                  onWithdrawClick?.(delegation.strategyId);
                }}
              >
                <FaArrowUp />
              </Button>
            </Tooltip>
          </div>
        )}
      </TableCell>
      <TableCell
        className={textVariants({
          className: "w-[52px] flex items-center justify-center p-0",
        })}
      >
        {withdrawFeatureFlag.enabled && (
          // <IconButton className="bg-transparent">
          <WithdrawalRequestStatusIcon
            strategyId={delegation.strategyId}
            asset={asset.token}
            className="text-base"
            onClick={(ev) => {
              ev.stopPropagation();
              onWithdrawClick?.(delegation.strategyId);
            }}
          />
          // </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
};
