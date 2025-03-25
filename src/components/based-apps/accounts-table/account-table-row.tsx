import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useState } from "react";
import type { AccountMetadata, BAppAccount, Delegation } from "@/api/b-app.ts";
import { shortenAddress } from "@/lib/utils/strings.ts";
import { convertToPercentage, formatSSV } from "@/lib/utils/number.ts";
import { Text, textVariants } from "@/components/ui/text.tsx";
import { Button } from "@/components/ui/button.tsx";

export type AccountTableRowProps = {
  account: BAppAccount & AccountMetadata;
  showDepositButtonOnHover?: boolean;
  effectiveBalance?: number;
  onDelegateClick: (
    address: string,
    delegatedValue?: string,
    percentage?: string,
  ) => void;
  accountDelegations?: Delegation[];
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof TableRow>, keyof AccountTableRowProps> &
    AccountTableRowProps
>;

export const AccountTableRow: FCProps = ({
  account,
  className,
  onDelegateClick,
  accountDelegations,
  effectiveBalance,
  ...props
}) => {
  const [showBtn, setShowBtn] = useState(false);

  const receiver = accountDelegations?.filter(
    (delegation: Delegation) => delegation.receiver.id === account.id,
  )[0];
  return (
    <TableRow
      key={account.id}
      className={cn("cursor-pointer max-h-7 group", className)}
      onMouseEnter={() => setShowBtn(true)}
      onMouseLeave={() => setShowBtn(false)}
      {...props}
    >
      <TableCell
        className={`${textVariants({ variant: "body-3-medium" })} flex items-center gap-2 `}
      >
        <img
          className="rounded-[8px] size-7 border-gray-400 border"
          src={account?.logo || "/images/operator_default_background/light.svg"}
          onError={(e) => {
            e.currentTarget.src =
              "/images/operator_default_background/light.svg";
          }}
        />
        {account.name || shortenAddress(account.id)}
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {shortenAddress(account.id)}
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <div className="w-7 h-6 rounded-[4px] bg-primary-100 border border-primary-500 text-primary-500 flex items-center justify-center text-[10px]">
          {account.strategies}
        </div>
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <div className="w-7 h-6 rounded-[4px] bg-primary-100 border border-primary-500 text-primary-500 flex items-center justify-center text-[10px]">
          {account.bApps}
        </div>
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <div className="w-7 h-6 rounded-[4px] bg-primary-100 border border-primary-500 text-primary-500 flex items-center justify-center text-[10px]">
          {account.delegators}
        </div>
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <div className="flex gap-2">
          {formatSSV(account.totalDelegated || 0n, 9)}
          <img
            className={"h-[24px] w-[15px]"}
            src={`/images/balance-validator/balance-validator.svg`}
          />
          <Text className="text-gray-500 font-medium">ETH</Text>
        </div>
      </TableCell>
      <TableCell
        className={`p-0 ${textVariants({ variant: "body-3-medium" })}`}
      >
        {showBtn ? (
          <Button
            onClick={() =>
              onDelegateClick(
                account.id,
                (
                  (convertToPercentage(receiver?.percentage || 0) *
                    (effectiveBalance || 0)) /
                  100
                ).toFixed(4),
                receiver?.percentage,
              )
            }
          >
            {receiver ? "Update" : "Delegate"}
          </Button>
        ) : (
          account.totalDelegatedValue
        )}
      </TableCell>
    </TableRow>
  );
};

AccountTableRow.displayName = "AccountTableRow";
