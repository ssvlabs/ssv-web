import AssetsTable from "@/app/routes/dashboard/my-account/assets-table.tsx";

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
    textAlign: "text-right",
    size: 174,
  },
  {
    label: "BApps",
    textAlign: "text-right",
    size: 174,
  },
  {
    label: "Delegators",
    textAlign: "text-right",
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

const AccountsTable = () => {
  return (
    <AssetsTable
      data={[]}
      onRowClick={() => console.log("click")}
      tableHeads={headers}
    />
  );
};

export default AccountsTable;
