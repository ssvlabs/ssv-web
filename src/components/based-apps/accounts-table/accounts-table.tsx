import type { FC, ComponentPropsWithoutRef } from "react";
import type { Pagination as IPagination } from "@/types/api";
import {
  TableHeader,
  TableHead,
  TableBody,
  Table,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/tw";
import { Pagination } from "@/components/ui/pagination-v2";
import { Divider } from "@/components/ui/divider";
import type { AccountMetadata, BAppAccount, Delegation } from "@/api/b-app.ts";
import { Loading } from "@/components/ui/Loading.tsx";
import { AccountTableRow } from "@/components/based-apps/accounts-table/account-table-row.tsx";

export type AccountsTableProps = {
  accounts: (BAppAccount & AccountMetadata)[];
  pagination?: IPagination;
  isLoading?: boolean;
  effectiveBalance?: number;
  accountDelegations?: Delegation[];
  showDepositButtonOnHover?: boolean;
  onDelegateClick: (
    address: string,
    delegatedValue?: string,
    percentage?: string,
  ) => void;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof Table>, keyof AccountsTableProps> &
    AccountsTableProps
>;

export const AccountsTable: FCProps = ({
  accounts,
  pagination,
  className,
  isLoading,
  effectiveBalance,
  onDelegateClick,
  accountDelegations,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      <Table
        className={cn(className, "w-full rounded-t-xl overflow-hidden")}
        {...props}
      >
        <TableHeader>
          <TableHead>Account Name</TableHead>
          <TableHead>Account Address</TableHead>
          <TableHead>Strategies</TableHead>
          <TableHead>Delegators</TableHead>
          <TableHead>Total Delegated</TableHead>
          <TableHead>Total Delegated Value</TableHead>
        </TableHeader>
        <TableBody>
          {accounts?.map((account) => {
            return (
              <AccountTableRow
                effectiveBalance={effectiveBalance}
                accountDelegations={accountDelegations}
                onDelegateClick={onDelegateClick}
                account={account}
              />
            );
          })}
        </TableBody>
      </Table>
      <div className="bg-gray-50 w-full">{isLoading && <Loading />}</div>
      {pagination && pagination.total > 10 ? (
        <>
          <Divider />
          <div className="flex w-full bg-gray-50 py-4 rounded-b-2xl">
            <Pagination pagination={pagination} />
          </div>
        </>
      ) : (
        <div className="flex w-full bg-gray-50 py-4 rounded-b-2xl"></div>
      )}
    </div>
  );
};

AccountsTable.displayName = "AccountsTable";
