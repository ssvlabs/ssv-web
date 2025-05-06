/* eslint-disable react-hooks/rules-of-hooks */
import { GlobalNonSlashableAssetsTable } from "@/components/based-apps/global-non-slashable-assets-table/global-non-slashable-assets-table";
import { AssetLogo } from "@/components/ui/asset-logo";
import AssetName from "@/components/ui/asset-name";
import { Container } from "@/components/ui/container.tsx";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Text } from "@/components/ui/text";
import { useAccount } from "@/hooks/account/use-account";
import { useBAppsAssets } from "@/hooks/b-app/use-assets";
import { useGlobalNonSlashableAssets } from "@/hooks/b-app/use-global-non-slashable-assets";
import { useDataTable } from "@/hooks/data-table/use-data-table";
import { useBalanceOf } from "@/lib/contract-interactions/erc-20/read/use-balance-of";
import { useDecimals } from "@/lib/contract-interactions/erc-20/read/use-decimals";
import {
  compactFormatter,
  currencyFormatter,
  formatSSV,
} from "@/lib/utils/number";
import { isEthereumTokenAddress } from "@/lib/utils/token";
import type { FC } from "react";
import { useNavigate } from "react-router";
import { formatUnits } from "viem";
import { useBalance } from "wagmi";
import { cn } from "@/lib/utils/tw.ts";

export const Assets: FC = () => {
  const { assets, pagination, query } = useBAppsAssets();
  const globalNonSlashableAssets = useGlobalNonSlashableAssets();
  const navigate = useNavigate();
  const { table } = useDataTable({
    name: "assets-table",
    data: assets,
    columns: [
      {
        size: 262,
        id: "token",
        accessorKey: "token",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Depositable Assets" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2 ">
            <AssetLogo address={row.original.token} />
            <AssetName address={row.original.token} />
          </div>
        ),

        enableSorting: false,
      },
      {
        id: "balance",
        accessorKey: "balance",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Wallet Balance" />
        ),
        cell: ({ row }) => {
          const { address } = useAccount();
          const isEthereum = isEthereumTokenAddress(row.original.token);
          const ethBalance = useBalance({ address: address! });

          const decimals = useDecimals({ tokenAddress: row.original.token });
          const tokenBalance = useBalanceOf({
            tokenAddress: row.original.token,
            account: address!,
          });
          return isEthereum
            ? formatSSV(ethBalance.data?.value || 0n)
            : formatSSV(tokenBalance.data || 0n, decimals?.data || 18);
        },
        enableSorting: false,
      },
      {
        id: "depositedStrategies",
        accessorKey: "depositedStrategies",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            className="justify-end"
            title="Deposited Strategies"
          />
        ),
        cell: ({ row }) => {
          return (
            <div
              className={cn(
                "w-7 h-6 rounded-[4px] flex items-center justify-center text-[10px] border ml-[77%]",
                row.original.depositedStrategies
                  ? "bg-primary-50 border-primary-200 text-primary-600"
                  : "bg-gray-200 border-gray-300 text-gray-600",
              )}
            >
              {row.original.depositedStrategies}
            </div>
          );
        },
        enableSorting: true,
        sortDescFirst: true,
      },
      {
        id: "totalDepositsValue",
        accessorKey: "totalDepositsValue",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            className="justify-end w-[90%]"
            title="Total Deposited"
          />
        ),
        cell: ({ row }) => {
          const decimals = useDecimals({ tokenAddress: row.original.token });
          return (
            <Text variant="body-3-medium" className="mr-[18%] text-right">
              {compactFormatter.format(
                +formatUnits(
                  BigInt(row.original.totalDepositsValue || 0),
                  decimals.data || 18,
                ),
              )}
            </Text>
          );
        },
        enableSorting: true,
        sortDescFirst: true,
      },
      {
        id: "totalDepositsFiat",
        accessorKey: "totalDepositsFiat",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            className="justify-end text-right"
            title="Total Deposited Value"
          />
        ),
        cell: ({ row }) => {
          return (
            <Text variant="body-3-medium" className="text-right text-gray-500">
              {currencyFormatter.format(
                +(row?.original?.totalDepositsFiat || 0),
              )}
            </Text>
          );
        },
        enableSorting: false,
      },
    ],
    pageCount: pagination.pages,
    getRowId: (originalRow, index) => `${originalRow.token}-${index}`,
    shallow: false,
    clearOnDefault: true,
    meta: {
      total: pagination.total,
    },
  });

  return (
    <Container variant="vertical" size="xl" className="py-6">
      <div className="h-10 flex justify-between w-full items-center">
        <Text variant="body-1-semibold">Assets</Text>
      </div>
      <GlobalNonSlashableAssetsTable
        data={globalNonSlashableAssets.data}
        isLoading={globalNonSlashableAssets.isLoading}
        onRowClick={() => navigate("accounts")}
      />
      <DataTable
        table={table}
        onRowClick={(asset) => {
          navigate(`/account/strategies?token=${asset.token}`);
        }}
        isLoading={query.isLoading}
      />
    </Container>
  );
};

Assets.displayName = "Assets";
