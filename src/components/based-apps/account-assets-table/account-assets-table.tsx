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
import { Loading } from "@/components/ui/Loading.tsx";
import { AccountAssetsTableRow } from "@/components/based-apps/account-assets-table/account-assets-table-row";
import type { AccountAsset } from "@/hooks/b-app/use-account-assets";
import { Text } from "@/components/ui/text.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import type { Address } from "abitype";

export type AccountAssetsTableProps = {
  assets: AccountAsset[];
  pagination: IPagination;
  isLoading?: boolean;
  onRowClick?: (asset: AccountAsset) => void;
  onWithdrawClick?: (props: { strategyId: string; asset: Address }) => void;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof Table>, keyof AccountAssetsTableProps> &
    AccountAssetsTableProps
>;

export const AccountAssetsTable: FCProps = ({
  assets,
  pagination,
  className,
  isLoading,
  onRowClick,
  onWithdrawClick,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      <Table
        className={cn(className, "w-full rounded-t-xl overflow-hidden")}
        {...props}
      >
        <TableHeader>
          <TableHead className="w-[26%]">Assets</TableHead>
          <TableHead className="w-[16%]">Wallet Balance</TableHead>
          <TableHead className="text-right w-[18%]">
            Delegated Strategies
          </TableHead>
          <TableHead className="text-right w-[18%]">Delegated</TableHead>
          <TableHead className="text-right w-[18%]">
            Total Delegated Value
          </TableHead>
          <TableHead className="w-[52px] p-0"></TableHead>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => {
            return (
              <AccountAssetsTableRow
                key={asset.token}
                asset={asset}
                onClick={() => {
                  onRowClick?.(asset);
                }}
                onWithdrawClick={(strategyId) => {
                  onWithdrawClick?.({
                    strategyId,
                    asset: asset.token,
                  });
                }}
              />
            );
          })}
        </TableBody>
      </Table>
      <div className="bg-gray-50 w-full">{isLoading && <Loading />}</div>
      {!assets.length && !isLoading && (
        <div className="bg-gray-50 w-full h-[200px] flex flex-col items-center gap-4 justify-center">
          <Text variant="body-3-medium">
            You don't have any assets in your wallet
          </Text>
          <Button as={Link} to={"/account/strategies"}>
            Explore Strategies
          </Button>
        </div>
      )}
      {pagination.pages > 1 ? (
        <>
          <Divider />
          <div className="flex w-full bg-gray-50 py-4 rounded-b-2xl">
            <Pagination pagination={pagination} />
          </div>
        </>
      ) : (
        <div className="flex w-full bg-gray-50 py-2 rounded-b-2xl"></div>
      )}
    </div>
  );
};

AccountAssetsTable.displayName = "AccountAssetsTable";
