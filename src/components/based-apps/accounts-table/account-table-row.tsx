import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useState } from "react";
import type { AccountMetadata, BAppAccount, Delegation } from "@/api/b-app.ts";
import { shortenAddress } from "@/lib/utils/strings.ts";
import {
  convertToPercentage,
  currencyFormatter,
  formatSSV,
} from "@/lib/utils/number.ts";
import { Text, textVariants } from "@/components/ui/text.tsx";
import { Button } from "@/components/ui/button.tsx";
import { AddressDisplay } from "@/components/ui/address";

export type AccountTableRowProps = {
  account: BAppAccount & AccountMetadata;
  showDepositButtonOnHover?: boolean;
  effectiveBalance?: number;
  onDelegateClick: (
    address: string,
    delegatedValue?: string,
    percentage?: string,
    metadata?: AccountMetadata,
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
        <AddressDisplay address={account.id} copyable />
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <div
          className={cn(
            "w-7 h-6 rounded-[4px] flex items-center justify-center text-[10px] border ml-[50%]",
            account.strategies
              ? "bg-primary-50 border-primary-200 text-primary-600"
              : "bg-gray-200 border-gray-300 text-gray-600",
          )}
        >
          {account.strategies}
        </div>
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <div className={cn("ml-[60%]")}>{account.totalDelegators}</div>
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <div className="flex gap-2">
          {formatSSV(account.totalDelegatedValue || 0n)}
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
                {
                  name: account.name,
                  logo: account.logo,
                },
              )
            }
          >
            {receiver ? "Update" : "Delegate"}
          </Button>
        ) : (
          currencyFormatter.format(Number(account.totalDelegatedFiat) || 0)
        )}
      </TableCell>
    </TableRow>
  );
};

AccountTableRow.displayName = "AccountTableRow";
