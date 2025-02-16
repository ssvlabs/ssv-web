import AssetsTable from "@/app/routes/dashboard/b-app/my-account/assets-table.tsx";
import { Text } from "@/components/ui/text.tsx";
import { CopyBtn } from "@/components/ui/copy-btn.tsx";
import { currencyFormatter, ethFormatter } from "@/lib/utils/number.ts";
import { useBAppAccounts } from "@/hooks/b-app/use-b-app-accounts.ts";
import { shortenAddress } from "@/lib/utils/strings.ts";
import { formatUnits } from "viem";
import type { BAppAccount } from "@/api/b-app.ts";

const headers = [
  {
    label: "Account Name",
    size: 218,
  },
  {
    label: "Account Address",
    size: 177,
  },
  {
    label: "Strategies",
    textAlign: "flex items-center justify-end",
    size: 174,
  },
  {
    label: "BApps",
    size: 174,
  },
  {
    label: "Delegators",
    textAlign: "flex items-center justify-end",
    size: 174,
  },
  {
    label: "Total Delegated",
    textAlign: "text-right",
    size: 218,
  },
  {
    label: "Total Delegated Value",
    textAlign: "text-right",
    size: 185,
  },
];

const createAccountRows = (accounts: BAppAccount[]) => {
  return accounts.map((account: BAppAccount) => ({
    address: account.id,
    rows: [
      shortenAddress(account.id),
      <div className="flex gap-2">
        <Text>{shortenAddress(account.id)}</Text>
        <CopyBtn variant="subtle" text={account.id} />
      </div>,
      <div className="w-7 h-6 rounded-[4px] bg-primary-100 border border-primary-500 text-primary-500 flex items-center justify-center text-[10px]">
        {account.strategies}
      </div>,
      <div className="w-7 h-6 rounded-[4px] bg-primary-100 border border-primary-500 text-primary-500 flex items-center justify-center text-[10px]">
        {account.bApps}
      </div>,
      <div className="w-7 h-6 rounded-[4px] bg-primary-100 border border-primary-500 text-primary-500 flex items-center justify-center text-[10px]">
        {account.delegators}
      </div>,
      <div className="flex justify-end">
        {Math.floor(
          Number(
            ethFormatter.format(
              +formatUnits(BigInt(account.totalDelegated), 9),
            ),
          ) * 100,
        ) / 100}
        &nbsp;
        <img
          className={"h-[24px] w-[15px]"}
          src={`/images/balance-validator/balance-validator.svg`}
        />
        &nbsp; <Text className="text-gray-500 font-medium">ETH</Text>
      </div>,
      currencyFormatter.format(0),
    ],
  }));
};

const AccountsTable = ({
  onDelegateClick,
}: {
  onDelegateClick: (address: string) => void;
}) => {
  const { accounts, pagination, isLoading } = useBAppAccounts();

  return (
    <AssetsTable
      isLoading={isLoading}
      showDelegateBtn
      onDelegateClick={onDelegateClick}
      data={createAccountRows(accounts)}
      onRowClick={() => console.log("click")}
      tableHeads={headers}
      pagination={pagination}
    />
  );
};

export default AccountsTable;
